# core/middleware.py

import json
from django.http import JsonResponse
from django.utils.deprecation import MiddlewareMixin
from rest_framework.response import Response

class APIResponseMiddleware(MiddlewareMixin):
    """
    Middleware pour standardiser les réponses API
    """
    
    def process_response(self, request, response):
        # Ne traiter que les réponses JSON de l'API
        if not request.path_info.startswith('/api/'):
            return response
        
        # Ne pas traiter les réponses déjà formatées ou les réponses de fichiers
        if getattr(response, 'streaming', False) or not hasattr(response, 'content'):
            return response
        
        if 'application/json' not in response.get('Content-Type', ''):
            return response
        
        # Essayer de décoder le contenu JSON
        try:
            content = json.loads(response.content.decode('utf-8'))
            
            # Si le contenu est déjà au format standardisé, ne rien faire
            if isinstance(content, dict) and 'status' in content and 'data' in content:
                return response
            
            # Standardiser la réponse
            standardized_content = {
                'status': 'success' if response.status_code < 400 else 'error',
                'data': content,
                'message': None
            }
            
            response.content = json.dumps(standardized_content).encode('utf-8')
            return response
        except (json.JSONDecodeError, UnicodeDecodeError):
            # Si le contenu n'est pas du JSON valide, ne pas le modifier
            return response