import axios, { AxiosError, AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// URL de l'API backend
const API_URL = 'http://10.0.2.2:8000/api'; // Pour Android Emulator
// const API_URL = 'http://localhost:8000/api'; // Pour iOS Simulator

// Clés de stockage
const AUTH_TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';
const REFRESH_TOKEN_KEY = 'refresh_token';

// Interface pour les réponses API standard
export interface ApiResponse<T> {
  status: 'success' | 'error';
  data: T;
  message?: string;
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

// Intercepteur pour traiter les réponses
apiClient.interceptors.response.use(
  (response) => {
    // Si la réponse contient directement les données (ancien format de l'API)
    if (response.data && !response.data.hasOwnProperty('status')) {
      // Normaliser en format standardisé
      const normalizedResponse = {
        status: 'success',
        data: response.data,
        message: null
      };
      response.data = normalizedResponse;
    }
    return response;
  },
  async (error: AxiosError) => {
    // Gestion des erreurs 401 (Non autorisé)
    if (error.response?.status === 401) {
      try {
        // Tentative de rafraîchissement du token
        const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
        if (refreshToken) {
          try {
            const refreshResponse = await axios.post(`${API_URL}/auth/refresh/`, {
              refresh: refreshToken
            });
            
            if (refreshResponse.data && refreshResponse.data.token) {
              // Sauvegarde du nouveau token
              await AsyncStorage.setItem(AUTH_TOKEN_KEY, refreshResponse.data.token);
              
              // Recréer la requête originale avec le nouveau token
              const originalRequest = error.config;
              if (originalRequest && originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.token}`;
                return axios(originalRequest);
              }
            }
          } catch (refreshError) {
            // Si le rafraîchissement échoue, déconnexion
            await handleLogout();
          }
        } else {
          // Pas de refresh token, déconnexion
          await handleLogout();
        }
      } catch (logoutError) {
        console.error('Erreur lors de la gestion d\'authentification:', logoutError);
      }
    }
    
    // Formater la réponse d'erreur dans un format standardisé
    if (error.response && error.response.data) {
      // Si l'erreur n'est pas déjà au format standardisé
      if (!error.response.data.hasOwnProperty('status')) {
        // Utiliser un type plus précis pour error.response.data
        const errorData = error.response.data as any;
        const errorMessage = typeof errorData === 'string' 
          ? errorData 
          : (errorData.message || errorData.detail || 'Une erreur est survenue');
        
        error.response.data = {
          status: 'error',
          data: null,
          message: errorMessage
        };
      }
    }
    
    return Promise.reject(error);
  }
);

// Fonction pour gérer la déconnexion
export const handleLogout = async () => {
  try {
    // Essai d'appel au backend pour déconnexion
    const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
    if (refreshToken) {
      try {
        await apiClient.post('/auth/logout/', { refresh: refreshToken });
      } catch (error) {
        // Ignorer les erreurs d'API lors de la déconnexion
        console.warn('Erreur API lors de la déconnexion:', error);
      }
    }
    
    // Supprimer les données locales
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    await AsyncStorage.removeItem(USER_DATA_KEY);
    await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
    
    // Publier un événement pour informer l'application de la déconnexion
    // Ceci pourrait être fait avec un gestionnaire d'événements ou Redux
  } catch (error) {
    console.error('Erreur lors de la déconnexion :', error);
  }
};

export default apiClient;