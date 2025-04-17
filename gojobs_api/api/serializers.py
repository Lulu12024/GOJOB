from rest_framework import serializers
from .models import (
    User, Job, JobPhoto, Application, Contract, Message, 
    Notification, Payment, Subscription, Statistic, 
    FlashJob, Favorite, ApplyAiSetting
)
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
    photos = JobPhotoSerializer(many=True, read_only=True)
    days_until_expiry = serializers.ReadOnlyField()
    is_expired = serializers.ReadOnlyField()
    
    # Ajouter les champs personnalisés pour le frontend
    titre = serializers.CharField(source='title')
    description = serializers.CharField()
    entreprise = serializers.CharField(source='employer.company_name', read_only=True)
    location = serializers.CharField(source='city')
    typeContrat = serializers.CharField(source='contract_type')
    salaire = serializers.SerializerMethodField()
    typeSalaire = serializers.SerializerMethodField()
    logo = serializers.SerializerMethodField()
    createdAt = serializers.DateTimeField(source='created_at')
    isUrgent = serializers.BooleanField(source='is_urgent')
    isNew = serializers.BooleanField(source='is_new')
    logement = serializers.BooleanField(source='has_accommodation')
    vehicule = serializers.BooleanField(source='has_company_car')
    employeur = serializers.SerializerMethodField()
    
    class Meta:
        model = Job
        fields = [
            'id', 'employer', 'title', 'description', 'category', 'subcategory',
            'city', 'address', 'salary_type', 'salary_amount', 'contract_type',
            'is_entry_level', 'experience_years_required', 'requires_driving_license',
            'accepts_working_visa', 'accepts_holiday_visa', 'accepts_student_visa',
            'has_accommodation', 'accommodation_accepts_children', 'accommodation_accepts_dogs',
            'accommodation_is_accessible', 'job_accepts_handicapped', 'has_company_car',
            'contact_name', 'contact_phone', 'contact_methods', 'website_url',
            'is_urgent', 'is_new', 'is_top', 'status', 'created_at', 'updated_at',
            'expires_at', 'views_count', 'applications_count', 'conversion_rate',
            'photos', 'days_until_expiry', 'is_expired',
            # Champs personnalisés pour le frontend
            'titre', 'entreprise', 'location', 'typeContrat', 'salaire', 'typeSalaire',
            'logo', 'createdAt', 'isUrgent', 'isNew', 'logement', 'vehicule', 'employeur'
        ]
        read_only_fields = ['created_at', 'updated_at', 'views_count', 'applications_count', 'conversion_rate']
    
    def get_salaire(self, obj):
        return obj.salary_amount
    
    def get_typeSalaire(self, obj):
        return 'horaire' if obj.salary_type == 'hourly' else 'mensuel'
    
    def get_logo(self, obj):
        # Récupérer une photo de profil de l'employeur ou une image par défaut
        if obj.employer and obj.employer.profile_image:
            return obj.employer.profile_image.url
        return '/static/images/company-default.png'
    
    def get_employeur(self, obj):
        return {
            'id': obj.employer.id,
            'nom': obj.employer.name,
            'memberSince': obj.employer.member_since or 2023,
            'jobCount': Job.objects.filter(employer=obj.employer).count()
        }
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

class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = [
            'id', 'user', 'plan_type', 'amount', 'billing_cycle',
            'starts_at', 'expires_at', 'is_active', 'auto_renew',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

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
    
    class Meta:
        model = FlashJob
        fields = [
            'id', 'job', 'start_time', 'confirmation_required',
            'is_confirmed', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

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
            'id', 'user', 'categories', 'salary_min', 'salary_max',
            'excluded_companies', 'filters', 'notification_time',
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']