import apiClient, { ApiResponse } from './apiClient';
import { Emploi } from './jobsApi';

// Types pour ApplyAI
export interface ConfigurationApplyAI {
  id: number;
  categories: string[];
  salary_range: {
    min: number;
    max: number;
    period: 'hour' | 'month';
  };
  filters: {
    accommodation?: boolean;
    children_friendly?: boolean;
    pets_friendly?: boolean;
    accessible?: boolean;
    company_car?: boolean;
    max_distance?: number;
  };
  excluded_companies: string[];
  notification_time: string; // Format 'HH:MM'
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface SuggestionEmploi {
  job: Emploi;
  match_percentage: number;
  reasons: string[];
}

export interface ApplyAIConfigPayload {
  categories: string[];
  salary_range: {
    min: number;
    max: number;
    period: 'hour' | 'month';
  };
  filters?: {
    accommodation?: boolean;
    children_friendly?: boolean;
    pets_friendly?: boolean;
    accessible?: boolean;
    company_car?: boolean;
    max_distance?: number;
  };
  excluded_companies?: string[];
  notification_time: string; // Format 'HH:MM'
}

// Service API pour ApplyAI
const applyAiApi = {
  /**
   * Récupérer la configuration ApplyAI de l'utilisateur
   */
  getConfiguration: async (): Promise<ConfigurationApplyAI> => {
    const response = await apiClient.get<ApiResponse<ConfigurationApplyAI>>('apply-ai');
    return response.data.data;
  },
  
  /**
   * Créer ou mettre à jour la configuration ApplyAI (candidat avec abonnement uniquement)
   */
  saveConfiguration: async (config: ApplyAIConfigPayload): Promise<ConfigurationApplyAI> => {
    const response = await apiClient.post<ApiResponse<ConfigurationApplyAI>>('apply-ai', config);
    return response.data.data;
  },
  
  /**
   * Mettre à jour la configuration ApplyAI
   */
  updateConfiguration: async (id: number, config: Partial<ApplyAIConfigPayload>): Promise<ConfigurationApplyAI> => {
    const response = await apiClient.put<ApiResponse<ConfigurationApplyAI>>(`apply-ai/${id}`, config);
    return response.data.data;
  },
  
  /**
   * Supprimer la configuration ApplyAI
   */
  deleteConfiguration: async (id: number): Promise<void> => {
    await apiClient.delete<ApiResponse<null>>(`apply-ai/${id}`);
  },
  
  /**
   * Récupérer les suggestions d'emploi générées par ApplyAI
   */
  getSuggestions: async (): Promise<SuggestionEmploi[]> => {
    const response = await apiClient.get<ApiResponse<SuggestionEmploi[]>>('apply-ai/suggestions');
    return response.data.data;
  },
  
  /**
   * Postuler automatiquement à une offre d'emploi via ApplyAI
   */
  postulerAutomatic: async (jobId: number): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post<ApiResponse<{ success: boolean; message: string }>>(`apply-ai/apply/${jobId}`);
    return response.data.data;
  },
  
  /**
   * Vérifier si l'utilisateur a un abonnement ApplyAI actif
   */
  verifierAbonnement: async (): Promise<{ has_subscription: boolean; subscription_type?: string }> => {
    try {
      const response = await apiClient.get<ApiResponse<{ has_subscription: boolean; subscription_type?: string }>>('apply-ai');
      return response.data.data;
    } catch (error) {
      // Si une erreur 403 est retournée, l'utilisateur n'a pas d'abonnement
      return { has_subscription: false };
    }
  }
};

export default applyAiApi;