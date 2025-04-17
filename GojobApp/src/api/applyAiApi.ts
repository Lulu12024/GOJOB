// src/api/applyAiApi.ts

import apiClient from './apiClient';
// Définition des types
interface AiSuggestion {
  id: number;
  titre: string;
  entreprise: string;
  location: string;
  logo: string;
  createdAt: string;
  isUrgent: boolean;
  isNew: boolean;
  matchPercentage: number;
  matchReasons: string[];
  applied: boolean;
  appliedDate?: string;
}

interface ApplyResponse {
  jobId: number;
  success: boolean;
  message?: string;
}

interface ConfigData {
  jobPreferences?: string[];
  locationPreferences?: string[];
  skillsHighlight?: string[];
  autoApplyEnabled?: boolean;
  notificationsEnabled?: boolean;
  [key: string]: any;
}


// Les méthodes d'API pour ApplyAI
export const applyAiApi = {
    // Récupérer les suggestions de postes
    getSuggestions: () => {
      return apiClient.get<AiSuggestion[]>('/apply-ai/suggestions');
    },
    
    // Postuler automatiquement à un emploi
    applyToJob: (jobId: number) => {
      return apiClient.post<ApplyResponse>('/apply-ai/apply', { jobId });
    },
    
    // Mettre à jour la configuration ApplyAI
    updateConfig: (configData: ConfigData) => {
      return apiClient.put<ConfigData>('/apply-ai/config', configData);
    },
    
    // Récupérer la configuration actuelle
    getConfig: () => {
      return apiClient.get<ConfigData>('/apply-ai/config');
    },
    
    // Activer/désactiver la candidature automatique
    toggleAutoApply: (enabled: boolean) => {
      return apiClient.patch<{ autoApplyEnabled: boolean }>('/apply-ai/config/auto-apply', { 
        autoApplyEnabled: enabled 
      });
    },
    
    // Récupérer l'historique des candidatures automatiques
    getApplyHistory: () => {
      return apiClient.get<AiSuggestion[]>('/apply-ai/history');
    }
};

export default applyAiApi;