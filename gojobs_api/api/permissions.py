from rest_framework import permissions

class IsEmployer(permissions.BasePermission):
    """
    Permission qui autorise uniquement les employeurs.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'employer'

class IsCandidate(permissions.BasePermission):
    """
    Permission qui autorise uniquement les candidats.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'candidate'

class IsOwner(permissions.BasePermission):
    """
    Permission qui autorise uniquement le propriétaire d'un objet.
    """
    def has_object_permission(self, request, view, obj):
        # Assume que l'objet a un attribut 'user' ou 'owner'
        if hasattr(obj, 'user'):
            return obj.user == request.user
        elif hasattr(obj, 'owner'):
            return obj.owner == request.user
        elif hasattr(obj, 'employer'):
            return obj.employer == request.user
        elif hasattr(obj, 'candidate'):
            return obj.candidate == request.user
        return False

class HasSubscription(permissions.BasePermission):
    """
    Permission qui vérifie si l'utilisateur a un abonnement spécifique.
    """
    def __init__(self, required_plans):
        self.required_plans = required_plans

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        try:
            subscription = request.user.subscription
            return subscription.is_active and subscription.plan_type in self.required_plans
        except:
            return False