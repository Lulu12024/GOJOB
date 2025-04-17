import apiClient, { ApiResponse } from './apiClient';

// Types pour les offres d'emploi
export interface Emploi {
  id: number;
  title: string;
  company: string;
  location: string;
  description: string;
  salary?: {
    amount: number;
    period: 'hour' | 'month';
  };
  contract_type?: 'CDI' | 'CDD' | 'alternance' | 'freelance';
  accommodation?: boolean;
  accommodation_details?: {
    children_allowed?: boolean;
    pets_allowed?: boolean;
    accessible?: boolean;
  };
  photos?: string[];
  requirements?: string[];
  created_at: string;
  updated_at: string;
  expiry_date?: string;
  tags?: string[];
  is_urgent?: boolean;
  is_new?: boolean;
  is_top?: boolean;
  views_count?: number;
  applications_count?: number;
  conversion_rate?: number;
  user_id: number;
}

export interface RechercheEmploiParams {
  keyword?: string;
  location?: string;
  category?: string;
  contract_type?: string;
  accommodation?: boolean;
  salary_min?: number;
  salary_max?: number;
  salary_period?: 'hour' | 'month';
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
  has_accommodation_children?: boolean;
  has_accommodation_pets?: boolean;
  has_accommodation_accessible?: boolean;
  has_company_car?: boolean;
  max_distance?: number;
  distance_unit?: 'km' | 'mi';
  for_backpackers?: boolean;
  visa_type?: 'work' | 'seasonal';
  is_freelance?: boolean;
}

export interface PublicationEmploiPayload {
  title: string;
  company: string;
  location: string;
  description: string;
  salary?: {
    amount: number;
    period: 'hour' | 'month';
  };
  contract_type?: 'CDI' | 'CDD' | 'alternance' | 'freelance';
  accommodation?: boolean;
  accommodation_details?: {
    children_allowed?: boolean;
    pets_allowed?: boolean;
    accessible?: boolean;
  };
  photos?: string[];
  requirements?: string[];
  expiry_date?: string;
  tags?: string[];
  is_urgent?: boolean;
  contact_details: {
    name: string;
    phone?: string;
    contact_methods: string[];
  };
  working_rights?: {
    entry_level?: boolean;
    working_visa?: boolean;
    holiday_visa?: boolean;
    student_visa?: boolean;
  };
}

export interface MetadonneesPagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ReponsePaginee<T> {
  data: T[];
  meta: MetadonneesPagination;
}

// Service API pour les offres d'emploi
const jobsApi = {
  /**
   * Récupérer toutes les offres d'emploi avec pagination
   */
  getEmplois: async (page = 1, perPage = 20): Promise<ReponsePaginee<Emploi>> => {
    const response = await apiClient.get<ApiResponse<ReponsePaginee<Emploi>>>('jobs', {
      params: { page, per_page: perPage }
    });
    return response.data.data;
  },
  
  /**
   * Récupérer une offre d'emploi par son ID
   */
  getEmploi: async (id: number): Promise<Emploi> => {
    const response = await apiClient.get<ApiResponse<Emploi>>(`jobs/${id}`);
    return response.data.data;
  },
  
  /**
   * Rechercher des offres d'emploi
   */
  rechercherEmplois: async (params: RechercheEmploiParams): Promise<ReponsePaginee<Emploi>> => {
    const response = await apiClient.get<ApiResponse<ReponsePaginee<Emploi>>>('jobs/search', {
      params: params
    });
    return response.data.data;
  },
  
  /**
   * Récupérer les offres d'emploi recommandées
   */
  getEmploisRecommandes: async (): Promise<Emploi[]> => {
    const response = await apiClient.get<ApiResponse<Emploi[]>>('jobs/recommended');
    return response.data.data;
  },
  
  /**
   * Publier une nouvelle offre d'emploi (employeur uniquement)
   */
  publierEmploi: async (payload: PublicationEmploiPayload): Promise<Emploi> => {
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
    
    const response = await apiClient.post<ApiResponse<Emploi>>('jobs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.data;
  },
  
  /**
   * Mettre à jour une offre d'emploi (employeur uniquement)
   */
  updateEmploi: async (id: number, payload: Partial<PublicationEmploiPayload>): Promise<Emploi> => {
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
    
    const response = await apiClient.put<ApiResponse<Emploi>>(`jobs/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.data;
  },
  
  /**
   * Supprimer une offre d'emploi (employeur uniquement)
   */
  supprimerEmploi: async (id: number): Promise<void> => {
    await apiClient.delete<ApiResponse<null>>(`jobs/${id}`);
  },
  
  /**
   * Obtenir les statistiques d'une offre d'emploi (employeur uniquement)
   */
  getStatistiquesEmploi: async (id: number): Promise<any> => {
    const response = await apiClient.get<ApiResponse<any>>(`statistics/job/${id}`);
    return response.data.data;
  },

  /**
   * Marquer une offre d'emploi comme favorite ou retirer des favoris
   */
  toggleFavori: async (id: number): Promise<{ is_favorite: boolean }> => {
    const response = await apiClient.post<ApiResponse<{ is_favorite: boolean }>>(`favorites/toggle/${id}`);
    return response.data.data;
  },

  /**
   * Obtenir les offres d'emploi favorites de l'utilisateur
   */
  getFavoris: async (): Promise<Emploi[]> => {
    const response = await apiClient.get<ApiResponse<Emploi[]>>('favorites');
    return response.data.data;
  },
  
  /**
   * Récupérer les offres d'emploi publiées par l'employeur connecté
   */
  getEmployerJobs: async (): Promise<Emploi[]> => {
    const response = await apiClient.get<ApiResponse<Emploi[]>>('jobs/employer');
    return response.data.data;
  },
  
  /**
   * Supprimer une offre d'emploi (alternative à supprimerEmploi pour compatibilité)
   */
  deleteJob: async (id: number): Promise<void> => {
    return jobsApi.supprimerEmploi(id);
  }
}

export default jobsApi;