@component('mail::message')
# Réinitialisation de votre mot de passe

Bonjour **{{ $user->name }}**,

Vous avez demandé la réinitialisation de votre mot de passe.  
Utilisez le code suivant pour procéder :

@component('mail::panel')
**{{ $code }}**
@endcomponent

Ce code est valable pendant **10 minutes**.

Si vous n'avez pas demandé de réinitialisation, ignorez cet e-mail.

Merci,  
L'équipe de {{ config('app.name') }}.
@endcomponent
