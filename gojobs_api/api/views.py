from datetime import datetime
import uuid
from django.shortcuts import render
from django_filters.rest_framework import DjangoFilterBackend
# from django.contrib.gis.geos import Point
# from django.contrib.gis.measure import D
from django.core.exceptions import PermissionDenied
from django.db.models import Avg, Sum, Case, When, F, Value
# Create your views here.
from rest_framework import viewsets, permissions, status, filters
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from django.shortcuts import get_object_or_404
from .models import *
from .serializers import *
from .permissions import IsEmployer, IsCandidate, IsOwner, HasSubscription

from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Q, Count
from django.contrib.auth import authenticate

User = get_user_model()

def api_response(data, message=None, status_code=200):
    """
    Formate la réponse API selon le format attendu par le frontend React Native.
    """
    response = {
        "status": "success" if status_code < 400 else "error",
        "data": data
    }
    
    if message:
        response["message"] = message
    
    return Response(response, status=status_code)

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    serializer = UserSerializer(data=request.data)
    
    if serializer.is_valid():
        # Créer l'utilisateur
        user = serializer.save()
        
        # Générer les tokens JWT
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        
        # Construire la réponse standardisée attendue par le frontend
        response_data = {
            "token": access_token,
            "user": serializer.data,
            "refresh": str(refresh)
        }
        
        return api_response(response_data, "Compte créé avec succès", status_code=201)
    
    # En cas d'erreur de validation
    return api_response(None, serializer.errors, status_code=400)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return api_response(None, "Veuillez fournir l'email et le mot de passe", status_code=400)

    # Authentifier l'utilisateur
    user = authenticate(email=email, password=password)

    if not user:
        return api_response(None, "Identifiants invalides", status_code=401)

    # Générer les tokens
    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)

    # Sérialiser les données utilisateur
    user_serializer = UserSerializer(user)

    # Construire la réponse attendue par le frontend
    response_data = {
        "token": access_token,
        "user": user_serializer.data,
        "refresh": str(refresh)
    }

    return api_response(response_data, "Connexion réussie")

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_user(request):
    try:
        # Blacklister le token de rafraîchissement
        refresh_token = request.data.get('refresh')
        token = RefreshToken(refresh_token)
        token.blacklist()
        return api_response(None, "Déconnexion réussie")
    except Exception as e:
        return api_response(None, str(e), status_code=400)
    

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def profile(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['put'])
    def profile(self, request):
        serializer = self.get_serializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['put'], url_path='profile/details')
    def update_profile(self, request):
        user = request.user
        serializer = self.get_serializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'city']
    ordering_fields = ['created_at', 'updated_at', 'salary_amount']
    
    
    def perform_create(self, serializer):
        # Extraire l'ID utilisateur depuis les données de la requête
        user_id = self.request.data.get('user_id')
        if user_id:
            try:
                employer = User.objects.get(id=user_id)
                serializer.save(employer=employer)
            except User.DoesNotExist:
                raise serializers.ValidationError({"user_id": "Utilisateur non trouvé"})
        else:
            # Comportement par défaut si aucun user_id n'est fourni
            if self.request.user.is_authenticated:
                serializer.save(employer=self.request.user)
            else:
                raise serializers.ValidationError({"user_id": "ID utilisateur requis"})
    
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            response = self.get_paginated_response(serializer.data)
            # Adapter la structure pour correspondre à ce que le frontend attend
            return api_response({
                "data": serializer.data,
                "meta": {
                    "current_page": self.paginator.page.number,
                    "last_page": self.paginator.page.paginator.num_pages,
                    "per_page": self.paginator.page_size,
                    "total": self.paginator.page.paginator.count
                }
            })
        
        serializer = self.get_serializer(queryset, many=True)
        return api_response(serializer.data)
    
    def retrieve(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance)
            return api_response(serializer.data)
        except Exception as e:
            print(f"Erreur lors de la récupération de l'emploi: {e}")
            return api_response(None, str(e), status_code=500)
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return api_response(serializer.data, "Offre d'emploi créée avec succès", status_code=201)
        print(serializer.errors)
        return api_response(None, serializer.errors, status_code=400)
    
    @action(detail=False, methods=['GET'])
    def employer(self, request):
        """
        Récupérer les emplois publiés par un employeur spécifique
        GET /api/jobs/employer/?employer_id=<id>
        """
        employer_id = request.query_params.get('employer_id')
        
        if not employer_id:
            return Response(
                {"error": "Le paramètre employer_id est requis"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        try:
            # Récupérer tous les emplois publiés par l'employeur spécifié
            jobs = Job.objects.filter(
                employer_id=employer_id
            ).order_by('-created_at')  # Supposant que tu as un champ 'created_at'
            
            serializer = self.get_serializer(jobs, many=True)
            return Response(serializer.data)
            
        except Exception as e:
            return Response(
                {"error": f"Une erreur s'est produite: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            self.perform_update(serializer)
            return api_response(serializer.data, "Offre d'emploi mise à jour avec succès")
        return api_response(None, serializer.errors, status_code=400)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return api_response(None, "Offre d'emploi supprimée avec succès")
    
    @action(detail=False, methods=['get'])
    def recommended(self, request):
        # Implémentez la logique pour récupérer les emplois recommandés
        user = request.user
        if user.is_candidate:
            # Recommandations basées sur les préférences, compétences, etc.
            # Exemple simple: emplois récents correspondant aux préférences
            jobs = Job.objects.filter(status='active')
            if user.job_preferences:
                categories = user.job_preferences.get('categories', [])
                if categories:
                    jobs = jobs.filter(category__in=categories)
            
            serializer = self.get_serializer(jobs, many=True)
            return api_response(serializer.data)
        
        return api_response(None, "Cette fonctionnalité est disponible uniquement pour les candidats", status_code=403)
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        query = request.query_params.get('q', '')
        category = request.query_params.get('category', None)
        city = request.query_params.get('city', None)
        contract_type = request.query_params.get('contract_type', None)
        
        jobs = Job.objects.filter(status='active')
        
        if query:
            jobs = jobs.filter(title__icontains=query) | jobs.filter(description__icontains=query)
        
        if category:
            jobs = jobs.filter(category=category)
        
        if city:
            jobs = jobs.filter(city=city)
        
        if contract_type:
            jobs = jobs.filter(contract_type=contract_type)
        
        # Pagination
        page = self.paginate_queryset(jobs)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            response = self.get_paginated_response(serializer.data)
            # Adapter la structure pour correspondre à ce que le frontend attend
            return api_response({
                "data": serializer.data,
                "meta": {
                    "current_page": self.paginator.page.number,
                    "last_page": self.paginator.page.paginator.num_pages,
                    "per_page": self.paginator.page_size,
                    "total": self.paginator.page.paginator.count
                }
            })
        
        serializer = self.get_serializer(jobs, many=True)
        return api_response(serializer.data)
    
    
    filter_backends = [filters.SearchFilter, DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = [
        'category', 'subcategory', 'contract_type', 'city',
        'is_urgent', 'is_new', 'is_top', 'status',
        'accepts_working_visa', 'accepts_holiday_visa', 'accepts_student_visa',
        'has_accommodation', 'accommodation_accepts_children', 'accommodation_accepts_dogs',
        'accommodation_is_accessible', 'job_accepts_handicapped', 'has_company_car',
        'is_entry_level', 'requires_driving_license'
    ]
    search_fields = ['title', 'description', 'company_name', 'city', 'address']
    ordering_fields = ['created_at', 'updated_at', 'salary_amount', 'applications_count', 'views_count']
    
    @action(detail=False, methods=['get'])
    def recommended(self, request):
        """
        Récupère les offres d'emploi recommandées pour l'utilisateur actuel
        """
        user = request.user
        
        # Vérifier que l'utilisateur est un candidat
        if user.role != 'candidate':
            return Response(
                {"detail": "Cette fonctionnalité n'est disponible que pour les candidats"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Obtenir les recommandations
        from .services import get_job_recommendations
        recommendations = get_job_recommendations(user)
        
        # Formater la réponse
        job_ids = [job.id for job, _ in recommendations]
        jobs = Job.objects.filter(id__in=job_ids)
        
        # Associer les scores aux emplois
        job_scores = {job.id: score for job, score in recommendations}
        result = []
        
        for job in jobs:
            job_data = JobSerializer(job, context={'request': request}).data
            job_data['match_percentage'] = job_scores.get(job.id, 0)
            result.append(job_data)
        
        return Response(result)

    @action(detail=True, methods=['get'], url_path='similar')
    def similar_jobs(self, request, pk=None):
        """
        Récupère des emplois similaires à l'emploi spécifié
        """
        from .services import get_similar_jobs
        similar_jobs = get_similar_jobs(pk)
        serializer = self.get_serializer(similar_jobs, many=True)
        return Response(serializer.data)
    def get_queryset(self):
        queryset = Job.objects.filter(status='active')
        
        # Filtrer par salaire
        salary_min = self.request.query_params.get('salary_min')
        salary_max = self.request.query_params.get('salary_max')
        salary_type = self.request.query_params.get('salary_type')
        
        if salary_min:
            try:
                salary_min = float(salary_min)
                queryset = queryset.filter(salary_amount__gte=salary_min)
            except ValueError:
                pass
        
        if salary_max:
            try:
                salary_max = float(salary_max)
                queryset = queryset.filter(salary_amount__lte=salary_max)
            except ValueError:
                pass
        
        if salary_type:
            queryset = queryset.filter(salary_type=salary_type)
        
        # Filtrer par distance (si la latitude et longitude sont fournies)
        lat = self.request.query_params.get('lat')
        lng = self.request.query_params.get('lng')
        distance = self.request.query_params.get('distance')
        
        if lat and lng and distance:
            try:
                lat = float(lat)
                lng = float(lng)
                distance = float(distance)
                
                # Calculer un carré approximatif autour du point
                # 1 degré ≈ 111 km à l'équateur (approximation)
                delta = distance / 111.0
                
                # Filtrer les emplois dans le carré approximatif
                queryset = queryset.filter(
                    latitude__gte=lat-delta,
                    latitude__lte=lat+delta,
                    longitude__gte=lng-delta,
                    longitude__lte=lng+delta
                )
            except ValueError:
                pass
        
        # Filtrer par options de logement
        accommodation = self.request.query_params.get('accommodation')
        if accommodation == 'true':
            queryset = queryset.filter(has_accommodation=True)
            
            # Sous-filtres pour le logement
            children = self.request.query_params.get('accommodation_children')
            pets = self.request.query_params.get('accommodation_pets')
            accessible = self.request.query_params.get('accommodation_accessible')
            
            if children == 'true':
                queryset = queryset.filter(accommodation_accepts_children=True)
            
            if pets == 'true':
                queryset = queryset.filter(accommodation_accepts_dogs=True)
            
            if accessible == 'true':
                queryset = queryset.filter(accommodation_is_accessible=True)
        
        # Filtrer par véhicule de fonction
        company_car = self.request.query_params.get('company_car')
        if company_car == 'true':
            queryset = queryset.filter(has_company_car=True)
        
        # Filtrer par niveau d'expérience
        entry_level = self.request.query_params.get('entry_level')
        if entry_level == 'true':
            queryset = queryset.filter(is_entry_level=True)
        
        # Filtrer par type de visa
        visa_type = self.request.query_params.get('visa_type')
        if visa_type:
            if visa_type == 'work':
                queryset = queryset.filter(accepts_working_visa=True)
            elif visa_type == 'holiday':
                queryset = queryset.filter(accepts_holiday_visa=True)
            elif visa_type == 'student':
                queryset = queryset.filter(accepts_student_visa=True)
        
        # Filtrer pour les backpackers
        for_backpackers = self.request.query_params.get('for_backpackers')
        if for_backpackers == 'true':
            queryset = queryset.filter(
                Q(accepts_working_visa=True) | 
                Q(accepts_holiday_visa=True) |
                Q(subcategory='backpacker')
            )
        
        # Filtrer pour les freelances
        is_freelance = self.request.query_params.get('is_freelance')
        if is_freelance == 'true':
            queryset = queryset.filter(
                Q(contract_type='Freelance') |
                Q(subcategory='freelance')
            )
        
        return queryset
class ApplicationViewSet(viewsets.ModelViewSet):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_permissions(self):
        if self.action == 'create':
            self.permission_classes = [permissions.IsAuthenticated, IsCandidate]
        elif self.action == 'update_status':
            self.permission_classes = [permissions.IsAuthenticated, IsEmployer]
        return super().get_permissions()
    
    def get_queryset(self):
        user = self.request.user
        if user.is_employer:
            # Les employeurs voient les candidatures pour leurs offres
            return Application.objects.filter(job__employer=user)
        else:
            # Les candidats voient leurs propres candidatures
            return Application.objects.filter(candidate=user)
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return api_response(serializer.data)
    
    def create(self, request, *args, **kwargs):
        job_id = request.data.get('job_id') or request.data.get('jobId')
        job = get_object_or_404(Job, id=job_id)
        
        # Gérer le fichier CV et la lettre de motivation comme FormData
        cv_file = request.FILES.get('cv')
        lettre_file = request.FILES.get('lettre')
        
        # Créer l'objet Application avec les données de base
        application_data = {
            'job': job,
            'candidate': request.user,
            'status': 'pending'
        }
        
        # Ajouter le CV et la lettre si présents
        if cv_file:
            application_data['cv_url'] = cv_file
        if lettre_file:
            application_data['motivation_letter_url'] = lettre_file
        
        # Ajouter les réponses aux questions si présentes
        custom_answers = {}
        for key, value in request.data.items():
            if key.startswith('question_'):
                custom_answers[key] = value
        
        if custom_answers:
            application_data['custom_answers'] = custom_answers
        
        # Créer l'application
        application = Application.objects.create(**application_data)
        serializer = self.get_serializer(application)
        
        return api_response(serializer.data, "Candidature envoyée avec succès", status_code=201)
    
    @action(detail=True, methods=['put'], url_path='status')
    def update_status(self, request, pk=None):
        application = self.get_object()
        # Vérifier que l'offre appartient à l'employeur
        if application.job.employer != request.user:
            return api_response(None, "Vous n'êtes pas autorisé à modifier cette candidature", status_code=403)
        
        status_value = request.data.get('status')
        if status_value not in [s[0] for s in Application.STATUS_CHOICES]:
            return api_response(None, "Statut invalide", status_code=400)
        
        application.status = status_value
        application.save()
        serializer = self.get_serializer(application)
        
        return api_response(serializer.data, "Statut de la candidature mis à jour")

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    # permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return Message.objects.filter(sender=user) | Message.objects.filter(receiver=user)
    
    # Nouvelle méthode pour la liste des conversations basée sur l'ID utilisateur
    @action(detail=False, methods=['get'], url_path='user/(?P<user_id>[^/.]+)/conversations')
    def user_conversations(self, request, user_id=None):
        try:
            user = User.objects.get(id=user_id)
            
            # Obtenir tous les utilisateurs avec qui l'utilisateur a échangé des messages
            sent_to = Message.objects.filter(sender=user).values_list('receiver', flat=True).distinct()
            received_from = Message.objects.filter(receiver=user).values_list('sender', flat=True).distinct()
            
            conversation_users_ids = set(list(sent_to) + list(received_from))
            conversation_users = User.objects.filter(id__in=conversation_users_ids)
            
            # Créer un dictionnaire avec les derniers messages pour chaque conversation
            conversations = []
            for other_user in conversation_users:
                # Obtenir le dernier message échangé avec cet utilisateur
                last_message = Message.objects.filter(
                    (Q(sender=user) & Q(receiver=other_user)) | 
                    (Q(sender=other_user) & Q(receiver=user))
                ).order_by('-created_at').first()
                
                if last_message:
                    conversations.append({
                        'id': other_user.id,  # Utiliser l'ID de l'autre utilisateur comme ID de conversation
                        'user': UserSerializer(other_user).data,
                        'last_message': MessageSerializer(last_message).data,
                        'unread_count': Message.objects.filter(sender=other_user, receiver=user, is_read=False).count()
                    })
            
            # Trier les conversations par date du dernier message
            conversations.sort(key=lambda x: x['last_message']['created_at'], reverse=True)
            
            return Response(conversations)
        except User.DoesNotExist:
            return Response({"error": "Utilisateur non trouvé"}, status=status.HTTP_404_NOT_FOUND)
    
    # Méthode pour obtenir les messages d'une conversation spécifique
    @action(detail=False, methods=['get'], url_path='conversation/(?P<conversation_id>[^/.]+)')
    def conversation_messages(self, request, conversation_id=None):
        try:
            # Ici, conversation_id est en fait l'ID de l'autre utilisateur
            user = request.user
            other_user = User.objects.get(id=conversation_id)
            
            # Obtenir tous les messages entre ces deux utilisateurs
            messages = Message.objects.filter(
                (Q(sender=user) & Q(receiver=other_user)) | 
                (Q(sender=other_user) & Q(receiver=user))
            ).order_by('-created_at')
            
            # Marquer les messages comme lus
            unread_messages = messages.filter(receiver=user, is_read=False)
            unread_messages.update(is_read=True)
            
            conversation = {
                'id': other_user.id,
                'participants': [
                    UserSerializer(user).data,
                    UserSerializer(other_user).data
                ]
            }
            
            return Response({
                'conversation': conversation,
                'messages': MessageSerializer(messages, many=True).data
            })
        except User.DoesNotExist:
            return Response({"error": "Utilisateur non trouvé"}, status=status.HTTP_404_NOT_FOUND)
    
    # Méthode pour envoyer un message
    @action(detail=False, methods=['post'])
    def send_message(self, request):
        sender = request.user
        receiver_id = request.data.get('receiver_id')
        text = request.data.get('text')
        job_id = request.data.get('job_id', None)
        
        if not receiver_id or not text:
            return Response({"error": "receiver_id et text sont requis"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            receiver = User.objects.get(id=receiver_id)
            
            job = None
            if job_id:
                job = Job.objects.get(id=job_id)
            
            message = Message.objects.create(
                sender=sender,
                receiver=receiver,
                content=text,
                job=job
            )
            
            return Response(MessageSerializer(message).data)
        except User.DoesNotExist:
            return Response({"error": "Destinataire non trouvé"}, status=status.HTTP_404_NOT_FOUND)
        except Job.DoesNotExist:
            return Response({"error": "Offre d'emploi non trouvée"}, status=status.HTTP_404_NOT_FOUND)

class SubscriptionPlanViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet pour les plans d'abonnement (read-only)."""
    queryset = SubscriptionPlan.objects.filter(is_active=True)
    serializer_class = SubscriptionPlanSerializer
    permission_classes = [permissions.AllowAny]
    
    @action(detail=False, methods=['get'])
    def employer_plans(self, request):
        """Récupérer uniquement les plans pour employeurs."""
        plans = SubscriptionPlan.objects.filter(
            is_active=True, 
            type__in=['basic_pro', 'standard_pro', 'premium_pro']
        )
        serializer = self.get_serializer(plans, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def candidate_plans(self, request):
        """Récupérer uniquement les plans pour candidats."""
        plans = SubscriptionPlan.objects.filter(
            is_active=True, 
            type__in=['apply_ai', 'apply_ai_pro']
        )
        serializer = self.get_serializer(plans, many=True)
        return Response(serializer.data)


class SubscriptionViewSet(viewsets.ModelViewSet):
    """ViewSet pour les abonnements des utilisateurs."""
    serializer_class = SubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Subscription.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        subscription = serializer.save(user=self.request.user)
        
        # Créer une notification pour l'utilisateur
        Notification.objects.create(
            user=self.request.user,
            type='subscription',
            data={
                'subscription_id': subscription.id,
                'plan_name': subscription.plan.name,
                'amount': str(subscription.amount),
                'billing_cycle': subscription.billing_cycle,
                'expires_at': subscription.expires_at.isoformat(),
                'message': f"Votre abonnement {subscription.plan.name} a été activé avec succès."
            }
        )
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Annuler un abonnement."""
        subscription = self.get_object()
        
        if subscription.status == 'cancelled':
            return Response({"detail": "Cet abonnement est déjà annulé."}, 
                           status=status.HTTP_400_BAD_REQUEST)
        
        subscription.status = 'cancelled'
        subscription.auto_renew = False
        subscription.cancelled_at = timezone.now()
        subscription.save()
        
        # Créer une notification pour l'utilisateur
        Notification.objects.create(
            user=self.request.user,
            type='subscription',
            data={
                'subscription_id': subscription.id,
                'plan_name': subscription.plan.name,
                'message': f"Votre abonnement {subscription.plan.name} a été annulé. Il restera actif jusqu'au {subscription.expires_at.strftime('%d/%m/%Y')}."
            }
        )
        
        return Response({"detail": "Abonnement annulé avec succès."})
    
    @action(detail=True, methods=['post'])
    def renew(self, request, pk=None):
        """Renouveler un abonnement."""
        subscription = self.get_object()
        
        if subscription.status not in ['active', 'expired']:
            return Response({"detail": "Impossible de renouveler cet abonnement."}, 
                           status=status.HTTP_400_BAD_REQUEST)
        
        # Logique de renouvellement
        now = timezone.now()
        
        if subscription.billing_cycle == 'weekly':
            expires_at = now + timedelta(days=7)
        elif subscription.billing_cycle == 'monthly':
            expires_at = now + timedelta(days=30)
        elif subscription.billing_cycle == 'yearly':
            expires_at = now + timedelta(days=365)
        else:
            expires_at = now + timedelta(days=30)  # Par défaut
        
        subscription.status = 'active'
        subscription.starts_at = now
        subscription.expires_at = expires_at
        subscription.next_billing_date = expires_at
        subscription.auto_renew = True
        subscription.cancelled_at = None
        subscription.save()
        
        # Créer une notification pour l'utilisateur
        Notification.objects.create(
            user=self.request.user,
            type='subscription',
            data={
                'subscription_id': subscription.id,
                'plan_name': subscription.plan.name,
                'expires_at': expires_at.isoformat(),
                'message': f"Votre abonnement {subscription.plan.name} a été renouvelé jusqu'au {expires_at.strftime('%d/%m/%Y')}."
            }
        )
        
        return Response({"detail": "Abonnement renouvelé avec succès."})
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Récupérer l'abonnement actif de l'utilisateur."""
        subscription = Subscription.objects.filter(
            user=request.user,
            status='active',
            expires_at__gt=timezone.now()
        ).first()
        
        if not subscription:
            return Response({"detail": "Aucun abonnement actif trouvé."}, 
                           status=status.HTTP_404_NOT_FOUND)
        
        serializer = self.get_serializer(subscription)
        return Response(serializer.data)


class PaymentViewSet(viewsets.ModelViewSet):
    """ViewSet pour les paiements."""
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Payment.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['post'])
    def process(self, request):
        """Traiter un paiement."""
        amount = request.data.get('amount')
        payment_method = request.data.get('payment_method')
        subscription_id = request.data.get('subscription_id')
        plan_id = request.data.get('plan_id')
        job_id = request.data.get('job_id')
        boost_type = request.data.get('boost_type')
        
        # Simuler la génération d'un ID de transaction
        transaction_id = f"trans_{uuid.uuid4().hex}"
        
        # Créer le paiement
        payment_data = {
            'user': request.user.id,
            'amount': amount,
            'payment_method': payment_method,
            'transaction_id': transaction_id,
            'status': 'completed'
        }
        
        # Si c'est pour un abonnement
        if subscription_id:
            payment_data['subscription'] = subscription_id
            
            # Mettre à jour le statut de l'abonnement
            subscription = get_object_or_404(Subscription, id=subscription_id)
            subscription.status = 'active'
            subscription.save()
        
        # Si c'est pour un nouveau plan
        elif plan_id:
            plan = get_object_or_404(SubscriptionPlan, id=plan_id)
            
            # Créer un nouvel abonnement
            subscription = Subscription.objects.create(
                user=request.user,
                plan=plan,
                amount=plan.price,
                billing_cycle=plan.billing_cycle,
                status='active'
            )
            
            payment_data['subscription'] = subscription.id
        
        # Si c'est pour un boost d'annonce
        elif job_id and boost_type:
            job = get_object_or_404(Job, id=job_id)
            
            # Déterminer le prix du boost
            if boost_type == 'urgent':
                boost_amount = 3.0  # 3€ / jour
            elif boost_type == 'new':
                boost_amount = 1.5  # 1.50€ / jour
            elif boost_type == 'top':
                boost_amount = 2.0  # 2€ / jour
            else:
                return Response({"detail": "Type de boost invalide"}, 
                               status=status.HTTP_400_BAD_REQUEST)
            
            # Créer le boost
            boost = JobBoost.objects.create(
                job=job,
                type=boost_type,
                amount=boost_amount * 7,  # 7 jours par défaut
                expires_at=timezone.now() + timedelta(days=7)
            )
            
            # Mettre à jour le paiement avec le montant du boost
            payment_data['amount'] = boost.amount
        
        serializer = self.get_serializer(data=payment_data)
        if serializer.is_valid():
            payment = serializer.save()
            
            # Mettre à jour le boost avec le paiement
            if 'boost' in locals() and boost:
                boost.payment = payment
                boost.save()
            
            # Créer une notification pour l'utilisateur
            Notification.objects.create(
                user=request.user,
                type='payment',
                data={
                    'payment_id': payment.id,
                    'amount': str(payment.amount),
                    'payment_method': payment.payment_method,
                    'message': f"Votre paiement de {payment.amount}€ a été traité avec succès."
                }
            )
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def refund_request(self, request, pk=None):
        """Demander un remboursement."""
        payment = self.get_object()
        
        if payment.status not in ['completed']:
            return Response({"detail": "Ce paiement ne peut pas être remboursé."}, 
                           status=status.HTTP_400_BAD_REQUEST)
        
        reason = request.data.get('reason', '')
        
        payment.status = 'refund_requested'
        payment.refund_reason = reason
        payment.refund_requested_at = timezone.now()
        payment.save()
        
        # Créer une notification pour l'administrateur
        admin_users = User.objects.filter(role='admin')
        for admin in admin_users:
            Notification.objects.create(
                user=admin,
                type='payment',
                data={
                    'payment_id': payment.id,
                    'user_id': request.user.id,
                    'user_email': request.user.email,
                    'amount': str(payment.amount),
                    'reason': reason,
                    'message': f"Demande de remboursement pour le paiement #{payment.id} de {payment.amount}€."
                }
            )
        
        return Response({"detail": "Demande de remboursement enregistrée."})

class JobBoostViewSet(viewsets.ModelViewSet):
    """ViewSet pour les boosts d'annonces."""
    serializer_class = JobBoostSerializer
    permission_classes = [permissions.IsAuthenticated, IsEmployer]
    
    def get_queryset(self):
        # Un employeur ne voit que ses propres boosts
        return JobBoost.objects.filter(job__employer=self.request.user)
    
    def perform_create(self, serializer):
        job = serializer.validated_data.get('job')
        
        # Vérifier que l'emploi appartient à l'utilisateur
        if job.employer != self.request.user:
            raise PermissionDenied("Vous ne pouvez booster que vos propres annonces")
        
        serializer.save()
class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Payment.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['post'])
    def process(self, request):
        # Logique pour traiter un paiement
        # Cette méthode pourrait appeler un service de paiement externe
        amount = request.data.get('amount')
        payment_method = request.data.get('payment_method')
        subscription_id = request.data.get('subscription_id', None)
        
        # Logique de traitement du paiement ici
        # ...
        
        # Supposons que le paiement soit réussi
        payment_data = {
            'user': request.user.id,
            'amount': amount,
            'payment_method': payment_method,
            'transaction_id': 'transaction_id_from_payment_gateway',
            'status': 'completed'
        }
        
        if subscription_id:
            payment_data['subscription'] = subscription_id
        
        serializer = self.get_serializer(data=payment_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def history(self, request):
        payments = self.get_queryset().order_by('-payment_date')
        serializer = self.get_serializer(payments, many=True)
        return Response(serializer.data)
    
class FlashJobViewSet(viewsets.ModelViewSet):
    queryset = FlashJob.objects.all()
    serializer_class = FlashJobSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend, filters.OrderingFilter]
    search_fields = ['job__title', 'job__description', 'job__company', 'job__city']
    filterset_fields = ['status', 'is_immediate', 'confirmation_required']
    ordering_fields = ['start_time', 'created_at', 'salary_per_hour', 'salary_total']
    ordering = ['start_time']
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'confirm_applicant']:
            self.permission_classes = [permissions.IsAuthenticated, IsEmployer]
        elif self.action in ['apply', 'confirm_interest']:
            self.permission_classes = [permissions.IsAuthenticated, IsCandidate]
        return super().get_permissions()
    
    def get_queryset(self):
        queryset = FlashJob.objects.all()
        
        # Filtrer par statut
        status = self.request.query_params.get('status')
        if status:
            queryset = queryset.filter(status=status)
        
        # Filtrer par démarrage immédiat
        is_immediate = self.request.query_params.get('is_immediate')
        if is_immediate is not None:
            queryset = queryset.filter(is_immediate=is_immediate.lower() == 'true')
        
        # Filtrer par date
        date = self.request.query_params.get('date')
        if date:
            # Format attendu: YYYY-MM-DD
            try:
                date_obj = datetime.strptime(date, '%Y-%m-%d').date()
                queryset = queryset.filter(
                    start_time__date=date_obj
                )
            except ValueError:
                pass
        
        # Filtrer par localisation
        location = self.request.query_params.get('location')
        if location:
            queryset = queryset.filter(job__city__icontains=location)
        
        # Ne pas afficher les emplois flash expirés ou pourvus sauf demande explicite
        include_expired = self.request.query_params.get('include_expired', 'false').lower() == 'true'
        include_filled = self.request.query_params.get('include_filled', 'false').lower() == 'true'
        
        if not include_expired:
            queryset = queryset.filter(Q(end_time__gt=timezone.now()) | Q(status='active'))
        
        if not include_filled:
            queryset = queryset.exclude(status='filled')
        
        return queryset
    
    def perform_create(self, serializer):
        # Vérifier que l'emploi appartient à l'utilisateur
        job = serializer.validated_data.get('job_id')
        if job.employer != self.request.user:
            raise PermissionDenied("Vous ne pouvez créer un emploi flash que pour vos propres offres")
        
        serializer.save()
    
    @action(detail=True, methods=['post'])
    def apply(self, request, pk=None):
        """Postuler à un emploi flash"""
        flash_job = self.get_object()
        
        # Vérifier que l'emploi flash est actif
        if flash_job.status != 'active':
            return Response({"detail": "Cet emploi flash n'est plus disponible"}, 
                           status=status.HTTP_400_BAD_REQUEST)
        
        # Vérifier que l'utilisateur n'a pas déjà postulé
        if Application.objects.filter(job=flash_job.job, candidate=request.user).exists():
            return Response({"detail": "Vous avez déjà postulé à cet emploi flash"}, 
                           status=status.HTTP_400_BAD_REQUEST)
        
        # Créer une candidature
        application = Application.objects.create(
            job=flash_job.job,
            candidate=request.user,
            status='pending'
        )
        
        # Incrémenter le compteur de candidatures
        flash_job.current_applicants += 1
        flash_job.save()
        
        # Créer une notification pour l'employeur
        Notification.objects.create(
            user=flash_job.job.employer,
            type='new_application',
            data={
                'job_id': flash_job.job.id,
                'job_title': flash_job.job.title,
                'flash_job_id': flash_job.id,
                'candidate_id': request.user.id,
                'candidate_name': f"{request.user.first_name} {request.user.last_name}",
                'application_id': application.id
            }
        )
        
        serializer = ApplicationSerializer(application)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'], url_path='confirm-interest')
    def confirm_interest(self, request, pk=None):
        """Confirmer l'intérêt pour un emploi flash (candidat)"""
        flash_job = self.get_object()
        application = get_object_or_404(
            Application, 
            job=flash_job.job,
            candidate=request.user
        )
        
        application.status = 'on_hold'  # En attente de confirmation de l'employeur
        application.save()
        
        # Créer une notification pour l'employeur
        Notification.objects.create(
            user=flash_job.job.employer,
            type='application_status',
            data={
                'job_id': flash_job.job.id,
                'job_title': flash_job.job.title,
                'flash_job_id': flash_job.id,
                'candidate_id': request.user.id,
                'candidate_name': f"{request.user.first_name} {request.user.last_name}",
                'application_id': application.id,
                'status': 'confirmed_interest'
            }
        )
        
        return Response({"detail": "Intérêt confirmé avec succès"}, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['post'], url_path='confirm-applicant/(?P<application_id>[^/.]+)')
    def confirm_applicant(self, request, pk=None, application_id=None):
        """Confirmer un candidat pour un emploi flash (employeur)"""
        flash_job = self.get_object()
        
        # Vérifier que l'emploi flash appartient à l'employeur
        if flash_job.job.employer != request.user:
            raise PermissionDenied("Vous n'êtes pas autorisé à confirmer des candidats pour cet emploi flash")
        
        application = get_object_or_404(Application, id=application_id, job=flash_job.job)
        
        # Mettre à jour le statut de la candidature
        application.status = 'accepted'
        application.save()
        
        # Mettre à jour le statut de l'emploi flash si nécessaire
        if flash_job.confirmation_required:
            flash_job.is_confirmed = True
            flash_job.save()
        
        # Créer une notification pour le candidat
        Notification.objects.create(
            user=application.candidate,
            type='application_status',
            data={
                'job_id': flash_job.job.id,
                'job_title': flash_job.job.title,
                'flash_job_id': flash_job.id,
                'employer_id': request.user.id,
                'employer_name': flash_job.job.company,
                'application_id': application.id,
                'status': 'accepted'
            }
        )
        
        return Response({"detail": "Candidat confirmé avec succès"}, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'])
    def immediate(self, request):
        """Récupérer les emplois flash à démarrage immédiat"""
        flash_jobs = FlashJob.objects.filter(
            is_immediate=True,
            status='active',
            end_time__gt=timezone.now()
        ).order_by('start_time')
        
        serializer = self.get_serializer(flash_jobs, many=True)
        return Response(serializer.data)
    
class FavoriteViewSet(viewsets.ModelViewSet):
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        # Extraire uniquement les jobs pour un format plus simple
        jobs = [item['job'] for item in serializer.data]
        return api_response(jobs)
    
    @action(detail=False, methods=['post'], url_path='toggle/(?P<job_id>[^/.]+)')
    def toggle(self, request, job_id=None):
        job = get_object_or_404(Job, id=job_id)
        try:
            favorite = Favorite.objects.get(user=request.user, job=job)
            # Si le favori existait déjà, on le supprime
            favorite.delete()
            return api_response({"isFavorite": False}, "Offre retirée des favoris")
        except Favorite.DoesNotExist:
            # Sinon, on le crée
            favorite = Favorite.objects.create(user=request.user, job=job)
            serializer = self.get_serializer(favorite)
            return api_response({"isFavorite": True}, "Offre ajoutée aux favoris", status_code=201)
        

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')
    
    @action(detail=True, methods=['put'], url_path='read')
    def mark_as_read(self, request, pk=None):
        """
        Marquer une notification individuelle comme lue
        """
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        serializer = self.get_serializer(notification)
        return Response(serializer.data)
    
    @action(detail=False, methods=['put'], url_path='read-all')
    def mark_all_as_read(self, request):
        """
        Marquer toutes les notifications de l'utilisateur comme lues
        """
        notifications = self.get_queryset().filter(is_read=False)
        count = notifications.count()
        notifications.update(is_read=True)
        
        return Response({"detail": f"{count} notifications ont été marquées comme lues"}, 
                       status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'], url_path='unread-count')
    def unread_count(self, request):
        """
        Obtenir le nombre de notifications non lues
        """
        count = self.get_queryset().filter(is_read=False).count()
        return Response({"count": count})
    
    @action(detail=False, methods=['get'], url_path='by-type/(?P<notification_type>[^/.]+)')
    def by_type(self, request, notification_type=None):
        """
        Filtrer les notifications par type
        """
        if notification_type not in [choice[0] for choice in Notification.TYPE_CHOICES]:
            return Response(
                {"detail": f"Type de notification invalide. Choix valides: {[choice[0] for choice in Notification.TYPE_CHOICES]}"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        notifications = self.get_queryset().filter(type=notification_type)
        page = self.paginate_queryset(notifications)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(notifications, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['delete'], url_path='clear-all')
    def clear_all(self, request):
        """
        Supprimer toutes les notifications de l'utilisateur
        """
        count = self.get_queryset().count()
        self.get_queryset().delete()
        
        return Response({"detail": f"{count} notifications ont été supprimées"}, 
                       status=status.HTTP_200_OK)  
    

class StatisticsViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated, IsEmployer]
    
    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        """
        Obtenir les statistiques du tableau de bord de l'employeur.
        Inclut des données agrégées sur toutes les offres d'emploi de l'employeur.
        """
        user = request.user
        jobs = Job.objects.filter(employer=user)
        
        # Statistiques de base
        total_jobs = jobs.count()
        active_jobs = jobs.filter(status='active').count()
        total_applications = Application.objects.filter(job__employer=user).count()
        new_applications = Application.objects.filter(job__employer=user, is_read=False).count()
        
        # Calculer le taux de CV (conversion)
        total_views = sum(job.views_count for job in jobs)
        cv_rate = round((total_applications / total_views * 100), 2) if total_views > 0 else 0
        
        # Récupérer les données pour les graphiques
        # Récupérer les 14 derniers jours de statistiques
        end_date = timezone.now().date()
        start_date = end_date - timedelta(days=13)
        
        # Créer un dictionnaire avec toutes les dates
        date_range = [start_date + timedelta(days=i) for i in range(14)]
        views_data = {date: 0 for date in date_range}
        application_data = {date: 0 for date in date_range}
        
        # Remplir avec les données réelles
        stats = Statistic.objects.filter(
            job__in=jobs,
            date__gte=start_date,
            date__lte=end_date
        ).values('date').annotate(
            total_views=Sum('views'),
            total_applications=Sum('applications')
        )
        
        for stat in stats:
            date = stat['date']
            views_data[date] = stat['total_views']
            application_data[date] = stat['total_applications']
        
        # Formater pour la réponse
        views_chart_data = {
            'labels': [date.strftime('%d/%m') for date in date_range],
            'values': [views_data[date] for date in date_range]
        }
        
        application_chart_data = {
            'labels': [date.strftime('%d/%m') for date in date_range],
            'values': [application_data[date] for date in date_range]
        }
        
        # Meilleures offres d'emploi
        top_jobs = jobs.annotate(
            cv_count=Count('applications'),
            cv_rate=Case(
                When(views_count__gt=0, then=F('applications_count') * 100.0 / F('views_count')),
                default=Value(0.0)
            )
        ).order_by('-cv_count')[:5]
        
        active_jobs_data = [{
            'id': job.id,
            'title': job.title,
            'views': job.views_count,
            'cvCount': job.applications_count,
            'cvRate': round(job.conversion_rate, 2)
        } for job in top_jobs]
        
        return Response({
            'totalJobs': total_jobs,
            'activeJobs': active_jobs,
            'totalApplications': total_applications,
            'totalViews': total_views,
            'cvRate': cv_rate,
            'newApplications': new_applications,
            'viewsData': views_chart_data,
            'applicationData': application_chart_data,
            'activeJobsData': active_jobs_data
        })
    
    @action(detail=False, methods=['get'], url_path='job/(?P<job_id>[^/.]+)')
    def job_stats(self, request, job_id=None):
        """
        Obtenir des statistiques détaillées pour une offre d'emploi spécifique,
        y compris les tendances quotidiennes et les performances.
        """
        job = get_object_or_404(Job, id=job_id, employer=request.user)
        
        # Récupérer les statistiques pour cette offre d'emploi
        end_date = timezone.now().date()
        start_date = end_date - timedelta(days=30)  # Dernier mois
        
        # Créer un dictionnaire avec toutes les dates
        date_range = [start_date + timedelta(days=i) for i in range(31)]
        daily_stats = {date: {'views': 0, 'applications': 0, 'conversion_rate': 0} for date in date_range}
        
        # Récupérer les statistiques réelles
        stats = Statistic.objects.filter(
            job=job,
            date__gte=start_date,
            date__lte=end_date
        ).order_by('date')
        
        for stat in stats:
            daily_stats[stat.date] = {
                'views': stat.views,
                'applications': stat.applications,
                'conversion_rate': stat.conversion_rate
            }
        
        # Formater les données pour les graphiques
        charts_data = {
            'labels': [date.strftime('%d/%m') for date in date_range],
            'views': [daily_stats[date]['views'] for date in date_range],
            'applications': [daily_stats[date]['applications'] for date in date_range],
            'conversion_rates': [daily_stats[date]['conversion_rate'] for date in date_range]
        }
        
        # Statistiques de résumé
        total_views = job.views_count
        total_applications = job.applications_count
        conversion_rate = job.conversion_rate
        
        # Comparer avec la moyenne de toutes les offres de l'employeur
        employer_jobs = Job.objects.filter(employer=request.user).exclude(id=job.id)
        avg_views = employer_jobs.aggregate(Avg('views_count'))['views_count__avg'] or 0
        avg_applications = employer_jobs.aggregate(Avg('applications_count'))['applications_count__avg'] or 0
        avg_conversion = employer_jobs.aggregate(Avg('conversion_rate'))['conversion_rate__avg'] or 0
        
        # Calculer les comparaisons en pourcentage
        views_comparison = ((total_views - avg_views) / avg_views * 100) if avg_views > 0 else 0
        applications_comparison = ((total_applications - avg_applications) / avg_applications * 100) if avg_applications > 0 else 0
        conversion_comparison = ((conversion_rate - avg_conversion) / avg_conversion * 100) if avg_conversion > 0 else 0
        
        return Response({
            'job_id': job.id,
            'title': job.title,
            'views': total_views,
            'applications': total_applications,
            'conversion_rate': conversion_rate,
            'views_comparison': round(views_comparison, 2),
            'applications_comparison': round(applications_comparison, 2),
            'conversion_comparison': round(conversion_comparison, 2),
            'daily_stats': charts_data,
            'status': job.status,
            'expires_at': job.expires_at,
            'days_until_expiry': job.days_until_expiry
        })
    
    @action(detail=False, methods=['get'])
    def performance_by_type(self, request):
        """
        Retourne les performances comparatives entre les offres normales, urgentes et top.
        """
        user = request.user
        jobs = Job.objects.filter(employer=user)
        
        # Performances par type d'offre
        normal_jobs = jobs.filter(is_urgent=False, is_top=False)
        urgent_jobs = jobs.filter(is_urgent=True)
        top_jobs = jobs.filter(is_top=True)
        
        # Calculer les métriques moyennes pour chaque type
        normal_stats = {
            'count': normal_jobs.count(),
            'avg_views': normal_jobs.aggregate(Avg('views_count'))['views_count__avg'] or 0,
            'avg_applications': normal_jobs.aggregate(Avg('applications_count'))['applications_count__avg'] or 0,
            'avg_conversion': normal_jobs.aggregate(Avg('conversion_rate'))['conversion_rate__avg'] or 0
        }
        
        urgent_stats = {
            'count': urgent_jobs.count(),
            'avg_views': urgent_jobs.aggregate(Avg('views_count'))['views_count__avg'] or 0,
            'avg_applications': urgent_jobs.aggregate(Avg('applications_count'))['applications_count__avg'] or 0,
            'avg_conversion': urgent_jobs.aggregate(Avg('conversion_rate'))['conversion_rate__avg'] or 0
        }
        
        top_stats = {
            'count': top_jobs.count(),
            'avg_views': top_jobs.aggregate(Avg('views_count'))['views_count__avg'] or 0,
            'avg_applications': top_jobs.aggregate(Avg('applications_count'))['applications_count__avg'] or 0,
            'avg_conversion': top_jobs.aggregate(Avg('conversion_rate'))['conversion_rate__avg'] or 0
        }
        
        return Response({
            'normal': normal_stats,
            'urgent': urgent_stats,
            'top': top_stats
        })
class ContractViewSet(viewsets.ModelViewSet):
    queryset = Contract.objects.all()
    serializer_class = ContractSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [permissions.IsAuthenticated, IsEmployer]
        elif self.action == 'sign':
            self.permission_classes = [permissions.IsAuthenticated, IsCandidate]
        return super().get_permissions()
    
    def get_queryset(self):
        user = self.request.user
        if user.is_employer:
            return Contract.objects.filter(employer=user)
        else:
            return Contract.objects.filter(candidate=user)
    
    def perform_create(self, serializer):
        job_id = self.request.data.get('job_id')
        job = get_object_or_404(Job, id=job_id, employer=self.request.user)
        candidate_id = self.request.data.get('candidate_id')
        candidate = get_object_or_404(User, id=candidate_id)
        
        serializer.save(employer=self.request.user, job=job, candidate=candidate)
    
    @action(detail=True, methods=['post'])
    def sign(self, request, pk=None):
        contract = self.get_object()
        
        # Vérifier que le contrat est adressé à cet utilisateur
        if contract.candidate != request.user:
            return Response({"detail": "Vous n'êtes pas autorisé à signer ce contrat"}, 
                           status=status.HTTP_403_FORBIDDEN)
        
        # Logique pour signer un contrat
        if contract.status != 'sent':
            return Response({"detail": "Ce contrat n'est pas en attente de signature"}, 
                           status=status.HTTP_400_BAD_REQUEST)
        
        contract.status = 'signed'
        contract.signed_at = timezone.now()
        contract.save()
        
        serializer = self.get_serializer(contract)
        return Response(serializer.data)
class ApplyAIViewSet(viewsets.ModelViewSet):
    serializer_class = ApplyAiSettingSerializer
    permission_classes = [permissions.IsAuthenticated, IsCandidate]
    
    def get_queryset(self):
        return ApplyAiSetting.objects.filter(user=self.request.user)
    
    def get_permissions(self):
        if self.action in ['store', 'suggestions', 'apply_to_job', 'auto_apply', 'settings']:
            self.permission_classes = [permissions.IsAuthenticated, IsCandidate, HasSubscription(['apply_ai', 'apply_ai_pro'])]
        return super().get_permissions()
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['post'], url_path='upload-cv')
    def upload_cv(self, request):
        """Upload CV pour analyse par ApplyAI"""
        settings, created = ApplyAiSetting.objects.get_or_create(user=request.user)
        
        if 'cv_file' not in request.FILES:
            return Response({"detail": "Aucun fichier CV fourni"}, status=status.HTTP_400_BAD_REQUEST)
        
        settings.cv_file = request.FILES['cv_file']
        settings.save()
        
        return Response({"detail": "CV téléchargé avec succès"}, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'])
    def suggestions(self, request):
        """Récupérer les suggestions d'emploi générées par ApplyAI"""
        suggestions = ApplyAiSuggestion.objects.filter(user=request.user).order_by('-match_percentage')
        serializer = ApplyAiSuggestionSerializer(suggestions, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'], url_path='apply/(?P<job_id>[^/.]+)')
    def apply_to_job(self, request, job_id=None):
        """Postuler à un emploi via ApplyAI"""
        job = get_object_or_404(Job, id=job_id)
        
        # Vérifier si l'utilisateur a déjà postulé
        if Application.objects.filter(job=job, candidate=request.user).exists():
            return Response({"detail": "Vous avez déjà postulé à cette offre"}, 
                           status=status.HTTP_400_BAD_REQUEST)
        
        # Vérifier si l'utilisateur a un CV configuré
        settings = get_object_or_404(ApplyAiSetting, user=request.user)
        if not settings.cv_file:
            return Response({"detail": "Veuillez télécharger votre CV avant de postuler"}, 
                           status=status.HTTP_400_BAD_REQUEST)
        
        # Générer une lettre de motivation avec l'IA
        # (Code simplifié, à remplacer par votre logique d'IA)
        motivation_text = f"Candidature générée par ApplyAI pour le poste de {job.title}."
        
        # Créer automatiquement une candidature
        application = Application.objects.create(
            job=job,
            candidate=request.user,
            cv_url=settings.cv_file,
            motivation_letter_text=motivation_text,
            status='pending',
        )
        
        # Mettre à jour le statut de la suggestion si elle existe
        suggestion = ApplyAiSuggestion.objects.filter(user=request.user, job=job).first()
        if suggestion:
            suggestion.status = 'applied'
            suggestion.applied_date = timezone.now()
            suggestion.save()
        
        serializer = ApplicationSerializer(application)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['post'])
    def toggle_auto_apply(self, request):
        """Activer/désactiver la candidature automatique"""
        settings, created = ApplyAiSetting.objects.get_or_create(user=request.user)
        
        auto_apply = request.data.get('auto_apply', False)
        settings.auto_apply = auto_apply
        settings.save()
        
        return Response({"auto_apply": settings.auto_apply}, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'])
    def history(self, request):
        """Récupérer l'historique des candidatures automatiques"""
        history = ApplyAiSuggestion.objects.filter(
            user=request.user, 
            status='applied'
        ).order_by('-applied_date')
        
        serializer = ApplyAiSuggestionSerializer(history, many=True)
        return Response(serializer.data)
    
class JobShareViewSet(viewsets.ModelViewSet):
    serializer_class = JobShareSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return JobShare.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['post'], url_path='record')
    def record_share(self, request):
        """
        Enregistre un partage d'offre d'emploi
        """
        job_id = request.data.get('job_id')
        share_method = request.data.get('share_method')
        share_to = request.data.get('share_to', None)
        
        if not job_id or not share_method:
            return Response(
                {"detail": "job_id et share_method sont requis"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        job = get_object_or_404(Job, id=job_id)
        
        job_share = JobShare.objects.create(
            user=request.user,
            job=job,
            share_method=share_method,
            share_to=share_to
        )
        
        serializer = self.get_serializer(job_share)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class UserConnectionViewSet(viewsets.ModelViewSet):
    serializer_class = UserConnectionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return UserConnection.objects.filter(
            Q(user=user) | Q(connected_to=user)
        )
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['post'], url_path='accept')
    def accept_connection(self, request, pk=None):
        """
        Accepter une demande de connexion
        """
        connection = self.get_object()
        
        # Vérifier que l'utilisateur est bien le destinataire de la demande
        if connection.connected_to != request.user:
            return Response(
                {"detail": "Vous n'êtes pas autorisé à accepter cette demande"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Vérifier que la demande est en attente
        if connection.status != 'pending':
            return Response(
                {"detail": "Cette demande n'est pas en attente"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        connection.status = 'accepted'
        connection.save()
        
        serializer = self.get_serializer(connection)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], url_path='reject')
    def reject_connection(self, request, pk=None):
        """
        Rejeter une demande de connexion
        """
        connection = self.get_object()
        
        # Vérifier que l'utilisateur est bien le destinataire de la demande
        if connection.connected_to != request.user:
            return Response(
                {"detail": "Vous n'êtes pas autorisé à rejeter cette demande"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Vérifier que la demande est en attente
        if connection.status != 'pending':
            return Response(
                {"detail": "Cette demande n'est pas en attente"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        connection.status = 'rejected'
        connection.save()
        
        serializer = self.get_serializer(connection)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='pending')
    def pending_connections(self, request):
        """
        Récupérer les demandes de connexion en attente
        """
        pending_connections = UserConnection.objects.filter(
            connected_to=request.user,
            status='pending'
        )
        
        serializer = self.get_serializer(pending_connections, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='accepted')
    def accepted_connections(self, request):
        """
        Récupérer les connexions acceptées
        """
        user = request.user
        accepted_connections = UserConnection.objects.filter(
            (Q(user=user) | Q(connected_to=user)) & Q(status='accepted')
        )
        
        serializer = self.get_serializer(accepted_connections, many=True)
        return Response(serializer.data)