from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, permissions, status, filters
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from django.shortcuts import get_object_or_404
from .models import User, Job, Application, Message, Subscription, Payment, FlashJob, Favorite, Notification, Contract, ApplyAiSetting
from .serializers import (
    UserSerializer, JobSerializer, ApplicationSerializer, MessageSerializer,
    SubscriptionSerializer, PaymentSerializer, FlashJobSerializer, FavoriteSerializer,
    NotificationSerializer, ContractSerializer, ApplyAiSettingSerializer
)
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
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'city']
    ordering_fields = ['created_at', 'updated_at', 'salary_amount']
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [permissions.IsAuthenticated, IsEmployer]
        return super().get_permissions()
    
    def perform_create(self, serializer):
        serializer.save(employer=self.request.user)
    
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
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return api_response(serializer.data)
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return api_response(serializer.data, "Offre d'emploi créée avec succès", status_code=201)
        return api_response(None, serializer.errors, status_code=400)
    
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
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        # Récupérer tous les messages envoyés ou reçus par l'utilisateur
        return Message.objects.filter(sender=user) | Message.objects.filter(receiver=user)
    
    def perform_create(self, serializer):
        receiver_id = self.request.data.get('receiver_id')
        job_id = self.request.data.get('job_id', None)
        
        receiver = get_object_or_404(User, id=receiver_id)
        job = None
        if job_id:
            job = get_object_or_404(Job, id=job_id)
        
        serializer.save(sender=self.request.user, receiver=receiver, job=job)
    
    @action(detail=False, methods=['get'])
    def conversations(self, request):
        user = request.user
        
        # Obtenir tous les utilisateurs avec qui l'utilisateur actuel a échangé des messages
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
                    'user': UserSerializer(other_user).data,
                    'last_message': MessageSerializer(last_message).data,
                    'unread_count': Message.objects.filter(sender=other_user, receiver=user, is_read=False).count()
                })
        
        # Trier les conversations par date du dernier message
        conversations.sort(key=lambda x: x['last_message']['created_at'], reverse=True)
        
        return Response(conversations)

class SubscriptionViewSet(viewsets.ModelViewSet):
    queryset = Subscription.objects.all()
    serializer_class = SubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Subscription.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

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
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [permissions.IsAuthenticated, IsEmployer]
        elif self.action == 'apply':
            self.permission_classes = [permissions.IsAuthenticated, IsCandidate]
        return super().get_permissions()
    
    def perform_create(self, serializer):
        job_id = self.request.data.get('job_id')
        job = get_object_or_404(Job, id=job_id, employer=self.request.user)
        serializer.save(job=job)
    
    @action(detail=True, methods=['post'])
    def apply(self, request, pk=None):
        flash_job = self.get_object()
        # Logique pour postuler à un emploi flash
        # Créer une application avec un statut spécifique pour les emplois flash
        application_data = {
            'job': flash_job.job.id,
            'candidate': request.user.id,
            'status': 'pending'
        }
        
        # Ajouter les données spécifiques de la candidature
        if 'cv_url' in request.data:
            application_data['cv_url'] = request.data['cv_url']
        if 'motivation_letter_url' in request.data:
            application_data['motivation_letter_url'] = request.data['motivation_letter_url']
        if 'custom_answers' in request.data:
            application_data['custom_answers'] = request.data['custom_answers']
        
        application_serializer = ApplicationSerializer(data=application_data)
        if application_serializer.is_valid():
            application_serializer.save(candidate=request.user, job=flash_job.job)
            return Response(application_serializer.data, status=status.HTTP_201_CREATED)
        return Response(application_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
        return Notification.objects.filter(user=self.request.user)
    
    @action(detail=True, methods=['put'], url_path='read')
    def mark_as_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        serializer = self.get_serializer(notification)
        return Response(serializer.data)
    
    @action(detail=False, methods=['put'], url_path='read-all')
    def mark_all_as_read(self, request):
        notifications = self.get_queryset().filter(is_read=False)
        for notification in notifications:
            notification.is_read = True
            notification.save()
        
        return Response({"detail": "Toutes les notifications ont été marquées comme lues"}, 
                       status=status.HTTP_200_OK)

class StatisticsViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated, IsEmployer]
    
    @action(detail=False, methods=['get'], url_path='job/(?P<job_id>[^/.]+)')
    def job_stats(self, request, job_id=None):
        job = get_object_or_404(Job, id=job_id, employer=request.user)
        # Récupérer les statistiques pour cette offre d'emploi
        stats = job.statistics.all().order_by('-date')
        
        # Calculer des métriques supplémentaires
        total_views = sum(stat.views for stat in stats)
        total_applications = sum(stat.applications for stat in stats)
        conversion_rate = (total_applications / total_views * 100) if total_views > 0 else 0
        
        return Response({
            'job_id': job.id,
            'title': job.title,
            'total_views': total_views,
            'total_applications': total_applications,
            'conversion_rate': conversion_rate,
            'daily_stats': [
                {
                    'date': stat.date,
                    'views': stat.views,
                    'applications': stat.applications,
                    'conversion_rate': stat.conversion_rate
                }
                for stat in stats
            ]
        })
    
    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        # Statistiques pour le tableau de bord de l'employeur
        user = request.user
        jobs = Job.objects.filter(employer=user)
        
        # Statistiques générales
        total_jobs = jobs.count()
        active_jobs = jobs.filter(status='active').count()
        total_applications = Application.objects.filter(job__employer=user).count()
        new_applications = Application.objects.filter(job__employer=user, is_read=False).count()
        
        # Top offres par nombre de candidatures
        top_jobs = jobs.annotate(app_count=Count('applications')).order_by('-app_count')[:5]
        
        return Response({
            'total_jobs': total_jobs,
            'active_jobs': active_jobs,
            'total_applications': total_applications,
            'new_applications': new_applications,
            'top_jobs': [
                {
                    'id': job.id,
                    'title': job.title,
                    'applications_count': job.app_count,
                    'views_count': job.views_count,
                    'conversion_rate': job.conversion_rate
                }
                for job in top_jobs
            ]
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
        if self.action in ['store', 'suggestions', 'apply_to_job']:
            self.permission_classes = [permissions.IsAuthenticated, IsCandidate, HasSubscription(['apply_ai', 'apply_ai_pro'])]
        return super().get_permissions()
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def suggestions(self, request):
        # Obtenir les paramètres ApplyAI de l'utilisateur
        try:
            settings = ApplyAiSetting.objects.get(user=request.user)
        except ApplyAiSetting.DoesNotExist:
            return Response({"detail": "Veuillez d'abord configurer vos paramètres ApplyAI"}, 
                           status=status.HTTP_404_NOT_FOUND)
        
        # Logique pour trouver des emplois correspondant aux paramètres
        jobs = Job.objects.filter(status='active')
        
        # Filtrer par catégories
        if settings.categories:
            jobs = jobs.filter(category__in=settings.categories)
        
        # Filtrer par salaire
        if settings.salary_min:
            jobs = jobs.filter(salary_amount__gte=settings.salary_min)
        if settings.salary_max:
            jobs = jobs.filter(salary_amount__lte=settings.salary_max)
        
        # Exclure certaines entreprises
        if settings.excluded_companies:
            jobs = jobs.exclude(employer__company_name__in=settings.excluded_companies)
        
        # Appliquer d'autres filtres personnalisés
        # ...
        
        # Limiter les résultats pour ne pas surcharger
        jobs = jobs[:20]
        
        serializer = JobSerializer(jobs, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'], url_path='apply/(?P<job_id>[^/.]+)')
    def apply_to_job(self, request, job_id=None):
        job = get_object_or_404(Job, id=job_id)
        
        # Vérifier si l'utilisateur a déjà postulé
        if Application.objects.filter(job=job, candidate=request.user).exists():
            return Response({"detail": "Vous avez déjà postulé à cette offre"}, 
                           status=status.HTTP_400_BAD_REQUEST)
        
        # Créer automatiquement une candidature
        application = Application.objects.create(
            job=job,
            candidate=request.user,
            status='pending',
            # Vous pourriez ajouter ici d'autres informations du profil utilisateur
        )
        
        serializer = ApplicationSerializer(application)
        return Response(serializer.data, status=status.HTTP_201_CREATED)