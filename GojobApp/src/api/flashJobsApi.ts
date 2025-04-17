import apiClient, { ApiResponse } from './apiClient';
import { Emploi, MetadonneesPagination, ReponsePaginee } from './jobsApi';

// Types spécifiques pour les emplois flash
export interface EmploiFlash extends Emploi {
  start_time: string;  // Date et heure de début du job
  end_time?: string;   // Date et heure de fin optionnelle
  is_filled: boolean;  // Si le poste est pourvu
  max_applicants?: number; // Nombre maximum de candidats
  current_applicants: number; // Nombre actuel de candidatures
}

export interface PublicationEmploiFlashPayload {
  title: string;
  company: string;
  location: string;
  description: string;
  start_time: string;
  end_time?: string;
  salary?: {
    amount: number;
    period: 'hour' | 'total';
  };
  photos?: string[];
  requirements?: string[];
  contact_details: {
    name: string;
    phone?: string;
    contact_methods: string[];
  };
  max_applicants?: number;
}

// Service API pour les emplois flash
const flashJobsApi = {
  /**
   * Récupérer tous les emplois flash avec pagination
   */
  getEmploisFlash: async (page = 1, perPage = 20): Promise<ReponsePaginee<EmploiFlash>> => {
    const response = await apiClient.get<ApiResponse<ReponsePaginee<EmploiFlash>>>('flash-jobs', {
      params: { page, per_page: perPage }
    });
    return response.data.data;
  },
  
  /**
   * Récupérer un emploi flash par son ID
   */
  getEmploiFlash: async (id: number): Promise<EmploiFlash> => {
    const response = await apiClient.get<ApiResponse<EmploiFlash>>(`flash-jobs/${id}`);
    return response.data.data;
  },
  
  /**
   * Publier un nouvel emploi flash (employeur uniquement)
   */
  publierEmploiFlash: async (payload: PublicationEmploiFlashPayload): Promise<EmploiFlash> => {
    const formData = new FormData();
    
    // Conversion des données en FormData pour pouvoir envoyer des fichiers
    Object.entries(payload).forEach(([key, value]) => {
      if (key === 'photos' && Array.isArray(value)) {
        value.forEach((photo, index) => {
          formData.append(`photos[${index}]`, photo);
        });
      } else if (typeof value === 'object' && value !== null) {
        formData.append(key, JSON.stringify(value));
      } else if (value !== undefined) {
        formData.append(key, String(value));
      }
    });
    
    const response = await apiClient.post<ApiResponse<EmploiFlash>>('flash-jobs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.data;
  },
  
  /**
   * Mettre à jour un emploi flash (employeur uniquement)
   */
  updateEmploiFlash: async (id: number, payload: Partial<PublicationEmploiFlashPayload>): Promise<EmploiFlash> => {
    const formData = new FormData();
    
    Object.entries(payload).forEach(([key, value]) => {
      if (key === 'photos' && Array.isArray(value)) {
        value.forEach((photo, index) => {
          formData.append(`photos[${index}]`, photo);
        });
      } else if (typeof value === 'object' && value !== null) {
        formData.append(key, JSON.stringify(value));
      } else if (value !== undefined) {
        formData.append(key, String(value));
      }
    });
    
    const response = await apiClient.put<ApiResponse<EmploiFlash>>(`flash-jobs/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.data;
  },
  
  /**
   * Supprimer un emploi flash (employeur uniquement)
   */
  supprimerEmploiFlash: async (id: number): Promise<void> => {
    await apiClient.delete<ApiResponse<null>>(`flash-jobs/${id}`);
  },
  
  /**
   * Postuler à un emploi flash (candidat uniquement)
   */
  postulerEmploiFlash: async (id: number): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post<ApiResponse<{ success: boolean; message: string }>>(`flash-jobs/${id}/apply`);
    return response.data.data;
  },
  
  /**
   * Rechercher des emplois flash par localisation et disponibilité
   */
  rechercherEmploisFlash: async (location?: string, date?: string): Promise<EmploiFlash[]> => {
    const response = await apiClient.get<ApiResponse<EmploiFlash[]>>('flash-jobs', {
      params: {
        location,
        date,
      },
    });
    return response.data.data;
  }
};

export default flashJobsApi;