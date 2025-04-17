from rest_framework import serializers
from .models import (
    User, Job, JobPhoto, Application, Contract, Message, 
    Notification, Payment, Subscription, Statistic, 
    FlashJob, Favorite, ApplyAiSetting
)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'email', 'password','first_name', 'last_name', 'role', 'phone', 
            'profile_image', 'bio', 'address', 'city', 'is_handicapped',
            'has_driving_license', 'has_vehicle', 'member_since',
            'skills', 'experience', 'education', 'languages', 'job_preferences',
            'company_name', 'company_description', 'company_website',
            'company_size', 'company_industry'
        ]
        extra_kwargs = {
            'password': {'write_only': True}
        }
    
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        print("Le mot de passe est"+ str(password))
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
        return user

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
            'photos', 'days_until_expiry', 'is_expired'
        ]
        read_only_fields = ['created_at', 'updated_at', 'views_count', 'applications_count', 'conversion_rate']

class ApplicationSerializer(serializers.ModelSerializer):
    job = JobSerializer(read_only=True)
    candidate = UserSerializer(read_only=True)
    
    class Meta:
        model = Application
        fields = [
            'id', 'job', 'candidate', 'cv_url', 'motivation_letter_url',
            'custom_answers', 'status', 'is_read', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

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