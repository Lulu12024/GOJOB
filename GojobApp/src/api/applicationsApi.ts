// src/api/applicationsApi.ts
import apiClient from './apiClient';

// Définition des types
export interface Application {
  id: number;
  job_id: number;
  user_id: number;
  status: 'pending' | 'accepted' | 'rejected' | 'interview';
  cover_letter?: string;
  created_at: string;
  updated_at: string;
  // Propriétés nécessaires pour l'affichage
  candidat?: {
    id: number;
    nom: string;
    photo: string;
    email?: string;
    phone?: string;
  };
  date?: string; // Format lisible de created_at
  cv?: string; // URL du CV
  resume?: string; // URL du résumé
  // Autres propriétés selon votre modèle de données
}

// Interface pour la réponse API
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Les méthodes d'API pour les candidatures
export const applicationsApi = {
  // Récupérer toutes les candidatures
  getApplications: () => {
    return apiClient.get<ApiResponse<Application[]>>('/applications');
  },
  
  // Récupérer une candidature spécifique
  getApplication: (id: number) => {
    return apiClient.get<ApiResponse<Application>>(`/applications/${id}`);
  },
  
  // Postuler à une offre d'emploi
  postuler: (jobId: number, coverLetter?: string) => {
    return apiClient.post<ApiResponse<Application>>('/applications', {
      job_id: jobId,
      cover_letter: coverLetter
    });
  },
  
  // Méthode alternative pour créer une candidature (pour compatibilité)
  createApplication: (applicationData: { jobId: number; coverLetter?: string }) => {
    return applicationsApi.postuler(applicationData.jobId, applicationData.coverLetter);
  },
  
  // Mettre à jour le statut d'une candidature (pour les employeurs)
  updateStatus: (applicationId: number, status: 'pending' | 'accepted' | 'rejected' | 'interview') => {
    return apiClient.put<ApiResponse<Application>>(`/applications/${applicationId}/status`, { status });
  },
  
  // Méthode alternative pour mettre à jour le statut (pour compatibilité)
  updateApplicationStatus: (id: number, status: string) => {
    return applicationsApi.updateStatus(id, status as 'pending' | 'accepted' | 'rejected' | 'interview');
  },
  
  // Supprimer une candidature
  deleteApplication: (id: number) => {
    return apiClient.delete<ApiResponse<null>>(`/applications/${id}`);
  },
};

export default applicationsApi;