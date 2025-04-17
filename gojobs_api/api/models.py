from django.db import models

# Create your models here.
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
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
    title = models.CharField(_('titre'), max_length=255)
    description = models.TextField(_('description'))
    category = models.CharField(_('catégorie'), max_length=100)
    subcategory = models.CharField(_('sous-catégorie'), max_length=100, blank=True, null=True)
    
    # Localisation
    city = models.CharField(_('ville'), max_length=100)
    address = models.CharField(_('adresse'), max_length=255, blank=True, null=True)
    
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
    created_at = models.DateTimeField(_('créé le'), auto_now_add=True)
    updated_at = models.DateTimeField(_('mis à jour le'), auto_now=True)
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
    subscription = models.ForeignKey('Subscription', on_delete=models.SET_NULL, related_name='payments', null=True, blank=True)
    amount = models.DecimalField(_('montant'), max_digits=10, decimal_places=2)
    payment_method = models.CharField(_('méthode de paiement'), max_length=50)
    transaction_id = models.CharField(_('ID de transaction'), max_length=255, unique=True)
    status = models.CharField(_('statut'), max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_date = models.DateTimeField(_('date de paiement'), auto_now_add=True)
    updated_at = models.DateTimeField(_('mis à jour le'), auto_now=True)
    refund_reason = models.TextField(_('raison du remboursement'), blank=True, null=True)
    refund_requested_at = models.DateTimeField(_('remboursement demandé le'), blank=True, null=True)
    refunded_at = models.DateTimeField(_('remboursé le'), blank=True, null=True)
    
    class Meta:
        verbose_name = _('paiement')
        verbose_name_plural = _('paiements')
        ordering = ['-payment_date']
    
    def __str__(self):
        subscription_info = f" pour {self.subscription}" if self.subscription else ""
        return f"Paiement de {self.amount}€ par {self.user.email}{subscription_info}"


class Subscription(models.Model):
    """Modèle pour les abonnements des utilisateurs."""
    
    PLAN_TYPE_CHOICES = (
        ('basic_pro', 'Basique Pro'),
        ('standard_pro', 'Standard Pro'),
        ('premium_pro', 'Premium Pro'),
        ('apply_ai', 'ApplyAI'),
        ('apply_ai_pro', 'ApplyAI Pro'),
    )
    
    BILLING_CYCLE_CHOICES = (
        ('weekly', 'Hebdomadaire'),
        ('monthly', 'Mensuel'),
    )
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='subscription')
    plan_type = models.CharField(_('type d\'abonnement'), max_length=20, choices=PLAN_TYPE_CHOICES)
    amount = models.DecimalField(_('montant'), max_digits=10, decimal_places=2)
    billing_cycle = models.CharField(_('cycle de facturation'), max_length=10, choices=BILLING_CYCLE_CHOICES)
    starts_at = models.DateTimeField(_('commence le'), default=timezone.now)
    expires_at = models.DateTimeField(_('expire le'))
    is_active = models.BooleanField(_('actif'), default=True)
    auto_renew = models.BooleanField(_('renouvellement automatique'), default=True)
    created_at = models.DateTimeField(_('créé le'), auto_now_add=True)
    updated_at = models.DateTimeField(_('mis à jour le'), auto_now=True)
    
    class Meta:
        verbose_name = _('abonnement')
        verbose_name_plural = _('abonnements')
    
    def __str__(self):
        return f"Abonnement {self.plan_type} de {self.user.email}"


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
    
    job = models.OneToOneField(Job, on_delete=models.CASCADE, related_name='flash_job')
    start_time = models.DateTimeField(_('heure de début'))
    confirmation_required = models.BooleanField(_('confirmation requise'), default=True)
    is_confirmed = models.BooleanField(_('confirmé'), default=False)
    created_at = models.DateTimeField(_('créé le'), auto_now_add=True)
    updated_at = models.DateTimeField(_('mis à jour le'), auto_now=True)
    
    class Meta:
        verbose_name = _('emploi flash')
        verbose_name_plural = _('emplois flash')
        ordering = ['start_time']
    
    def __str__(self):
        return f"Emploi flash: {self.job.title} à {self.start_time}"


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
    salary_min = models.DecimalField(_('salaire minimum'), max_digits=10, decimal_places=2, blank=True, null=True)
    salary_max = models.DecimalField(_('salaire maximum'), max_digits=10, decimal_places=2, blank=True, null=True)
    excluded_companies = models.JSONField(_('entreprises exclues'), blank=True, null=True)
    filters = models.JSONField(_('filtres'), blank=True, null=True)
    notification_time = models.TimeField(_('heure de notification'))
    is_active = models.BooleanField(_('actif'), default=True)
    created_at = models.DateTimeField(_('créé le'), auto_now_add=True)
    updated_at = models.DateTimeField(_('mis à jour le'), auto_now=True)
    
    class Meta:
        verbose_name = _('paramètre ApplyAI')
        verbose_name_plural = _('paramètres ApplyAI')
    
    def __str__(self):
        return f"Paramètres ApplyAI de {self.user.email}"