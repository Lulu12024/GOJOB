from rest_framework import serializers
from .models import *
from django.conf import settings
from urllib.parse import urljoin
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import  status

class UserSerializer(serializers.ModelSerializer):
    # Ajout de champs pour correspondre aux attentes du frontend
    nom = serializers.SerializerMethodField()
    prenom = serializers.SerializerMethodField()
    telephone = serializers.CharField(source='phone', required=False, allow_null=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'password', 'first_name', 'last_name', 'role', 'phone', 
            'profile_image', 'bio', 'address', 'city', 'is_handicapped',
            'has_driving_license', 'has_vehicle', 'member_since',
            'skills', 'experience', 'education', 'languages', 'job_preferences',
            'company_name', 'company_description', 'company_website',
            'company_size', 'company_industry',
            # Champs supplémentaires pour le frontend
            'nom', 'prenom', 'telephone'
        ]
        extra_kwargs = {
            'password': {'write_only': True}
        }
    
    def get_nom(self, obj):
        return obj.last_name
    
    def get_prenom(self, obj):
        return obj.first_name
    
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User.objects.create(**validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user
    
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        user = super().update(instance, validated_data)
        if password:
            user.set_password(password)
            user.save()

class JobPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobPhoto
        fields = ['id', 'job', 'photo', 'order', 'created_at']
        read_only_fields = ['created_at']

class JobSerializer(serializers.ModelSerializer):
    employer = UserSerializer(read_only=True)
    # photos = JobPhotoSerializer(many=True, read_only=True)
    days_until_expiry = serializers.ReadOnlyField()
    is_expired = serializers.ReadOnlyField()
    user_id = serializers.IntegerField(write_only=True, required=False)
    # Ajouter les champs personnalisés pour le frontend
    title = serializers.CharField()
    description = serializers.CharField()
    entreprise = serializers.CharField(source='employer.company_name', read_only=True)
    # location = serializers.CharField()
    contract_type = serializers.CharField()
    salaire = serializers.SerializerMethodField()
    typeSalaire = serializers.SerializerMethodField()
    logo = serializers.SerializerMethodField()
    # createdAt = serializers.DateTimeField(source='created_at')
    isUrgent = serializers.BooleanField(source='is_urgent')
    isNew = serializers.BooleanField(source='is_new')
    logement = serializers.BooleanField(source='has_accommodation')
    vehicule = serializers.BooleanField(source='has_company_car')
    employeur = serializers.SerializerMethodField()
    photos = serializers.SerializerMethodField()
    class Meta:
        model = Job
        fields = [
            'id', 'employer', 'title', 'description', 'category', 'subcategory',
             'address', 'salary_type', 'salary_amount', 'contract_type',
            'is_entry_level', 'experience_years_required', 'requires_driving_license',
            'accepts_working_visa', 'accepts_holiday_visa', 'accepts_student_visa',
            'has_accommodation', 'accommodation_accepts_children', 'accommodation_accepts_dogs',
            'accommodation_is_accessible', 'job_accepts_handicapped', 'has_company_car',
            'contact_name', 'contact_phone', 'contact_methods', 'website_url',
            'is_urgent', 'is_new', 'is_top', 'status','created_at',
            'expires_at', 'views_count', 'applications_count', 'conversion_rate',
            'photos', 'days_until_expiry', 'is_expired','user_id','company',
            # Champs personnalisés pour le frontend
             'entreprise',  'salaire', 'typeSalaire',
            'logo', 'isUrgent', 'isNew', 'logement', 'vehicule', 'employeur'
        ]
        read_only_fields = ['created_at','user_id','updated_at', 'views_count', 'applications_count', 'conversion_rate']
    
    def create(self, validated_data):
        # Supprimer user_id du validated_data car il est traité séparément dans perform_create
        user_id = validated_data.pop('user_id', None)
        
        # Si company n'est pas fourni mais que l'utilisateur a une entreprise, utiliser celle-ci
        if 'company' not in validated_data and self.context['request'].user.company_name:
            validated_data['company'] = self.context['request'].user.company_name
            
        # Créer l'objet avec les données validées
        instance = Job.objects.create(**validated_data)
        return instance
    
    def get_salaire(self, obj):
        return obj.salary_amount
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # S'assurer que les statistiques sont bien calculées
        for job in queryset:
            job.views_count = job.views_count or 0
            job.applications_count = Application.objects.filter(job=job).count()
            job.conversion_rate = (job.applications_count / job.views_count * 100) if job.views_count > 0 else 0
        
        return queryset

    def get_typeSalaire(self, obj):
        return 'horaire' if obj.salary_type == 'hourly' else 'mensuel'
    
    def get_logo(self, obj):

        photos = JobPhoto.objects.filter(job=obj).order_by('order').first()
        if photos and photos.photo:
            # Récupérer le domaine du site à partir de la requête
            request = self.context.get('request')
            if request is not None and isinstance(request, Request):
                base_url = request.build_absolute_uri('/').rstrip('/')
                # Construire l'URL absolue
                if photos.photo.url.startswith('/'):
                    return f"{base_url}{photos.photo.url}"
                else:
                    return f"{base_url}/{photos.photo.url}"
            return photos.photo.url
        
        # URL par défaut
        request = self.context.get('request')
        if request is not None and isinstance(request, Request):
            base_url = request.build_absolute_uri('/').rstrip('/')
            return f"{base_url}/static/images/company-default.png"
        return '/static/images/company-default.png'
    
    def get_photos(self, obj):
        """Récupérer les URLs des photos associées à cette offre"""
        photos = JobPhoto.objects.filter(job=obj).order_by('order')
        return [photo.photo.url for photo in photos]
    
    def get_employeur(self, obj):
        return {
            'id': obj.employer.id,
            'nom': obj.employer.name,
            'memberSince': obj.employer.member_since or 2023,
            'jobCount': Job.objects.filter(employer=obj.employer).count()
        }
    
    def validate(self, data):
        """
        Validation personnalisée pour les offres d'emploi
        """
        # Valider la cohérence entre contract_type et experience_years_required
        if data.get('is_entry_level') and data.get('experience_years_required', 0) > 0:
            raise serializers.ValidationError(
                "Une offre marquée 'débutant accepté' ne devrait pas exiger d'années d'expérience."
            )
        
        # Valider la date d'expiration
        if 'expires_at' in data and data['expires_at'] < timezone.now():
            raise serializers.ValidationError(
                "La date d'expiration doit être future."
            )
        
        # Valider la cohérence du salaire
        if 'salary_amount' in data and data['salary_amount'] is not None:
            if data['salary_amount'] <= 0:
                raise serializers.ValidationError(
                    "Le montant du salaire doit être positif."
                )
        
        return data
    
    

class ApplicationSerializer(serializers.ModelSerializer):
    job = JobSerializer(read_only=True)
    candidate = UserSerializer(read_only=True)
    
    # Ajout de champs pour le frontend
    date = serializers.SerializerMethodField()
    candidat = serializers.SerializerMethodField()
    cv = serializers.SerializerMethodField()
    resume = serializers.SerializerMethodField()
    
    class Meta:
        model = Application
        fields = [
            'id', 'job', 'candidate', 'cv_url', 'motivation_letter_url',
            'custom_answers', 'status', 'is_read', 'created_at', 'updated_at',
            # Champs pour le frontend
            'date', 'candidat', 'cv', 'resume'
        ]
        read_only_fields = ['created_at', 'updated_at']
    
    def get_date(self, obj):
        return obj.created_at.strftime("%d/%m/%Y %H:%M")
    
    def get_candidat(self, obj):
        return {
            'id': obj.candidate.id,
            'nom': f"{obj.candidate.first_name} {obj.candidate.last_name}",
            'photo': obj.candidate.profile_image.url if obj.candidate.profile_image else '/static/images/profile-default.png',
            'email': obj.candidate.email,
            'phone': obj.candidate.phone
        }
    
    def get_cv(self, obj):
        return obj.cv_url.url if obj.cv_url else None
    
    def get_resume(self, obj):
        return obj.motivation_letter_url.url if obj.motivation_letter_url else None
    
    def validate(self, data):
        """
        Validation personnalisée pour les candidatures
        """
        # Vérifier qu'un utilisateur ne postule pas plusieurs fois à la même offre
        job = data.get('job')
        candidate = self.context['request'].user
        
        if Application.objects.filter(job=job, candidate=candidate).exists():
            raise serializers.ValidationError(
                "Vous avez déjà postulé à cette offre d'emploi."
            )
        
        return data

class ContractSerializer(serializers.ModelSerializer):
    job = JobSerializer(read_only=True)
    employer = UserSerializer(read_only=True)
    candidate = UserSerializer(read_only=True)
    
    class Meta:
        model = Contract
        fields = [
            'id', 'job', 'employer', 'candidate', 'template_url', 'signed_url',
            'status', 'signed_at', 'start_date', 'end_date', 'bank_details',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at', 'signed_at']

class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    receiver = UserSerializer(read_only=True)
    job = JobSerializer(read_only=True)
    
    class Meta:
        model = Message
        fields = [
            'id', 'sender', 'receiver', 'job', 'content',
            'is_read', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = [
            'id', 'user', 'type', 'data', 'is_read', 'created_at'
        ]
        read_only_fields = ['created_at']

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = [
            'id', 'user', 'subscription', 'amount', 'payment_method',
            'transaction_id', 'status', 'payment_date', 'updated_at',
            'refund_reason', 'refund_requested_at', 'refunded_at'
        ]
        read_only_fields = ['payment_date', 'updated_at', 'refunded_at']

class SubscriptionPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionPlan
        fields = [
            'id', 'name', 'description', 'type', 'price', 'billing_cycle',
            'features', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

class SubscriptionSerializer(serializers.ModelSerializer):
    plan = SubscriptionPlanSerializer(read_only=True)
    plan_id = serializers.PrimaryKeyRelatedField(
        queryset=SubscriptionPlan.objects.all(), 
        write_only=True,
        source='plan'
    )
    is_valid = serializers.ReadOnlyField()
    days_remaining = serializers.ReadOnlyField()
    
    class Meta:
        model = Subscription
        fields = [
            'id', 'user', 'plan', 'plan_id', 'status', 'amount', 'billing_cycle',
            'starts_at', 'expires_at', 'auto_renew', 'next_billing_date',
            'cancelled_at', 'payment_method', 'created_at', 'updated_at',
            'is_valid', 'days_remaining'
        ]
        read_only_fields = ['created_at', 'updated_at']

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = [
            'id', 'user', 'subscription', 'amount', 'payment_method',
            'transaction_id', 'status', 'payment_date', 'updated_at',
            'refund_reason', 'refund_requested_at', 'refunded_at',
            'payment_details', 'invoice_url'
        ]
        read_only_fields = ['payment_date', 'updated_at', 'refunded_at']

class JobBoostSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobBoost
        fields = [
            'id', 'job', 'type', 'amount', 'starts_at', 'expires_at',
            'is_active', 'payment', 'created_at'
        ]
        read_only_fields = ['created_at']
class StatisticSerializer(serializers.ModelSerializer):
    class Meta:
        model = Statistic
        fields = [
            'id', 'job', 'date', 'views', 'applications',
            'conversion_rate', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at', 'conversion_rate']
class FlashJobSerializer(serializers.ModelSerializer):
    job = JobSerializer(read_only=True)
    job_id = serializers.PrimaryKeyRelatedField(queryset=Job.objects.all(), write_only=True)
    time_until_start = serializers.ReadOnlyField()
    is_expired = serializers.ReadOnlyField()
    
    class Meta:
        model = FlashJob
        fields = [
            'id', 'job', 'job_id', 'start_time', 'end_time', 'confirmation_required',
            'is_confirmed', 'max_applicants', 'current_applicants', 'status',
            'is_immediate', 'salary_per_hour', 'salary_total', 'created_at', 'updated_at',
            'time_until_start', 'is_expired'
        ]
        read_only_fields = ['created_at', 'updated_at', 'current_applicants']
    
    def create(self, validated_data):
        job = validated_data.pop('job_id')
        flash_job = FlashJob.objects.create(job=job, **validated_data)
        return flash_job

class JobShareSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobShare
        fields = ['id', 'user', 'job', 'share_method', 'share_to', 'created_at']
        read_only_fields = ['user', 'created_at']


class UserConnectionSerializer(serializers.ModelSerializer):
    connected_to_user = UserSerializer(source='connected_to', read_only=True)
    user_details = UserSerializer(source='user', read_only=True)
    
    class Meta:
        model = UserConnection
        fields = ['id', 'user', 'user_details', 'connected_to', 'connected_to_user', 
                 'status', 'created_at', 'updated_at']
        read_only_fields = ['user', 'created_at', 'updated_at']

class FavoriteSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    job = JobSerializer(read_only=True)
    
    class Meta:
        model = Favorite
        fields = ['id', 'user', 'job', 'created_at']
        read_only_fields = ['created_at']

class ApplyAiSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApplyAiSetting
        fields = [
            'id', 'user', 'categories', 'salary_range', 'filters',
            'excluded_companies', 'notification_time', 'is_active',
            'auto_apply', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

class ApplyAiSuggestionSerializer(serializers.ModelSerializer):
    job = JobSerializer(read_only=True)
    
    class Meta:
        model = ApplyAiSuggestion
        fields = [
            'id', 'user', 'job', 'match_percentage', 'match_reasons',
            'status', 'applied_date', 'is_viewed', 'created_at'
        ]
        read_only_fields = ['created_at']