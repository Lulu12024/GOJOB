export const getErrorMessage = (errorCode: string): string => {
    const errorMessages: Record<string, string> = {
      'invalid_credentials': 'Adresse e-mail ou mot de passe incorrect',
      'email_exists': 'Cette adresse e-mail est déjà utilisée',
      'password_mismatch': 'Les mots de passe ne correspondent pas',
      'weak_password': 'Le mot de passe est trop faible, utilisez au moins 8 caractères',
      'invalid_email': 'Adresse e-mail invalide',
      'unauthorized': 'Vous n\'êtes pas autorisé à effectuer cette action',
      'not_found': 'Ressource introuvable',
      'server_error': 'Une erreur serveur est survenue, veuillez réessayer plus tard',
      'network_error': 'Problème de connexion, vérifiez votre réseau',
    };
    
    return errorMessages[errorCode] || 'Une erreur est survenue';
  };