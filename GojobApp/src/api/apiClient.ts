// Modifier GojobApp/src/api/apiClient.ts

import axios, { AxiosError, AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Définissez votre URL API directement
const API_URL = 'http://10.0.2.2:8000/api'; // Pour Android Emulator
// const API_URL = 'http://localhost:8000/api'; // Pour iOS Simulator

// Clés de stockage
const AUTH_TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';

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
      await handleLogout();
      // Si vous avez un système de navigation global, vous pourriez rediriger ici
    }
    
    // Formater la réponse d'erreur dans un format standardisé
    if (error.response && error.response.data) {
      // Si l'erreur n'est pas déjà au format standardisé
      if (!error.response.data.hasOwnProperty('status')) {
        const errorMessage = typeof error.response.data === 'string' 
          ? error.response.data 
          : (error.response.data.message || error.response.data.detail || 'Une erreur est survenue');
        
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
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    await AsyncStorage.removeItem(USER_DATA_KEY);
    // Vous pouvez ajouter ici d'autres actions comme rediriger vers l'écran de connexion
  } catch (error) {
    console.error('Erreur lors de la déconnexion :', error);
  }
};

export default apiClient;