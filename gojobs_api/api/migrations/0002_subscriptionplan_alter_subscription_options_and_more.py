# Generated by Django 5.2 on 2025-04-24 19:24

import django.db.models.deletion
import django.utils.timezone
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='SubscriptionPlan',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, verbose_name='nom')),
                ('description', models.TextField(verbose_name='description')),
                ('type', models.CharField(choices=[('basic_pro', 'Basique Pro'), ('standard_pro', 'Standard Pro'), ('premium_pro', 'Premium Pro'), ('apply_ai', 'ApplyAI'), ('apply_ai_pro', 'ApplyAI Pro')], max_length=20, verbose_name='type')),
                ('price', models.DecimalField(decimal_places=2, max_digits=10, verbose_name='prix')),
                ('billing_cycle', models.CharField(choices=[('weekly', 'Hebdomadaire'), ('monthly', 'Mensuel'), ('yearly', 'Annuel')], max_length=10, verbose_name='cycle de facturation')),
                ('features', models.JSONField(default=list, verbose_name='fonctionnalités')),
                ('is_active', models.BooleanField(default=True, verbose_name='actif')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='créé le')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='mis à jour le')),
            ],
            options={
                'verbose_name': "plan d'abonnement",
                'verbose_name_plural': "plans d'abonnement",
                'ordering': ['price'],
            },
        ),
        migrations.AlterModelOptions(
            name='subscription',
            options={'ordering': ['-created_at'], 'verbose_name': 'abonnement', 'verbose_name_plural': 'abonnements'},
        ),
        migrations.RemoveField(
            model_name='applyaisetting',
            name='salary_max',
        ),
        migrations.RemoveField(
            model_name='applyaisetting',
            name='salary_min',
        ),
        migrations.RemoveField(
            model_name='subscription',
            name='is_active',
        ),
        migrations.RemoveField(
            model_name='subscription',
            name='plan_type',
        ),
        migrations.AddField(
            model_name='applyaisetting',
            name='auto_apply',
            field=models.BooleanField(default=False, verbose_name='candidature automatique'),
        ),
        migrations.AddField(
            model_name='applyaisetting',
            name='cv_file',
            field=models.FileField(blank=True, null=True, upload_to='apply_ai/cv/'),
        ),
        migrations.AddField(
            model_name='applyaisetting',
            name='salary_range',
            field=models.JSONField(default=dict, verbose_name='fourchette de salaire'),
        ),
        migrations.AddField(
            model_name='flashjob',
            name='current_applicants',
            field=models.IntegerField(default=0, verbose_name='nombre actuel de candidats'),
        ),
        migrations.AddField(
            model_name='flashjob',
            name='end_time',
            field=models.DateTimeField(default=django.utils.timezone.now, verbose_name='heure de fin'),
        ),
        migrations.AddField(
            model_name='flashjob',
            name='is_immediate',
            field=models.BooleanField(default=False, verbose_name='démarrage immédiat'),
        ),
        migrations.AddField(
            model_name='flashjob',
            name='max_applicants',
            field=models.IntegerField(blank=True, null=True, verbose_name='nombre maximum de candidats'),
        ),
        migrations.AddField(
            model_name='flashjob',
            name='salary_per_hour',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True, verbose_name='salaire horaire'),
        ),
        migrations.AddField(
            model_name='flashjob',
            name='salary_total',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True, verbose_name='salaire total'),
        ),
        migrations.AddField(
            model_name='flashjob',
            name='status',
            field=models.CharField(choices=[('pending', 'En attente'), ('active', 'Actif'), ('filled', 'Pourvu'), ('cancelled', 'Annulé'), ('expired', 'Expiré')], default='pending', max_length=20, verbose_name='statut'),
        ),
        migrations.AddField(
            model_name='job',
            name='company',
            field=models.CharField(blank=True, max_length=255, null=True, verbose_name='entreprise'),
        ),
        migrations.AddField(
            model_name='payment',
            name='invoice_url',
            field=models.URLField(blank=True, null=True, verbose_name='lien vers la facture'),
        ),
        migrations.AddField(
            model_name='payment',
            name='payment_details',
            field=models.JSONField(blank=True, null=True, verbose_name='détails du paiement'),
        ),
        migrations.AddField(
            model_name='subscription',
            name='cancelled_at',
            field=models.DateTimeField(blank=True, null=True, verbose_name='annulé le'),
        ),
        migrations.AddField(
            model_name='subscription',
            name='next_billing_date',
            field=models.DateTimeField(blank=True, null=True, verbose_name='prochaine facturation'),
        ),
        migrations.AddField(
            model_name='subscription',
            name='payment_method',
            field=models.CharField(blank=True, max_length=50, null=True, verbose_name='méthode de paiement'),
        ),
        migrations.AddField(
            model_name='subscription',
            name='status',
            field=models.CharField(choices=[('active', 'Actif'), ('pending', 'En attente'), ('cancelled', 'Annulé'), ('expired', 'Expiré'), ('trial', "Période d'essai")], default='pending', max_length=20, verbose_name='statut'),
        ),
        migrations.AlterField(
            model_name='job',
            name='category',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name='job',
            name='created_at',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
        migrations.AlterField(
            model_name='job',
            name='description',
            field=models.TextField(),
        ),
        migrations.AlterField(
            model_name='job',
            name='subcategory',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='job',
            name='title',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='job',
            name='updated_at',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
        migrations.AlterField(
            model_name='subscription',
            name='billing_cycle',
            field=models.CharField(choices=[('weekly', 'Hebdomadaire'), ('monthly', 'Mensuel'), ('yearly', 'Annuel')], max_length=10, verbose_name='cycle de facturation'),
        ),
        migrations.AlterField(
            model_name='subscription',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='subscriptions', to=settings.AUTH_USER_MODEL),
        ),
        migrations.CreateModel(
            name='JobBoost',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(choices=[('urgent', 'Urgent'), ('new', 'Nouveau'), ('top', 'Premium')], max_length=10, verbose_name='type')),
                ('amount', models.DecimalField(decimal_places=2, max_digits=10, verbose_name='montant')),
                ('starts_at', models.DateTimeField(default=django.utils.timezone.now, verbose_name='commence le')),
                ('expires_at', models.DateTimeField(verbose_name='expire le')),
                ('is_active', models.BooleanField(default=True, verbose_name='actif')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='créé le')),
                ('job', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='boosts', to='api.job')),
                ('payment', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='job_boosts', to='api.payment')),
            ],
            options={
                'verbose_name': "boost d'annonce",
                'verbose_name_plural': "boosts d'annonces",
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='JobShare',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('share_method', models.CharField(choices=[('email', 'Email'), ('sms', 'SMS'), ('whatsapp', 'WhatsApp'), ('facebook', 'Facebook'), ('twitter', 'Twitter'), ('linkedin', 'LinkedIn'), ('copy', 'Copier le lien'), ('other', 'Autre')], max_length=20, verbose_name='méthode de partage')),
                ('share_to', models.EmailField(blank=True, max_length=254, null=True, verbose_name='partagé à')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='partagé le')),
                ('job', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='shares', to='api.job')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='shares', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': "partage d'emploi",
                'verbose_name_plural': "partages d'emplois",
                'ordering': ['-created_at'],
            },
        ),
        migrations.AddField(
            model_name='subscription',
            name='plan',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='subscriptions', to='api.subscriptionplan'),
        ),
        migrations.CreateModel(
            name='ApplyAiSuggestion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('match_percentage', models.DecimalField(decimal_places=2, max_digits=5, verbose_name='pourcentage de correspondance')),
                ('match_reasons', models.JSONField(default=list, verbose_name='raisons de correspondance')),
                ('status', models.CharField(choices=[('pending', 'En attente'), ('applied', 'Candidature envoyée'), ('rejected', 'Rejeté'), ('saved', 'Sauvegardé')], default='pending', max_length=20, verbose_name='statut')),
                ('applied_date', models.DateTimeField(blank=True, null=True, verbose_name='date de candidature')),
                ('is_viewed', models.BooleanField(default=False, verbose_name='vu')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='créé le')),
                ('job', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='ai_suggestions', to='api.job')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='ai_suggestions', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'suggestion ApplyAI',
                'verbose_name_plural': 'suggestions ApplyAI',
                'ordering': ['-match_percentage'],
                'constraints': [models.UniqueConstraint(fields=('user', 'job'), name='unique_suggestion')],
            },
        ),
        migrations.CreateModel(
            name='UserConnection',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('pending', 'En attente'), ('accepted', 'Acceptée'), ('rejected', 'Refusée')], default='pending', max_length=20, verbose_name='statut')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='créée le')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='mise à jour le')),
                ('connected_to', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='connected_from', to=settings.AUTH_USER_MODEL)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='connections', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'connexion utilisateur',
                'verbose_name_plural': 'connexions utilisateurs',
                'ordering': ['-created_at'],
                'unique_together': {('user', 'connected_to')},
            },
        ),
    ]
