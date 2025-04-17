# Guide d'installation et de configuration pour GoJobs API

Ce guide vous aidera à installer et configurer l'API Laravel pour votre application GoJobs.

## Prérequis

- PHP 8.1 ou supérieur
- Composer
- MySQL ou PostgreSQL
- Serveur Web (Apache ou Nginx)
- Node.js et NPM (pour la partie front-end React Native)

## Installation

### 1. Créer un nouveau projet Laravel

```bash
composer create-project laravel/laravel gojobs-api
cd gojobs-api
```

### 2. Configurer la base de données

Modifiez le fichier `.env` pour configurer la connexion à votre base de données :

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=gojobs
DB_USERNAME=root
DB_PASSWORD=
```

### 3. Installer les dépendances nécessaires

```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

### 4. Créer les modèles, migrations et contrôleurs

Suivez la structure de code fournie pour créer tous les fichiers nécessaires :

1. Créez les fichiers de modèles dans `app/Models/`
2. Créez les fichiers de migration dans `database/migrations/`
3. Créez les contrôleurs dans `app/Http/Controllers/API/`
4. Créez les services dans `app/Services/`
5. Créez les middlewares dans `app/Http/Middleware/`
6. Créez les requêtes de validation dans `app/Http/Requests/`

### 5. Configurer le Kernel pour les middlewares personnalisés

Mettez à jour le fichier `app/Http/Kernel.php` avec les middlewares personnalisés comme indiqué dans le code fourni.

### 6. Configurer le service provider

Mettez à jour le fichier `app/Providers/AppServiceProvider.php` pour enregistrer les services personnalisés.

### 7. Configurer les routes API

Mettez à jour le fichier `routes/api.php` avec les routes fournies.

### 8. Migrer la base de données

```bash
php artisan migrate:fresh
```

### 9. Configurer le stockage pour les fichiers

```bash
php artisan storage:link
```

### 10. Générer la clé d'application

```bash
php artisan key:generate
```

## Structure des dossiers

Assurez-vous que votre projet respecte la structure suivante :

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── API/
│   │   │   ├── AuthController.php
│   │   │   ├── JobController.php
│   │   │   ├── ApplicationController.php
│   │   │   ├── ...
│   ├── Middleware/
│   │   ├── CheckSubscription.php
│   │   └── CheckUserRole.php
│   ├── Requests/
│   │   ├── JobRequest.php
│   │   ├── ApplicationRequest.php
│   │   └── ...
│   └── Resources/
│       ├── JobResource.php
│       ├── UserResource.php
│       └── ...
├── Models/
│   ├── User.php
│   ├── Job.php
│   ├── Application.php
│   ├── ...
├── Services/
│   ├── PaymentService.php
│   ├── NotificationService.php
│   ├── ...
└── ...
```

## Configuration CORS pour React Native

Pour permettre à votre application React Native de communiquer avec l'API, configurez CORS dans le fichier `config/cors.php` :

```php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['*'], // En production, spécifiez les origines autorisées
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
```

## Lancer le serveur

```bash
php artisan serve
```

Votre API sera accessible à l'adresse `http://localhost:8000/api/v1/`.

## Sécurité et déploiement en production

Avant de déployer en production, assurez-vous de :

1. Configurer correctement les variables d'environnement dans le fichier `.env`
2. Limiter les origines CORS autorisées
3. Configurer SSL/TLS pour les connexions sécurisées
4. Mettre en place un système de journalisation pour suivre les erreurs
5. Configurer les sauvegardes régulières de la base de données

## Intégration avec React Native

Pour intégrer cette API avec votre front-end React Native, vous devrez configurer un client HTTP comme Axios :

```javascript
// api.js
import axios from 'axios';

const API_URL = 'https://votre-api.com/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
```

## Documentation API

Une fois l'API déployée, vous pouvez générer une documentation avec des outils comme Swagger ou Scribe pour Laravel.

```bash
composer require knuckleswtf/scribe
php artisan vendor:publish --tag=scribe-config
php artisan scribe:generate
```

La documentation sera disponible à l'adresse `/docs`.