import apiClient, { ApiResponse } from './apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types pour l'authentification
// Harmonisation de l'interface Utilisateur pour correspondre au modèle Django User
export interface Utilisateur {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: 'employer' | 'candidate' | 'admin';
  phone: string | null;
  profile_image: string | null;
  bio: string | null;
  address: string | null;
  city: string | null;
  is_handicapped: boolean;
  has_driving_license: boolean;
  has_vehicle: boolean;
  member_since: number | null;
  
  // Champs spécifiques aux candidats
  skills: any[] | null;
  experience: any | null;
  education: any | null;
  languages: any | null;
  job_preferences: any | null;
  
  // Champs spécifiques aux employeurs
  company_name: string | null;
  company_description: string | null;
  company_website: string | null;
  company_size: string | null;
  company_industry: string | null;
  
  // Compatibilité frontend (aliases)
  nom?: string;        // Alias pour last_name
  prenom?: string;     // Alias pour first_name
  telephone?: string;  // Alias pour phone
  
  // Méthodes utilitaires
  hasSubscription?: (type: string) => boolean;
}
export interface ConnexionPayload {
  email: string;
  password: string;
}

export interface InscriptionPayload {
  email: string;
  password: string;
  password_confirmation: string;
  first_name?: string;
  last_name?: string;
  role: 'employer' | 'candidate';
  phone?: string;
}

export interface AuthResponse {
  user: Utilisateur;
  token: string;
  refresh?: string;
}

export interface ResetPasswordPayload {
  email: string;
}

// Clés de stockage
const AUTH_TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';
const REFRESH_TOKEN_KEY = 'refresh_token';

// Service d'authentification
const authApi = {
  /**
   * Inscription d'un nouvel utilisateur
   */
  inscription: async (payload: InscriptionPayload): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>('auth/register', payload);
      
      // Stockage des tokens et données utilisateur
      if (response.data.data.token) {
        await AsyncStorage.setItem(AUTH_TOKEN_KEY, response.data.data.token);
        await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(response.data.data.user));
        if (response.data.data.refresh) {
          await AsyncStorage.setItem(REFRESH_TOKEN_KEY, response.data.data.refresh);
        }
      }
      
      return response.data.data;
    } catch (error: any) {
      console.error('Erreur lors de l\'inscription:', error);
      throw error.response?.data?.message || 'Erreur lors de l\'inscription';
    }
  },
  
  /**
   * Connexion utilisateur
   */
  connexion: async (payload: ConnexionPayload): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>('auth/login', payload);
      
      // Stockage des tokens et données utilisateur
      if (response.data.data.token) {
        await AsyncStorage.setItem(AUTH_TOKEN_KEY, response.data.data.token);
        await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(response.data.data.user));
        if (response.data.data.refresh) {
          await AsyncStorage.setItem(REFRESH_TOKEN_KEY, response.data.data.refresh);
        }
      }
      
      // Ajouter la méthode utilitaire hasSubscription à l'objet utilisateur
      const user = response.data.data.user;
      user.hasSubscription = (type: string) => {
        // Logique réelle à implémenter en fonction de votre modèle de données
        if (!user.job_preferences) return false;
        const subscription = user.job_preferences.subscription;
        return subscription && subscription.type === type && subscription.isActive;
      };
      
      return response.data.data;
    } catch (error: any) {
      console.error('Erreur lors de la connexion:', error);
      throw error.response?.data?.message || 'Identifiants invalides';
    }
  },
  
  /**
   * Rafraîchir le token d'authentification
   */
  refreshToken: async (): Promise<string | null> => {
    try {
      const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
      
      if (!refreshToken) {
        return null;
      }
      
      const response = await apiClient.post<ApiResponse<{ token: string, refresh?: string }>>('auth/refresh', {
        refresh: refreshToken
      });
      
      if (response.data.data.token) {
        await AsyncStorage.setItem(AUTH_TOKEN_KEY, response.data.data.token);
        
        if (response.data.data.refresh) {
          await AsyncStorage.setItem(REFRESH_TOKEN_KEY, response.data.data.refresh);
        }
        
        return response.data.data.token;
      }
      
      return null;
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du token:', error);
      return null;
    }
  },
  
  /**
   * Déconnexion
   */
  deconnexion: async (): Promise<void> => {
    try {
      const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
      
      if (refreshToken) {
        await apiClient.post('auth/logout', { refresh: refreshToken });
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      // Suppression des données locales même en cas d'erreur API
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      await AsyncStorage.removeItem(USER_DATA_KEY);
      await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  },
  
  /**
   * Récupération du profil utilisateur
   */
  getProfil: async (): Promise<Utilisateur> => {
    try {
      const response = await apiClient.get<ApiResponse<Utilisateur>>('users/profile');
      
      // Mettre à jour les données stockées
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(response.data.data));
      
      return response.data.data;
    } catch (error: any) {
      console.error('Erreur lors de la récupération du profil:', error);
      throw error.response?.data?.message || 'Impossible de récupérer le profil';
    }
  },
  
  /**
   * Mise à jour du profil utilisateur
   */
  updateProfil: async (payload: Partial<Utilisateur>): Promise<Utilisateur> => {
    try {
      const response = await apiClient.put<ApiResponse<Utilisateur>>('users/profile', payload);
      
      // Mise à jour des données utilisateur stockées
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(response.data.data));
      
      return response.data.data;
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      throw error.response?.data?.message || 'Impossible de mettre à jour le profil';
    }
  },
  
  /**
   * Mise à jour des détails du profil (upload d'image, etc.)
   */
  updateProfileDetails: async (formData: FormData): Promise<Utilisateur> => {
    try {
      const response = await apiClient.put<ApiResponse<Utilisateur>>('users/profile/details', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Mise à jour des données utilisateur stockées
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(response.data.data));
      
      return response.data.data;
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour des détails du profil:', error);
      throw error.response?.data?.message || 'Impossible de mettre à jour les détails du profil';
    }
  },
  
  /**
   * Demande de réinitialisation de mot de passe
   */
  resetPassword: async (email: string): Promise<boolean> => {
    try {
      await apiClient.post<ApiResponse<{ success: boolean }>>('auth/reset-password', { email });
      return true;
    } catch (error) {
      console.error('Erreur lors de la demande de réinitialisation de mot de passe:', error);
      return false;
    }
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
  getStoredUser: async (): Promise<Utilisateur | null> => {
    try {
      const userData = await AsyncStorage.getItem(USER_DATA_KEY);
      
      if (!userData) {
        return null;
      }
      
      const user = JSON.parse(userData) as Utilisateur;
      
      // Ajouter la méthode utilitaire hasSubscription à l'objet utilisateur
      user.hasSubscription = (type: string) => {
        // Logique réelle à implémenter en fonction de votre modèle de données
        if (!user.job_preferences) return false;
        const subscription = user.job_preferences.subscription;
        return subscription && subscription.type === type && subscription.isActive;
      };
      
      return user;
    } catch (error) {
      console.error('Erreur lors de la récupération des données utilisateur stockées:', error);
      return null;
    }
  },
  
  /**
   * Vérification de l'authentification et mise à jour du profil si nécessaire
   */
  verifierAuthentification: async (): Promise<Utilisateur | null> => {
    try {
      if (await authApi.isAuthenticated()) {
        // Récupérer les données locales
        const userStored = await authApi.getStoredUser();
        
        if (userStored) {
          // Essayer de rafraîchir les données depuis le serveur
          try {
            return await authApi.getProfil();
          } catch (error) {
            // En cas d'erreur, retourner les données stockées
            return userStored;
          }
        }
      }
      
      return null;
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'authentification:', error);
      return null;
    }
  }
};

export default authApi;