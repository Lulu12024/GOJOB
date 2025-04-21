from api.models import Job, Application
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import exception_handler

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
