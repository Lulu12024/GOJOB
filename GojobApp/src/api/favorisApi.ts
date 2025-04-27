import apiClient, { ApiResponse } from './apiClient';
import { Emploi } from './jobsApi';

// Interface pour la réponse du toggle favori
interface ToggleFavoriteResponse {
  isFavorite: boolean;
  message?: string;
}

// API pour les favoris
const favorisApi = {
  // Récupérer tous les favoris de l'utilisateur
  getFavorites: async (userId: number): Promise<Emploi[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Emploi[]>>(`/favorites/user/${userId}/`);
      return response.data.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des favoris :', error);
      return [];
    }
  },

  // getFavorites: async (userId: number): Promise<Emploi[]> => {
  //   try {
  //     const response = await apiClient.get<ApiResponse<Emploi[]>>(`/favorites/user/${userId}/`);
  //     return response.data.data.map(emploi => normalizeEmploi(emploi));
  //   } catch (error) {
  //     console.error(`Erreur lors de la récupération des favoris pour l'utilisateur ${userId} :`, error);
  //     return [];
  //   }
  // }
  
  // Ajouter/supprimer un emploi des favoris
  
  toggleFavorite: async (jobId: number, userId: number): Promise<boolean> => {
    try {
      const response = await apiClient.post<ApiResponse<{ isFavorite: boolean }>>(`/favorites/toggle/${jobId}/${userId}/`);
      return response.data.data.isFavorite;
    } catch (error) {
      console.error(`Erreur lors du toggle du favori pour l'emploi ${jobId} :`, error);
      throw error;
    }
  }
};

export default favorisApi;