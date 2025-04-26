import re
from django.db import models

# Create your models here.
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.forms import ValidationError
from django.utils.translation import gettext_lazy as _
from django.utils import timezone 
from datetime import timedelta


class UserManager(BaseUserManager):
    """Manager personnalisé pour le modèle User."""
    
    def create_user(self, email, password=None, **extra_fields):
        """Crée et retourne un utilisateur avec l'email et le mot de passe."""
        if not email:
            raise ValueError(_('L\'adresse email est obligatoire'))
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        """Crée et retourne un superuser avec l'email et le mot de passe."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'admin')
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Un superuser doit avoir is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Un superuser doit avoir is_superuser=True.'))
        
        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    """Modèle personnalisé pour les utilisateurs."""
    
    ROLE_CHOICES = (
        ('employer', 'Employeur'),
        ('candidate', 'Candidat'),
        ('admin', 'Administrateur'),
    )
    
    username = None  # Supprimer username, on utilise l'email
    email = models.EmailField(_('adresse email'), unique=True)
    role = models.CharField(_('rôle'), max_length=20, choices=ROLE_CHOICES, default='candidate')
    phone = models.CharField(_('téléphone'), max_length=20, blank=True, null=True)
    profile_image = models.ImageField(upload_to='profile_images/', blank=True, null=True)
    bio = models.TextField(_('biographie'), blank=True, null=True)
    address = models.CharField(_('adresse'), max_length=255, blank=True, null=True)
    city = models.CharField(_('ville'), max_length=100, blank=True, null=True)
    is_handicapped = models.BooleanField(_('handicapé'), default=False)
    has_driving_license = models.BooleanField(_('a le permis de conduire'), default=False)
    has_vehicle = models.BooleanField(_('a un véhicule'), default=False)
    member_since = models.IntegerField(_('membre depuis'), blank=True, null=True)
    
    # Champs spécifiques pour les candidats
    skills = models.JSONField(_('compétences'), blank=True, null=True)
    experience = models.JSONField(_('expérience'), blank=True, null=True)
    education = models.JSONField(_('formation'), blank=True, null=True)
    languages = models.JSONField(_('langues'), blank=True, null=True)
    job_preferences = models.JSONField(_('préférences d\'emploi'), blank=True, null=True)
    
    # Champs spécifiques pour les employeurs
    company_name = models.CharField(_('nom de l\'entreprise'), max_length=255, blank=True, null=True)
    company_description = models.TextField(_('description de l\'entreprise'), blank=True, null=True)
    company_website = models.URLField(_('site web de l\'entreprise'), blank=True, null=True)
    company_size = models.CharField(_('taille de l\'entreprise'), max_length=50, blank=True, null=True)
    company_industry = models.CharField(_('secteur de l\'entreprise'), max_length=100, blank=True, null=True)
    
    # Champs pour l'authentification
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']
    
    objects = UserManager()
    
    class Meta:
        verbose_name = _('utilisateur')
        verbose_name_plural = _('utilisateurs')
    
    def __str__(self):
        return self.email
    
    @property
    def name(self):
        """Retourne le nom complet de l'utilisateur."""
        return f"{self.first_name} {self.last_name}"
    
    @property
    def is_employer(self):
        """Vérifie si l'utilisateur est un employeur."""
        return self.role == 'employer'
    
    @property
    def is_candidate(self):
        """Vérifie si l'utilisateur est un candidat."""
        return self.role == 'candidate'

    def has_subscription(self, subscription_type):
        """
        Vérifie si l'utilisateur a un abonnement particulier actif.
        """
        try:
            sub = self.subscription
            return sub.is_active and sub.plan_type == subscription_type
        except Subscription.DoesNotExist:
            return False
        except AttributeError:
            return False

    def clean(self):
        """
        Validation supplémentaire pour le modèle User
        """
        super().clean()
        
        # Validation des champs spécifiques à chaque rôle
        if self.role == 'employer':
            if not self.company_name:
                raise ValidationError(_('Le nom de l\'entreprise est obligatoire pour un employeur.'))
        elif self.role == 'candidate':
            # Validation optionnelle pour les candidats
            pass
        
        # Validation du format du numéro de téléphone
        if self.phone:
            # Format de base : chiffres, espaces, tirets, parenthèses
            phone_pattern = r'^[\d\s\-\(\)]+$'
            if not re.match(phone_pattern, self.phone):
                raise ValidationError(_('Format de numéro de téléphone invalide.'))
        
class Job(models.Model):
    """Modèle pour les offres d'emploi."""
    
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('closed', 'Fermée'),
        ('draft', 'Brouillon'),
    )
    
    CONTRACT_TYPE_CHOICES = (
        ('CDI', 'CDI'),
        ('CDD', 'CDD'),
        ('Freelance', 'Freelance'),
        ('Alternance', 'Alternance'),
    )
    
    SALARY_TYPE_CHOICES = (
        ('hourly', 'Horaire'),
        ('monthly', 'Mensuel'),
    )
    
    # Informations de base
    employer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='jobs')
    title = models.CharField( max_length=255)
    description = models.TextField()
    category = models.CharField(max_length=100)
    subcategory = models.CharField(max_length=100, blank=True, null=True)
    
    # Localisation
    city = models.CharField(_('ville'), max_length=100)
    address = models.CharField(_('adresse'), max_length=255, blank=True, null=True)
    company = models.CharField(_('entreprise'), max_length=255, blank=True, null=True)
    # Rémunération
    salary_type = models.CharField(_('type de salaire'), max_length=10, choices=SALARY_TYPE_CHOICES)
    salary_amount = models.DecimalField(_('montant du salaire'), max_digits=10, decimal_places=2, blank=True, null=True)
    
    # Type de contrat et conditions
    contract_type = models.CharField(_('type de contrat'), max_length=20, choices=CONTRACT_TYPE_CHOICES)
    is_entry_level = models.BooleanField(_('débutant accepté'), default=False)
    experience_years_required = models.IntegerField(_('années d\'expérience requises'), default=0)
    requires_driving_license = models.BooleanField(_('permis de conduire requis'), default=False)
    
    # Visa et accommodation
    accepts_working_visa = models.BooleanField(_('accepte les visas de travail'), default=False)
    accepts_holiday_visa = models.BooleanField(_('accepte les visas vacances-travail'), default=False)
    accepts_student_visa = models.BooleanField(_('accepte les visas étudiants'), default=False)
    has_accommodation = models.BooleanField(_('logement fourni'), default=False)
    accommodation_accepts_children = models.BooleanField(_('logement accepte les enfants'), default=False)
    accommodation_accepts_dogs = models.BooleanField(_('logement accepte les chiens'), default=False)
    accommodation_is_accessible = models.BooleanField(_('logement accessible aux handicapés'), default=False)
    job_accepts_handicapped = models.BooleanField(_('poste adapté aux handicapés'), default=False)
    has_company_car = models.BooleanField(_('véhicule de fonction'), default=False)
    
    # Informations de contact
    contact_name = models.CharField(_('nom du contact'), max_length=100, blank=True, null=True)
    contact_phone = models.CharField(_('téléphone du contact'), max_length=20, blank=True, null=True)
    contact_methods = models.JSONField(_('méthodes de contact'), default=list)  # ['call', 'message', 'apply', 'website']
    website_url = models.URLField(_('site web'), blank=True, null=True)
    
    # Visibilité et statut
    is_urgent = models.BooleanField(_('urgent'), default=False)
    is_new = models.BooleanField(_('nouveau'), default=True)
    is_top = models.BooleanField(_('premium'), default=False)
    status = models.CharField(_('statut'), max_length=10, choices=STATUS_CHOICES, default='active')
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    expires_at = models.DateTimeField(_('expire le'), blank=True, null=True)
    
    # Statistiques
    views_count = models.IntegerField(_('nombre de vues'), default=0)
    applications_count = models.IntegerField(_('nombre de candidatures'), default=0)
    conversion_rate = models.DecimalField(_('taux de conversion'), max_digits=5, decimal_places=2, default=0)
    
    class Meta:
        verbose_name = _('offre d\'emploi')
        verbose_name_plural = _('offres d\'emploi')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['category']),
            models.Index(fields=['city']),
        ]
    
    def __str__(self):
        return f"{self.title} à {self.city}"
    
    def save(self, *args, **kwargs):
        # Si l'offre est nouvelle, définir la date d'expiration à 30 jours par défaut
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(days=30)
        
        # Calcul du taux de conversion si le nombre de vues est > 0
        if self.views_count > 0:
            self.conversion_rate = (self.applications_count / self.views_count) * 100
            
        super().save(*args, **kwargs)
    
    @property
    def is_expired(self):
        """Vérifie si l'offre est expirée."""
        return self.expires_at and self.expires_at < timezone.now()
    
    @property
    def days_until_expiry(self):
        """Calcule le nombre de jours avant expiration."""
        if not self.expires_at:
            return None
        
        days = (self.expires_at - timezone.now()).days
        return max(0, days)


class JobPhoto(models.Model):
    """Photos associées à une offre d'emploi."""
    
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='photos')
    photo = models.ImageField(upload_to='job_photos/')
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = _('photo d\'offre')
        verbose_name_plural = _('photos d\'offres')
        ordering = ['order']
    
    def __str__(self):
        return f"Photo {self.order} pour {self.job.title}"


class Application(models.Model):
    """Modèle pour les candidatures aux offres d'emploi."""
    
    STATUS_CHOICES = (
        ('pending', 'En attente'),
        ('accepted', 'Acceptée'),
        ('rejected', 'Refusée'),
        ('on_hold', 'En suspens'),
    )
    
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    candidate = models.ForeignKey(User, on_delete=models.CASCADE, related_name='applications')
    cv_url = models.FileField(_('CV'), upload_to='application_documents/cv/', blank=True, null=True)
    motivation_letter_url = models.FileField(_('lettre de motivation'), upload_to='application_documents/motivation/', blank=True, null=True)
    custom_answers = models.JSONField(_('réponses personnalisées'), blank=True, null=True)
    status = models.CharField(_('statut'), max_length=20, choices=STATUS_CHOICES, default='pending')
    is_read = models.BooleanField(_('lue'), default=False)
    created_at = models.DateTimeField(_('créée le'), auto_now_add=True)
    updated_at = models.DateTimeField(_('mise à jour le'), auto_now=True)
    
    class Meta:
        verbose_name = _('candidature')
        verbose_name_plural = _('candidatures')
        ordering = ['-created_at']
        # S'assurer qu'un candidat ne postule qu'une fois à une offre
        constraints = [
            models.UniqueConstraint(fields=['job', 'candidate'], name='unique_application')
        ]
    
    def __str__(self):
        return f"Candidature de {self.candidate.email} pour {self.job.title}"
    
    def save(self, *args, **kwargs):
        # Si c'est une nouvelle candidature, incrémenter le compteur de candidatures de l'offre
        if not self.pk:
            self.job.applications_count += 1
            self.job.save()
            
        super().save(*args, **kwargs)


class Contract(models.Model):
    """Modèle pour les contrats entre employeurs et candidats."""
    
    STATUS_CHOICES = (
        ('draft', 'Brouillon'),
        ('sent', 'Envoyé'),
        ('signed', 'Signé'),
        ('active', 'Actif'),
        ('terminated', 'Terminé'),
    )
    
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='contracts')
    employer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='contracts')
    candidate = models.ForeignKey(User, on_delete=models.CASCADE, related_name='signed_contracts', null=True, blank=True)
    template_url = models.FileField(_('modèle de contrat'), upload_to='contracts/templates/')
    signed_url = models.FileField(_('contrat signé'), upload_to='contracts/signed/', blank=True, null=True)
    status = models.CharField(_('statut'), max_length=20, choices=STATUS_CHOICES, default='draft')
    signed_at = models.DateTimeField(_('signé le'), blank=True, null=True)
    start_date = models.DateField(_('date de début'), blank=True, null=True)
    end_date = models.DateField(_('date de fin'), blank=True, null=True)
    bank_details = models.JSONField(_('informations bancaires'), blank=True, null=True)
    created_at = models.DateTimeField(_('créé le'), auto_now_add=True)
    updated_at = models.DateTimeField(_('mis à jour le'), auto_now=True)
    
    class Meta:
        verbose_name = _('contrat')
        verbose_name_plural = _('contrats')
        ordering = ['-created_at']
    
    def __str__(self):
        candidate_name = self.candidate.email if self.candidate else "Non assigné"
        return f"Contrat pour {self.job.title} - {candidate_name}"


class Message(models.Model):
    """Modèle pour les messages entre utilisateurs."""
    
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    job = models.ForeignKey(Job, on_delete=models.SET_NULL, related_name='messages', null=True, blank=True)
    content = models.TextField(_('contenu'))
    is_read = models.BooleanField(_('lu'), default=False)
    created_at = models.DateTimeField(_('créé le'), auto_now_add=True)
    updated_at = models.DateTimeField(_('mis à jour le'), auto_now=True)
    
    class Meta:
        verbose_name = _('message')
        verbose_name_plural = _('messages')
        ordering = ['-created_at']
    
    def __str__(self):
        job_reference = f" concernant {self.job.title}" if self.job else ""
        return f"Message de {self.sender.email} à {self.receiver.email}{job_reference}"



class Notification(models.Model):
    """Modèle pour les notifications système aux utilisateurs."""
    
    TYPE_CHOICES = (
        ('new_application', 'Nouvelle candidature'),
        ('application_status', 'Statut de candidature'),
        ('new_message', 'Nouveau message'),
        ('flash_job', 'Emploi flash'),
        ('new_contract', 'Nouveau contrat'),
        ('signed_contract', 'Contrat signé'),
        ('subscription', 'Abonnement'),
        ('payment', 'Paiement'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    type = models.CharField(_('type'), max_length=30, choices=TYPE_CHOICES)
    data = models.JSONField(_('données'))
    is_read = models.BooleanField(_('lue'), default=False)
    created_at = models.DateTimeField(_('créée le'), auto_now_add=True)
    
    class Meta:
        verbose_name = _('notification')
        verbose_name_plural = _('notifications')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'is_read']),
            models.Index(fields=['type']),
        ]
    
    def __str__(self):
        return f"Notification {self.type} pour {self.user.email}"

class SubscriptionPlan(models.Model):
    """Modèle pour les plans d'abonnement disponibles."""
    
    TYPE_CHOICES = (
        ('basic_pro', 'Basique Pro'),
        ('standard_pro', 'Standard Pro'),
        ('premium_pro', 'Premium Pro'),
        ('apply_ai', 'ApplyAI'),
        ('apply_ai_pro', 'ApplyAI Pro'),
    )
    
    BILLING_CYCLE_CHOICES = (
        ('weekly', 'Hebdomadaire'),
        ('monthly', 'Mensuel'),
        ('yearly', 'Annuel'),
    )
    
    name = models.CharField(_('nom'), max_length=50)
    description = models.TextField(_('description'))
    type = models.CharField(_('type'), max_length=20, choices=TYPE_CHOICES)
    price = models.DecimalField(_('prix'), max_digits=10, decimal_places=2)
    billing_cycle = models.CharField(_('cycle de facturation'), max_length=10, choices=BILLING_CYCLE_CHOICES)
    features = models.JSONField(_('fonctionnalités'), default=list)
    is_active = models.BooleanField(_('actif'), default=True)
    created_at = models.DateTimeField(_('créé le'), auto_now_add=True)
    updated_at = models.DateTimeField(_('mis à jour le'), auto_now=True)
    
    class Meta:
        verbose_name = _('plan d\'abonnement')
        verbose_name_plural = _('plans d\'abonnement')
        ordering = ['price']
    
    def __str__(self):
        return f"{self.name} ({self.get_billing_cycle_display()}: {self.price}€)"



class Subscription(models.Model):
    """Modèle pour les abonnements des utilisateurs."""
    
    STATUS_CHOICES = (
        ('active', 'Actif'),
        ('pending', 'En attente'),
        ('cancelled', 'Annulé'),
        ('expired', 'Expiré'),
        ('trial', 'Période d\'essai'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subscriptions')
    plan = models.ForeignKey(SubscriptionPlan, on_delete=models.SET_NULL, null=True, related_name='subscriptions')
    status = models.CharField(_('statut'), max_length=20, choices=STATUS_CHOICES, default='pending')
    amount = models.DecimalField(_('montant'), max_digits=10, decimal_places=2)
    billing_cycle = models.CharField(_('cycle de facturation'), max_length=10, choices=SubscriptionPlan.BILLING_CYCLE_CHOICES)
    starts_at = models.DateTimeField(_('commence le'), default=timezone.now)
    expires_at = models.DateTimeField(_('expire le'))
    auto_renew = models.BooleanField(_('renouvellement automatique'), default=True)
    next_billing_date = models.DateTimeField(_('prochaine facturation'), blank=True, null=True)
    cancelled_at = models.DateTimeField(_('annulé le'), blank=True, null=True)
    payment_method = models.CharField(_('méthode de paiement'), max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(_('créé le'), auto_now_add=True)
    updated_at = models.DateTimeField(_('mis à jour le'), auto_now=True)
    
    class Meta:
        verbose_name = _('abonnement')
        verbose_name_plural = _('abonnements')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Abonnement {self.plan.name} de {self.user.email}"
    
    def save(self, *args, **kwargs):
        # Calcul de la date d'expiration si elle n'est pas déjà définie
        if not self.expires_at:
            if self.billing_cycle == 'weekly':
                self.expires_at = self.starts_at + timedelta(days=7)
            elif self.billing_cycle == 'monthly':
                self.expires_at = self.starts_at + timedelta(days=30)
            elif self.billing_cycle == 'yearly':
                self.expires_at = self.starts_at + timedelta(days=365)
                
        # Calcul de la prochaine date de facturation si elle n'est pas déjà définie
        if self.auto_renew and not self.next_billing_date:
            self.next_billing_date = self.expires_at
            
        super().save(*args, **kwargs)
    
    @property
    def is_valid(self):
        """Vérifie si l'abonnement est valide."""
        return self.status == 'active' and self.expires_at > timezone.now()
    
    @property
    def days_remaining(self):
        """Calcule le nombre de jours restants avant expiration."""
        if not self.expires_at:
            return 0
            
        days = (self.expires_at - timezone.now()).days
        return max(0, days)



class Payment(models.Model):
    """Modèle pour les paiements des utilisateurs."""
    
    STATUS_CHOICES = (
        ('pending', 'En attente'),
        ('completed', 'Terminé'),
        ('failed', 'Échoué'),
        ('refunded', 'Remboursé'),
        ('refund_requested', 'Remboursement demandé'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payments')
    subscription = models.ForeignKey(Subscription, on_delete=models.SET_NULL, related_name='payments', null=True, blank=True)
    amount = models.DecimalField(_('montant'), max_digits=10, decimal_places=2)
    payment_method = models.CharField(_('méthode de paiement'), max_length=50)
    transaction_id = models.CharField(_('ID de transaction'), max_length=255, unique=True)
    status = models.CharField(_('statut'), max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_date = models.DateTimeField(_('date de paiement'), auto_now_add=True)
    updated_at = models.DateTimeField(_('mis à jour le'), auto_now=True)
    refund_reason = models.TextField(_('raison du remboursement'), blank=True, null=True)
    refund_requested_at = models.DateTimeField(_('remboursement demandé le'), blank=True, null=True)
    refunded_at = models.DateTimeField(_('remboursé le'), blank=True, null=True)
    payment_details = models.JSONField(_('détails du paiement'), blank=True, null=True)
    invoice_url = models.URLField(_('lien vers la facture'), blank=True, null=True)
    
    class Meta:
        verbose_name = _('paiement')
        verbose_name_plural = _('paiements')
        ordering = ['-payment_date']
    
    def __str__(self):
        subscription_info = f" pour {self.subscription}" if self.subscription else ""
        return f"Paiement de {self.amount}€ par {self.user.email}{subscription_info}"

class JobBoost(models.Model):
    """Modèle pour les boosts d'annonces."""
    
    TYPE_CHOICES = (
        ('urgent', 'Urgent'),
        ('new', 'Nouveau'),
        ('top', 'Premium'),
    )
    
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='boosts')
    type = models.CharField(_('type'), max_length=10, choices=TYPE_CHOICES)
    amount = models.DecimalField(_('montant'), max_digits=10, decimal_places=2)
    starts_at = models.DateTimeField(_('commence le'), default=timezone.now)
    expires_at = models.DateTimeField(_('expire le'))
    is_active = models.BooleanField(_('actif'), default=True)
    payment = models.ForeignKey(Payment, on_delete=models.SET_NULL, related_name='job_boosts', null=True, blank=True)
    created_at = models.DateTimeField(_('créé le'), auto_now_add=True)
    
    class Meta:
        verbose_name = _('boost d\'annonce')
        verbose_name_plural = _('boosts d\'annonces')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Boost {self.get_type_display()} pour {self.job.title}"
    
    def save(self, *args, **kwargs):
        # Mettre à jour le statut du job en fonction du type de boost
        if self.type == 'urgent':
            self.job.is_urgent = True
        elif self.type == 'new':
            self.job.is_new = True
        elif self.type == 'top':
            self.job.is_top = True
            
        self.job.save()
        super().save(*args, **kwargs)

class JobShare(models.Model):
    """Modèle pour suivre les partages d'offres d'emploi."""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='shares')
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='shares')
    share_method = models.CharField(_('méthode de partage'), max_length=20, 
                                   choices=(
                                       ('email', 'Email'),
                                       ('sms', 'SMS'),
                                       ('whatsapp', 'WhatsApp'),
                                       ('facebook', 'Facebook'),
                                       ('twitter', 'Twitter'),
                                       ('linkedin', 'LinkedIn'),
                                       ('copy', 'Copier le lien'),
                                       ('other', 'Autre')
                                   ))
    share_to = models.EmailField(_('partagé à'), blank=True, null=True)
    created_at = models.DateTimeField(_('partagé le'), auto_now_add=True)
    
    class Meta:
        verbose_name = _('partage d\'emploi')
        verbose_name_plural = _('partages d\'emplois')
        ordering = ['-created_at']
        
    def __str__(self):
        return f"Partage de {self.job.title} par {self.user.email} via {self.get_share_method_display()}"


class UserConnection(models.Model):
    """Modèle pour les connexions entre utilisateurs (réseau professionnel)."""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='connections')
    connected_to = models.ForeignKey(User, on_delete=models.CASCADE, related_name='connected_from')
    status = models.CharField(_('statut'), max_length=20, 
                             choices=(
                                 ('pending', 'En attente'),
                                 ('accepted', 'Acceptée'),
                                 ('rejected', 'Refusée')
                             ),
                             default='pending')
    created_at = models.DateTimeField(_('créée le'), auto_now_add=True)
    updated_at = models.DateTimeField(_('mise à jour le'), auto_now=True)
    
    class Meta:
        verbose_name = _('connexion utilisateur')
        verbose_name_plural = _('connexions utilisateurs')
        ordering = ['-created_at']
        unique_together = [['user', 'connected_to']]
        
    def __str__(self):
        return f"Connexion de {self.user.email} à {self.connected_to.email} ({self.get_status_display()})"
      
class Statistic(models.Model):
    """Modèle pour les statistiques journalières des offres d'emploi."""
    
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='statistics')
    date = models.DateField(_('date'))
    views = models.IntegerField(_('vues'), default=0)
    applications = models.IntegerField(_('candidatures'), default=0)
    conversion_rate = models.DecimalField(_('taux de conversion'), max_digits=5, decimal_places=2, default=0)
    created_at = models.DateTimeField(_('créé le'), auto_now_add=True)
    updated_at = models.DateTimeField(_('mis à jour le'), auto_now=True)
    
    class Meta:
        verbose_name = _('statistique')
        verbose_name_plural = _('statistiques')
        ordering = ['-date']
        # S'assurer qu'il n'y a qu'une statistique par jour par offre d'emploi
        constraints = [
            models.UniqueConstraint(fields=['job', 'date'], name='unique_job_date_statistic')
        ]
    
    def __str__(self):
        return f"Statistiques pour {self.job.title} le {self.date}"
    
    def save(self, *args, **kwargs):
        # Calcul du taux de conversion si le nombre de vues est > 0
        if self.views > 0:
            self.conversion_rate = (self.applications / self.views) * 100
        
        super().save(*args, **kwargs)

class FlashJob(models.Model):
    """Modèle pour les emplois flash (urgent et à court terme)."""
    
    STATUS_CHOICES = (
        ('pending', 'En attente'),
        ('active', 'Actif'),
        ('filled', 'Pourvu'),
        ('cancelled', 'Annulé'),
        ('expired', 'Expiré'),
    )
    
    job = models.OneToOneField(Job, on_delete=models.CASCADE, related_name='flash_job')
    start_time = models.DateTimeField(_('heure de début'))
    end_time = models.DateTimeField(_('heure de fin'), default=timezone.now)
    confirmation_required = models.BooleanField(_('confirmation requise'), default=True)
    is_confirmed = models.BooleanField(_('confirmé'), default=False)
    max_applicants = models.IntegerField(_('nombre maximum de candidats'), blank=True, null=True)
    current_applicants = models.IntegerField(_('nombre actuel de candidats'), default=0)
    status = models.CharField(_('statut'), max_length=20, choices=STATUS_CHOICES, default='pending')
    is_immediate = models.BooleanField(_('démarrage immédiat'), default=False)
    salary_per_hour = models.DecimalField(_('salaire horaire'), max_digits=10, decimal_places=2, blank=True, null=True)
    salary_total = models.DecimalField(_('salaire total'), max_digits=10, decimal_places=2, blank=True, null=True)
    created_at = models.DateTimeField(_('créé le'), auto_now_add=True)
    updated_at = models.DateTimeField(_('mis à jour le'), auto_now=True)
    
    class Meta:
        verbose_name = _('emploi flash')
        verbose_name_plural = _('emplois flash')
        ordering = ['start_time']
    
    def __str__(self):
        return f"Emploi flash: {self.job.title} à {self.start_time}"
    
    def save(self, *args, **kwargs):
        # Marquer l'offre comme urgente automatiquement
        if not self.job.is_urgent:
            self.job.is_urgent = True
            self.job.save()
        
        # Vérifier l'expiration
        if self.end_time < timezone.now() and self.status not in ['expired', 'cancelled']:
            self.status = 'expired'
            
        # Si le nombre max de candidats est atteint, marquer comme pourvu
        if self.max_applicants and self.current_applicants >= self.max_applicants and self.status != 'filled':
            self.status = 'filled'
        
        super().save(*args, **kwargs)
        
    @property
    def is_expired(self):
        """Vérifie si l'emploi flash est expiré."""
        return self.end_time < timezone.now()
    
    @property
    def time_until_start(self):
        """Retourne le temps restant avant le début."""
        if self.start_time < timezone.now():
            return "Maintenant"
            
        delta = self.start_time - timezone.now()
        hours, remainder = divmod(delta.seconds, 3600)
        minutes, _ = divmod(remainder, 60)
        
        if delta.days > 0:
            return f"{delta.days}j {hours}h"
        elif hours > 0:
            return f"{hours}h {minutes}min"
        else:
            return f"{minutes}min"

class Favorite(models.Model):
    """Modèle pour les offres d'emploi favorites des utilisateurs."""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorite_jobs')
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='favorited_by')
    created_at = models.DateTimeField(_('créé le'), auto_now_add=True)
    
    class Meta:
        verbose_name = _('favori')
        verbose_name_plural = _('favoris')
        ordering = ['-created_at']
        # S'assurer qu'un utilisateur ne peut pas mettre en favori plusieurs fois la même offre
        constraints = [
            models.UniqueConstraint(fields=['user', 'job'], name='unique_favorite')
        ]
    
    def __str__(self):
        return f"{self.user.email} ♥ {self.job.title}"


class ApplyAiSetting(models.Model):
    """Modèle pour les paramètres ApplyAI des utilisateurs."""
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='apply_ai_settings')
    categories = models.JSONField(_('catégories'), default=list)
    salary_range = models.JSONField(_('fourchette de salaire'), default=dict)
    filters = models.JSONField(_('filtres'), blank=True, null=True)
    excluded_companies = models.JSONField(_('entreprises exclues'), blank=True, null=True)
    notification_time = models.TimeField(_('heure de notification'))
    is_active = models.BooleanField(_('actif'), default=True)
    auto_apply = models.BooleanField(_('candidature automatique'), default=False)
    cv_file = models.FileField(upload_to='apply_ai/cv/', blank=True, null=True)
    created_at = models.DateTimeField(_('créé le'), auto_now_add=True)
    updated_at = models.DateTimeField(_('mis à jour le'), auto_now=True)
    
    class Meta:
        verbose_name = _('paramètre ApplyAI')
        verbose_name_plural = _('paramètres ApplyAI')
    
    def __str__(self):
        return f"Paramètres ApplyAI de {self.user.email}"

class ApplyAiSuggestion(models.Model):
    """Modèle pour les suggestions d'emplois générées par ApplyAI."""
    
    STATUS_CHOICES = (
        ('pending', 'En attente'),
        ('applied', 'Candidature envoyée'),
        ('rejected', 'Rejeté'),
        ('saved', 'Sauvegardé'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ai_suggestions')
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='ai_suggestions')
    match_percentage = models.DecimalField(_('pourcentage de correspondance'), max_digits=5, decimal_places=2)
    match_reasons = models.JSONField(_('raisons de correspondance'), default=list)
    status = models.CharField(_('statut'), max_length=20, choices=STATUS_CHOICES, default='pending')
    applied_date = models.DateTimeField(_('date de candidature'), blank=True, null=True)
    is_viewed = models.BooleanField(_('vu'), default=False)
    created_at = models.DateTimeField(_('créé le'), auto_now_add=True)
    
    class Meta:
        verbose_name = _('suggestion ApplyAI')
        verbose_name_plural = _('suggestions ApplyAI')
        ordering = ['-match_percentage']
        # Un emploi ne peut être suggéré qu'une fois par utilisateur
        constraints = [
            models.UniqueConstraint(fields=['user', 'job'], name='unique_suggestion')
        ]
    
    def __str__(self):
        return f"Suggestion pour {self.user.email}: {self.job.title} ({self.match_percentage}%)"