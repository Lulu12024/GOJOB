# Generated by Django 5.2 on 2025-04-15 14:56

import django.db.models.deletion
import django.utils.timezone
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('email', models.EmailField(max_length=254, unique=True, verbose_name='adresse email')),
                ('role', models.CharField(choices=[('employer', 'Employeur'), ('candidate', 'Candidat'), ('admin', 'Administrateur')], default='candidate', max_length=20, verbose_name='rôle')),
                ('phone', models.CharField(blank=True, max_length=20, null=True, verbose_name='téléphone')),
                ('profile_image', models.ImageField(blank=True, null=True, upload_to='profile_images/')),
                ('bio', models.TextField(blank=True, null=True, verbose_name='biographie')),
                ('address', models.CharField(blank=True, max_length=255, null=True, verbose_name='adresse')),
                ('city', models.CharField(blank=True, max_length=100, null=True, verbose_name='ville')),
                ('is_handicapped', models.BooleanField(default=False, verbose_name='handicapé')),
                ('has_driving_license', models.BooleanField(default=False, verbose_name='a le permis de conduire')),
                ('has_vehicle', models.BooleanField(default=False, verbose_name='a un véhicule')),
                ('member_since', models.IntegerField(blank=True, null=True, verbose_name='membre depuis')),
                ('skills', models.JSONField(blank=True, null=True, verbose_name='compétences')),
                ('experience', models.JSONField(blank=True, null=True, verbose_name='expérience')),
                ('education', models.JSONField(blank=True, null=True, verbose_name='formation')),
                ('languages', models.JSONField(blank=True, null=True, verbose_name='langues')),
                ('job_preferences', models.JSONField(blank=True, null=True, verbose_name="préférences d'emploi")),
                ('company_name', models.CharField(blank=True, max_length=255, null=True, verbose_name="nom de l'entreprise")),
                ('company_description', models.TextField(blank=True, null=True, verbose_name="description de l'entreprise")),
                ('company_website', models.URLField(blank=True, null=True, verbose_name="site web de l'entreprise")),
                ('company_size', models.CharField(blank=True, max_length=50, null=True, verbose_name="taille de l'entreprise")),
                ('company_industry', models.CharField(blank=True, max_length=100, null=True, verbose_name="secteur de l'entreprise")),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'utilisateur',
                'verbose_name_plural': 'utilisateurs',
            },
        ),
        migrations.CreateModel(
            name='ApplyAiSetting',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('categories', models.JSONField(default=list, verbose_name='catégories')),
                ('salary_min', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True, verbose_name='salaire minimum')),
                ('salary_max', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True, verbose_name='salaire maximum')),
                ('excluded_companies', models.JSONField(blank=True, null=True, verbose_name='entreprises exclues')),
                ('filters', models.JSONField(blank=True, null=True, verbose_name='filtres')),
                ('notification_time', models.TimeField(verbose_name='heure de notification')),
                ('is_active', models.BooleanField(default=True, verbose_name='actif')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='créé le')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='mis à jour le')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='apply_ai_settings', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'paramètre ApplyAI',
                'verbose_name_plural': 'paramètres ApplyAI',
            },
        ),
        migrations.CreateModel(
            name='Job',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255, verbose_name='titre')),
                ('description', models.TextField(verbose_name='description')),
                ('category', models.CharField(max_length=100, verbose_name='catégorie')),
                ('subcategory', models.CharField(blank=True, max_length=100, null=True, verbose_name='sous-catégorie')),
                ('city', models.CharField(max_length=100, verbose_name='ville')),
                ('address', models.CharField(blank=True, max_length=255, null=True, verbose_name='adresse')),
                ('salary_type', models.CharField(choices=[('hourly', 'Horaire'), ('monthly', 'Mensuel')], max_length=10, verbose_name='type de salaire')),
                ('salary_amount', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True, verbose_name='montant du salaire')),
                ('contract_type', models.CharField(choices=[('CDI', 'CDI'), ('CDD', 'CDD'), ('Freelance', 'Freelance'), ('Alternance', 'Alternance')], max_length=20, verbose_name='type de contrat')),
                ('is_entry_level', models.BooleanField(default=False, verbose_name='débutant accepté')),
                ('experience_years_required', models.IntegerField(default=0, verbose_name="années d'expérience requises")),
                ('requires_driving_license', models.BooleanField(default=False, verbose_name='permis de conduire requis')),
                ('accepts_working_visa', models.BooleanField(default=False, verbose_name='accepte les visas de travail')),
                ('accepts_holiday_visa', models.BooleanField(default=False, verbose_name='accepte les visas vacances-travail')),
                ('accepts_student_visa', models.BooleanField(default=False, verbose_name='accepte les visas étudiants')),
                ('has_accommodation', models.BooleanField(default=False, verbose_name='logement fourni')),
                ('accommodation_accepts_children', models.BooleanField(default=False, verbose_name='logement accepte les enfants')),
                ('accommodation_accepts_dogs', models.BooleanField(default=False, verbose_name='logement accepte les chiens')),
                ('accommodation_is_accessible', models.BooleanField(default=False, verbose_name='logement accessible aux handicapés')),
                ('job_accepts_handicapped', models.BooleanField(default=False, verbose_name='poste adapté aux handicapés')),
                ('has_company_car', models.BooleanField(default=False, verbose_name='véhicule de fonction')),
                ('contact_name', models.CharField(blank=True, max_length=100, null=True, verbose_name='nom du contact')),
                ('contact_phone', models.CharField(blank=True, max_length=20, null=True, verbose_name='téléphone du contact')),
                ('contact_methods', models.JSONField(default=list, verbose_name='méthodes de contact')),
                ('website_url', models.URLField(blank=True, null=True, verbose_name='site web')),
                ('is_urgent', models.BooleanField(default=False, verbose_name='urgent')),
                ('is_new', models.BooleanField(default=True, verbose_name='nouveau')),
                ('is_top', models.BooleanField(default=False, verbose_name='premium')),
                ('status', models.CharField(choices=[('active', 'Active'), ('closed', 'Fermée'), ('draft', 'Brouillon')], default='active', max_length=10, verbose_name='statut')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='créé le')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='mis à jour le')),
                ('expires_at', models.DateTimeField(blank=True, null=True, verbose_name='expire le')),
                ('views_count', models.IntegerField(default=0, verbose_name='nombre de vues')),
                ('applications_count', models.IntegerField(default=0, verbose_name='nombre de candidatures')),
                ('conversion_rate', models.DecimalField(decimal_places=2, default=0, max_digits=5, verbose_name='taux de conversion')),
                ('employer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='jobs', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': "offre d'emploi",
                'verbose_name_plural': "offres d'emploi",
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='FlashJob',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('start_time', models.DateTimeField(verbose_name='heure de début')),
                ('confirmation_required', models.BooleanField(default=True, verbose_name='confirmation requise')),
                ('is_confirmed', models.BooleanField(default=False, verbose_name='confirmé')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='créé le')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='mis à jour le')),
                ('job', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='flash_job', to='api.job')),
            ],
            options={
                'verbose_name': 'emploi flash',
                'verbose_name_plural': 'emplois flash',
                'ordering': ['start_time'],
            },
        ),
        migrations.CreateModel(
            name='Favorite',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='créé le')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='favorite_jobs', to=settings.AUTH_USER_MODEL)),
                ('job', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='favorited_by', to='api.job')),
            ],
            options={
                'verbose_name': 'favori',
                'verbose_name_plural': 'favoris',
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='Contract',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('template_url', models.FileField(upload_to='contracts/templates/', verbose_name='modèle de contrat')),
                ('signed_url', models.FileField(blank=True, null=True, upload_to='contracts/signed/', verbose_name='contrat signé')),
                ('status', models.CharField(choices=[('draft', 'Brouillon'), ('sent', 'Envoyé'), ('signed', 'Signé'), ('active', 'Actif'), ('terminated', 'Terminé')], default='draft', max_length=20, verbose_name='statut')),
                ('signed_at', models.DateTimeField(blank=True, null=True, verbose_name='signé le')),
                ('start_date', models.DateField(blank=True, null=True, verbose_name='date de début')),
                ('end_date', models.DateField(blank=True, null=True, verbose_name='date de fin')),
                ('bank_details', models.JSONField(blank=True, null=True, verbose_name='informations bancaires')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='créé le')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='mis à jour le')),
                ('candidate', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='signed_contracts', to=settings.AUTH_USER_MODEL)),
                ('employer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='contracts', to=settings.AUTH_USER_MODEL)),
                ('job', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='contracts', to='api.job')),
            ],
            options={
                'verbose_name': 'contrat',
                'verbose_name_plural': 'contrats',
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='Application',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cv_url', models.FileField(blank=True, null=True, upload_to='application_documents/cv/', verbose_name='CV')),
                ('motivation_letter_url', models.FileField(blank=True, null=True, upload_to='application_documents/motivation/', verbose_name='lettre de motivation')),
                ('custom_answers', models.JSONField(blank=True, null=True, verbose_name='réponses personnalisées')),
                ('status', models.CharField(choices=[('pending', 'En attente'), ('accepted', 'Acceptée'), ('rejected', 'Refusée'), ('on_hold', 'En suspens')], default='pending', max_length=20, verbose_name='statut')),
                ('is_read', models.BooleanField(default=False, verbose_name='lue')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='créée le')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='mise à jour le')),
                ('candidate', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='applications', to=settings.AUTH_USER_MODEL)),
                ('job', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='applications', to='api.job')),
            ],
            options={
                'verbose_name': 'candidature',
                'verbose_name_plural': 'candidatures',
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='JobPhoto',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('photo', models.ImageField(upload_to='job_photos/')),
                ('order', models.IntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('job', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='photos', to='api.job')),
            ],
            options={
                'verbose_name': "photo d'offre",
                'verbose_name_plural': "photos d'offres",
                'ordering': ['order'],
            },
        ),
        migrations.CreateModel(
            name='Message',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.TextField(verbose_name='contenu')),
                ('is_read', models.BooleanField(default=False, verbose_name='lu')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='créé le')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='mis à jour le')),
                ('job', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='messages', to='api.job')),
                ('receiver', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='received_messages', to=settings.AUTH_USER_MODEL)),
                ('sender', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sent_messages', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'message',
                'verbose_name_plural': 'messages',
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(choices=[('new_application', 'Nouvelle candidature'), ('application_status', 'Statut de candidature'), ('new_message', 'Nouveau message'), ('flash_job', 'Emploi flash'), ('new_contract', 'Nouveau contrat'), ('signed_contract', 'Contrat signé'), ('subscription', 'Abonnement'), ('payment', 'Paiement')], max_length=30, verbose_name='type')),
                ('data', models.JSONField(verbose_name='données')),
                ('is_read', models.BooleanField(default=False, verbose_name='lue')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='créée le')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='notifications', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'notification',
                'verbose_name_plural': 'notifications',
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='Statistic',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(verbose_name='date')),
                ('views', models.IntegerField(default=0, verbose_name='vues')),
                ('applications', models.IntegerField(default=0, verbose_name='candidatures')),
                ('conversion_rate', models.DecimalField(decimal_places=2, default=0, max_digits=5, verbose_name='taux de conversion')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='créé le')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='mis à jour le')),
                ('job', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='statistics', to='api.job')),
            ],
            options={
                'verbose_name': 'statistique',
                'verbose_name_plural': 'statistiques',
                'ordering': ['-date'],
            },
        ),
        migrations.CreateModel(
            name='Subscription',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('plan_type', models.CharField(choices=[('basic_pro', 'Basique Pro'), ('standard_pro', 'Standard Pro'), ('premium_pro', 'Premium Pro'), ('apply_ai', 'ApplyAI'), ('apply_ai_pro', 'ApplyAI Pro')], max_length=20, verbose_name="type d'abonnement")),
                ('amount', models.DecimalField(decimal_places=2, max_digits=10, verbose_name='montant')),
                ('billing_cycle', models.CharField(choices=[('weekly', 'Hebdomadaire'), ('monthly', 'Mensuel')], max_length=10, verbose_name='cycle de facturation')),
                ('starts_at', models.DateTimeField(default=django.utils.timezone.now, verbose_name='commence le')),
                ('expires_at', models.DateTimeField(verbose_name='expire le')),
                ('is_active', models.BooleanField(default=True, verbose_name='actif')),
                ('auto_renew', models.BooleanField(default=True, verbose_name='renouvellement automatique')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='créé le')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='mis à jour le')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='subscription', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'abonnement',
                'verbose_name_plural': 'abonnements',
            },
        ),
        migrations.CreateModel(
            name='Payment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.DecimalField(decimal_places=2, max_digits=10, verbose_name='montant')),
                ('payment_method', models.CharField(max_length=50, verbose_name='méthode de paiement')),
                ('transaction_id', models.CharField(max_length=255, unique=True, verbose_name='ID de transaction')),
                ('status', models.CharField(choices=[('pending', 'En attente'), ('completed', 'Terminé'), ('failed', 'Échoué'), ('refunded', 'Remboursé'), ('refund_requested', 'Remboursement demandé')], default='pending', max_length=20, verbose_name='statut')),
                ('payment_date', models.DateTimeField(auto_now_add=True, verbose_name='date de paiement')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='mis à jour le')),
                ('refund_reason', models.TextField(blank=True, null=True, verbose_name='raison du remboursement')),
                ('refund_requested_at', models.DateTimeField(blank=True, null=True, verbose_name='remboursement demandé le')),
                ('refunded_at', models.DateTimeField(blank=True, null=True, verbose_name='remboursé le')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='payments', to=settings.AUTH_USER_MODEL)),
                ('subscription', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='payments', to='api.subscription')),
            ],
            options={
                'verbose_name': 'paiement',
                'verbose_name_plural': 'paiements',
                'ordering': ['-payment_date'],
            },
        ),
        migrations.AddIndex(
            model_name='job',
            index=models.Index(fields=['status'], name='api_job_status_12e2d1_idx'),
        ),
        migrations.AddIndex(
            model_name='job',
            index=models.Index(fields=['category'], name='api_job_categor_eef067_idx'),
        ),
        migrations.AddIndex(
            model_name='job',
            index=models.Index(fields=['city'], name='api_job_city_6b6ee2_idx'),
        ),
        migrations.AddConstraint(
            model_name='favorite',
            constraint=models.UniqueConstraint(fields=('user', 'job'), name='unique_favorite'),
        ),
        migrations.AddConstraint(
            model_name='application',
            constraint=models.UniqueConstraint(fields=('job', 'candidate'), name='unique_application'),
        ),
        migrations.AddIndex(
            model_name='notification',
            index=models.Index(fields=['user', 'is_read'], name='api_notific_user_id_16328d_idx'),
        ),
        migrations.AddIndex(
            model_name='notification',
            index=models.Index(fields=['type'], name='api_notific_type_f8c324_idx'),
        ),
        migrations.AddConstraint(
            model_name='statistic',
            constraint=models.UniqueConstraint(fields=('job', 'date'), name='unique_job_date_statistic'),
        ),
    ]
