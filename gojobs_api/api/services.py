# services.py

from django.utils import timezone
from .models import Notification, User, Job, Application, Message, Contract, Subscription, Payment

def create_notification(user, notification_type, data=None):
    """
    Crée une notification pour un utilisateur
    
    Args:
        user: L'utilisateur destinataire de la notification
        notification_type: Le type de notification (doit être l'un des types définis dans le modèle)
        data: Dictionnaire contenant les données associées à la notification
    
    Returns:
        Notification: L'objet notification créé
    """
    if data is None:
        data = {}
    
    notification = Notification.objects.create(
        user=user,
        type=notification_type,
        data=data
    )
    
    return notification

def notify_new_application(application):
    """Notifie l'employeur d'une nouvelle candidature"""
    employer = application.job.employer
    job = application.job
    candidate = application.candidate
    
    data = {
        'job_id': job.id,
        'job_title': job.title,
        'candidate_id': candidate.id,
        'candidate_name': f"{candidate.first_name} {candidate.last_name}",
        'application_id': application.id,
        'date': application.created_at.isoformat()
    }
    
    return create_notification(employer, 'new_application', data)

def notify_application_status(application):
    """Notifie le candidat d'un changement de statut de sa candidature"""
    candidate = application.candidate
    job = application.job
    
    data = {
        'job_id': job.id,
        'job_title': job.title,
        'employer_id': job.employer.id,
        'employer_name': f"{job.employer.first_name} {job.employer.last_name}",
        'application_id': application.id,
        'status': application.status,
        'date': application.updated_at.isoformat()
    }
    
    return create_notification(candidate, 'application_status', data)

def notify_new_message(message):
    """Notifie le destinataire d'un nouveau message"""
    receiver = message.receiver
    sender = message.sender
    
    data = {
        'message_id': message.id,
        'sender_id': sender.id,
        'sender_name': f"{sender.first_name} {sender.last_name}",
        'content_preview': message.content[:100] + "..." if len(message.content) > 100 else message.content,
        'date': message.created_at.isoformat()
    }
    
    if message.job:
        data['job_id'] = message.job.id
        data['job_title'] = message.job.title
    
    return create_notification(receiver, 'new_message', data)

def notify_flash_job(flash_job, users=None):
    """
    Notifie les utilisateurs d'un nouvel emploi flash
    
    Args:
        flash_job: L'emploi flash à notifier
        users: Liste optionnelle d'utilisateurs à notifier (sinon, notifie les utilisateurs 
               avec des préférences correspondantes)
    """
    job = flash_job.job
    
    if users is None:
        # Filtrer les utilisateurs candidats avec des préférences correspondantes
        users = User.objects.filter(role='candidate')
        
        # TODO: Ajouter une logique plus avancée pour filtrer par préférences,
        # catégorie, localisation, etc.
    
    notifications = []
    for user in users:
        data = {
            'flash_job_id': flash_job.id,
            'job_id': job.id,
            'job_title': job.title,
            'employer_id': job.employer.id,
            'employer_name': f"{job.employer.first_name} {job.employer.last_name}",
            'start_time': flash_job.start_time.isoformat(),
            'location': job.city
        }
        
        notifications.append(create_notification(user, 'flash_job', data))
    
    return notifications

def notify_new_contract(contract):
    """Notifie le candidat d'un nouveau contrat à signer"""
    if not contract.candidate:
        return None
    
    candidate = contract.candidate
    employer = contract.employer
    job = contract.job
    
    data = {
        'contract_id': contract.id,
        'job_id': job.id,
        'job_title': job.title,
        'employer_id': employer.id,
        'employer_name': f"{employer.first_name} {employer.last_name}",
        'date': contract.created_at.isoformat()
    }
    
    return create_notification(candidate, 'new_contract', data)

def notify_signed_contract(contract):
    """Notifie l'employeur qu'un contrat a été signé"""
    employer = contract.employer
    candidate = contract.candidate
    job = contract.job
    
    data = {
        'contract_id': contract.id,
        'job_id': job.id,
        'job_title': job.title,
        'candidate_id': candidate.id,
        'candidate_name': f"{candidate.first_name} {candidate.last_name}",
        'signed_at': contract.signed_at.isoformat()
    }
    
    return create_notification(employer, 'signed_contract', data)

def notify_subscription(subscription):
    """Notifie l'utilisateur d'un nouvel abonnement ou d'un changement d'abonnement"""
    user = subscription.user
    
    data = {
        'subscription_id': subscription.id,
        'plan_type': subscription.plan_type,
        'amount': str(subscription.amount),
        'billing_cycle': subscription.billing_cycle,
        'starts_at': subscription.starts_at.isoformat(),
        'expires_at': subscription.expires_at.isoformat(),
        'auto_renew': subscription.auto_renew
    }
    
    return create_notification(user, 'subscription', data)

def notify_payment(payment):
    """Notifie l'utilisateur d'un paiement effectué ou d'un problème de paiement"""
    user = payment.user
    
    data = {
        'payment_id': payment.id,
        'amount': str(payment.amount),
        'payment_method': payment.payment_method,
        'status': payment.status,
        'payment_date': payment.payment_date.isoformat()
    }
    
    if payment.subscription:
        data['subscription_id'] = payment.subscription.id
        data['subscription_type'] = payment.subscription.plan_type
    
    return create_notification(user, 'payment', data)

def get_job_recommendations(user, limit=20):
    """
    Génère des recommandations d'emplois personnalisées pour un utilisateur
    
    Args:
        user: L'utilisateur pour lequel générer les recommandations
        limit: Nombre maximal de recommandations à générer (défaut: 20)
    
    Returns:
        Liste de tuples (emploi, score de correspondance)
    """
    # Vérifier que l'utilisateur est un candidat
    if user.role != 'candidate':
        return []
    
    # 1. Récupérer les emplois actifs
    active_jobs = Job.objects.filter(status='active')
    
    # 2. Exclure les emplois auxquels l'utilisateur a déjà postulé
    applied_job_ids = Application.objects.filter(candidate=user).values_list('job_id', flat=True)
    jobs = active_jobs.exclude(id__in=applied_job_ids)
    
    # 3. Récupérer les préférences de l'utilisateur
    user_preferences = user.job_preferences or {}
    preferred_categories = user_preferences.get('categories', [])
    preferred_locations = user_preferences.get('locations', [])
    skills = user.skills or []
    
    # 4. Calculer les scores de correspondance
    recommendations = []
    
    for job in jobs:
        score = 0
        
        # Score basé sur la catégorie
        if job.category in preferred_categories:
            score += 30
        
        # Score basé sur la localisation
        if job.city in preferred_locations:
            score += 25
        
        # Score basé sur les compétences requises
        job_requirements = job.requirements or []
        if isinstance(job_requirements, str):
            job_requirements = [job_requirements]
            
        for skill in skills:
            if any(skill.lower() in req.lower() for req in job_requirements):
                score += 15
        
        # Boost pour les emplois urgents ou premium
        if job.is_urgent:
            score += 10
        if job.is_top:
            score += 5
        
        # Boost pour les emplois récents
        days_since_creation = (timezone.now().date() - job.created_at.date()).days
        if days_since_creation < 3:
            score += 15
        elif days_since_creation < 7:
            score += 10
        elif days_since_creation < 14:
            score += 5
        
        # Normaliser le score (0-100)
        score = min(max(score, 0), 100)
        
        # Ajouter à la liste des recommandations si le score est suffisant
        if score > 20:  # Seuil minimal de correspondance
            recommendations.append((job, score))
    
    # 5. Trier par score et limiter le nombre de résultats
    recommendations.sort(key=lambda x: x[1], reverse=True)
    return recommendations[:limit]

def get_similar_jobs(job_id, limit=5):
    """
    Récupère des emplois similaires à un emploi donné
    
    Args:
        job_id: ID de l'emploi à comparer
        limit: Nombre maximal d'emplois similaires à retourner
    
    Returns:
        Liste d'emplois similaires
    """
    try:
        # Récupérer l'emploi de référence
        reference_job = Job.objects.get(id=job_id)
        
        # Récupérer des emplois actifs dans la même catégorie
        similar_jobs = Job.objects.filter(
            status='active',
            category=reference_job.category
        ).exclude(id=job_id)
        
        # Ajouter des critères supplémentaires pour affiner la similarité
        if reference_job.city:
            similar_jobs = similar_jobs.filter(city=reference_job.city) | similar_jobs
        
        if reference_job.contract_type:
            similar_jobs = similar_jobs.filter(contract_type=reference_job.contract_type) | similar_jobs
        
        # Obtenir uniquement les emplois distincts et limiter le nombre de résultats
        similar_jobs = similar_jobs.distinct()[:limit*2]
        
        # Calculer des scores de similarité
        scored_jobs = []
        for job in similar_jobs:
            score = 0
            
            # Score basé sur la catégorie
            if job.category == reference_job.category:
                score += 30
            
            # Score basé sur la localisation
            if job.city == reference_job.city:
                score += 25
            
            # Score basé sur le type de contrat
            if job.contract_type == reference_job.contract_type:
                score += 20
            
            # Score basé sur le salaire
            if (
                reference_job.salary and 
                job.salary and 
                reference_job.salary.get('period') == job.salary.get('period')
            ):
                ref_amount = reference_job.salary.get('amount', 0)
                job_amount = job.salary.get('amount', 0)
                
                # Si les salaires sont proches (±20%)
                if 0.8 * ref_amount <= job_amount <= 1.2 * ref_amount:
                    score += 15
            
            scored_jobs.append((job, score))
        
        # Trier par score et limiter le nombre de résultats
        scored_jobs.sort(key=lambda x: x[1], reverse=True)
        return [job for job, _ in scored_jobs[:limit]]
        
    except Job.DoesNotExist:
        return []