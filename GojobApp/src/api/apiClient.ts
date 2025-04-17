import axios, { AxiosError, AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Remplacez cet import par une configuration directe ou un autre moyen de gérer les variables d'environnement
// import { API_URL } from '@env';

// Définissez votre URL API directement ou utilisez une autre méthode pour les variables d'environnement
// const API_URL = 'https://api.gojobs.com/api/v1'; // Remplacez par votre URL réelle
// const API_URL = 'http://127.0.0.1:8000/v1'
const API_URL = 'http://10.0.2.2:8000/api'
// Clés de stockage
const AUTH_TOKEN_KEY = 'auth_token';

// Interface pour les réponses API standard
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Création de l'instance Axios
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000, // 15 secondes de timeout
});

// Intercepteur pour ajouter le token d'authentification
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du token :', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Fonction pour gérer la déconnexion
export const handleLogout = async () => {
  try {
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    // Vous pouvez ajouter ici une logique supplémentaire comme la redirection vers l'écran de connexion
    // Cela dépend de comment vous gérez la navigation dans votre application
  } catch (error) {
    console.error('Erreur lors de la déconnexion :', error);
  }
};

// Intercepteur pour gérer les erreurs de réponse
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    // Gestion des erreurs 401 (Non autorisé)
    if (error.response?.status === 401) {
      // En React Native, utilisez votre gestionnaire d'état ou événements pour gérer la déconnexion
      await handleLogout();
      // Vous pourriez utiliser ici un système d'événements comme EventEmitter si nécessaire
    }
    
    // Gestion des erreurs 403 (Interdit)
    if (error.response?.status === 403) {
      // Action pour accès non autorisé
      console.error('Accès non autorisé');
    }
    
    // Gestion des erreurs 500 (Erreur serveur)
    if (error.response?.status && error.response.status >= 500) {
      console.error('Erreur serveur', error.response.data);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;