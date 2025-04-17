import apiClient, { ApiResponse } from './apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types pour l'authentification
// 
export interface Utilisateur {
    id: number;
    name: string;
    email: string;
    phone?: string;
    telephone?: string; // Ajouté pour compatibilité
    prenom?: string;    // Ajouté pour compatibilité
    nom?: string;       // Ajouté pour compatibilité
    role: 'employer' | 'candidate';
    profile_details?: {
      address?: string;
      adresse?: string;  // Ajouté pour compatibilité
      bio?: string;
      experience?: string;
      skills?: string[];
      avatar?: string;   // Ajouté pour compatibilité
      abonnement?: {     // Ajouté pour compatibilité
        type: string;
        expiration?: string;
      };
    };
    created_at: string;
    updated_at: string;
  }
export interface ConnexionPayload {
  email: string;
  password: string;
}

export interface InscriptionPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: 'employer' | 'candidate';
  phone?: string;
}

export interface ConnexionResponse {
  user: Utilisateur;
  token: string;
}

const AUTH_TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';

// Service d'authentification
const authApi = {
  /**
   * Inscription d'un nouvel utilisateur
   */
  inscription: async (payload: InscriptionPayload): Promise<ConnexionResponse> => {
    const response = await apiClient.post<ApiResponse<ConnexionResponse>>('auth/register', payload);
    
    // Stockage du token et des données utilisateur
    if (response.data.data.token) {
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, response.data.data.token);
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(response.data.data.user));
    }
    
    return response.data.data;
  },
  
  /**
   * Connexion utilisateur
   */
  connexion: async (payload: ConnexionPayload): Promise<ConnexionResponse> => {
    const response = await apiClient.post<ApiResponse<ConnexionResponse>>('auth/login', payload);
    
    // Stockage du token et des données utilisateur
    if (response.data.data.token) {
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, response.data.data.token);
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(response.data.data.user));
    }
    
    return response.data.data;
  },
  
  /**
   * Déconnexion
   */
  deconnexion: async (): Promise<void> => {
    try {
      await apiClient.post('logout');
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
    } finally {
      // Suppression des données locales même en cas d'erreur API
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      await AsyncStorage.removeItem(USER_DATA_KEY);
    }
  },
  
  /**
   * Récupération du profil utilisateur
   */
  getProfil: async (): Promise<Utilisateur> => {
    const response = await apiClient.get<ApiResponse<Utilisateur>>('users/profile');
    return response.data.data;
  },
  
  /**
   * Mise à jour du profil utilisateur
   */
  updateProfil: async (payload: Partial<Utilisateur>): Promise<Utilisateur> => {
    const response = await apiClient.put<ApiResponse<Utilisateur>>('users/profile', payload);
    
    // Mise à jour des données utilisateur stockées
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(response.data.data));
    
    return response.data.data;
  },
  
  /**
   * Mise à jour des détails du profil
   */
  updateDetails: async (payload: any): Promise<Utilisateur> => {
    const response = await apiClient.put<ApiResponse<Utilisateur>>('users/profile/details', payload);
    
    // Mise à jour des données utilisateur stockées
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(response.data.data));
    
    return response.data.data;
  },
  
  /**
   * Vérification si l'utilisateur est authentifié
   */
  isAuthenticated: async (): Promise<boolean> => {
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    return !!token;
  },
  
  /**
   * Récupération des données utilisateur stockées localement
   */
  getUtilisateurStocke: async (): Promise<Utilisateur | null> => {
    const userData = await AsyncStorage.getItem(USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
  }
};

export default authApi;