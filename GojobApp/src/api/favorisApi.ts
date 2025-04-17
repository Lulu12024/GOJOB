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
  getFavorites: async (): Promise<Emploi[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Emploi[]>>('/favorites');
      return response.data.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des favoris :', error);
      return [];
    }
  },
  
  // Ajouter/supprimer un emploi des favoris
  toggleFavorite: async (jobId: number): Promise<boolean> => {
    try {
      const response = await apiClient.post<ApiResponse<ToggleFavoriteResponse>>(`/favorites/toggle/${jobId}`);
      return response.data.data.isFavorite;
    } catch (error) {
      console.error('Erreur lors de la gestion des favoris :', error);
      return false;
    }
  }
};

export default favorisApi;