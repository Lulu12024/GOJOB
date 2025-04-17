// src/api/favorisApi.ts
import apiClient from './apiClient';

// Types pour les favoris
export interface Emploi {
  id: number;
  titre: string;
  entreprise: string;
  location: string;
  logo?: string;
  createdAt: string;
  isUrgent?: boolean;
  isNew?: boolean;
  isFavorite?: boolean;
  // Autres propriétés d'un emploi
}

interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

interface ToggleFavoriteResponse {
  isFavorite: boolean;
  message?: string;
}

// API pour les favoris
const favorisApi = {
  // Récupérer tous les favoris de l'utilisateur
  getFavorites: async () => {
    const response = await apiClient.get<ApiResponse<Emploi[]>>('/favorites');
    return response.data;
  },
  
  // Ajouter/supprimer un emploi des favoris
  toggleFavorite: async (jobId: number) => {
    const response = await apiClient.post<ApiResponse<ToggleFavoriteResponse>>(`/favorites/toggle/${jobId}`);
    return response.data;
  }
};

export default favorisApi;