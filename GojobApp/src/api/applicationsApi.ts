import apiClient, { ApiResponse } from './apiClient';
import { Emploi } from './jobsApi';
import { Utilisateur } from './authApi';

// Types pour les candidatures
export interface Candidature {
  id: number;
  job: Emploi;
  candidate: Utilisateur;
  cv_url?: string;
  motivation_letter_url?: string;
  custom_answers?: Record<string, string>;
  status: 'pending' | 'accepted' | 'rejected' | 'interview';
  is_read: boolean;
  created_at: string;
  updated_at: string;
  
  // Champs adaptés au frontend
  date?: string;
  candidat?: {
    id: number;
    nom: string;
    photo: string;
    email?: string;
    phone?: string;
  };
  cv?: string;
  resume?: string;
}

export interface CandidaturePayload {
  jobId: number;
  coverLetter?: string;
  cv?: any; // FormData file
  lettre?: any; // FormData file
  custom_answers?: Record<string, string>;
}

// API pour les candidatures
const applicationsApi = {
  // Récupérer toutes les candidatures
  getCandidatures: async (): Promise<Candidature[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Candidature[]>>('/applications');
      return response.data.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des candidatures :', error);
      return [];
    }
  },
  
  // Récupérer une candidature spécifique
  getCandidature: async (id: number): Promise<Candidature | null> => {
    try {
      const response = await apiClient.get<ApiResponse<Candidature>>(`/applications/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de la candidature :', error);
      return null;
    }
  },
  
  // Postuler à une offre d'emploi
  postuler: async (jobId: number, coverLetter?: string, cvFile?: any, lettreFile?: any): Promise<boolean> => {
    try {
      const formData = new FormData();
      formData.append('job_id', jobId.toString());
      
      if (coverLetter) {
        formData.append('cover_letter', coverLetter);
      }
      
      if (cvFile) {
        formData.append('cv', {
          uri: cvFile.uri,
          type: cvFile.type || 'application/pdf',
          name: cvFile.name || 'cv.pdf'
        });
      }
      
      if (lettreFile) {
        formData.append('lettre', {
          uri: lettreFile.uri,
          type: lettreFile.type || 'application/pdf',
          name: lettreFile.name || 'lettre.pdf'
        });
      }
      
      await apiClient.post<ApiResponse<Candidature>>('/applications', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la candidature :', error);
      return false;
    }
  },
  
  // Méthode alternative pour créer une candidature (pour compatibilité)
  createApplication: async (data: CandidaturePayload): Promise<boolean> => {
    return applicationsApi.postuler(data.jobId, data.coverLetter, data.cv, data.lettre);
  },
  
  // Mettre à jour le statut d'une candidature (pour les employeurs)
  updateStatus: async (applicationId: number, status: 'pending' | 'accepted' | 'rejected' | 'interview'): Promise<boolean> => {
    try {
      await apiClient.put<ApiResponse<Candidature>>(`/applications/${applicationId}/status`, { status });
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut :', error);
      return false;
    }
  },
  
  // Méthode alternative pour mettre à jour le statut (pour compatibilité)
  updateApplicationStatus: async (id: number, status: string): Promise<boolean> => {
    return applicationsApi.updateStatus(id, status as 'pending' | 'accepted' | 'rejected' | 'interview');
  },
  
  // Supprimer une candidature
  deleteApplication: async (id: number): Promise<boolean> => {
    try {
      await apiClient.delete<ApiResponse<null>>(`/applications/${id}`);
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de la candidature :', error);
      return false;
    }
  },
  
  // Marquer une candidature comme lue (pour les employeurs)
  markAsRead: async (id: number): Promise<boolean> => {
    try {
      await apiClient.put<ApiResponse<Candidature>>(`/applications/${id}/read`, { is_read: true });
      return true;
    } catch (error) {
      console.error('Erreur lors du marquage de la candidature comme lue :', error);
      return false;
    }
  },
  
  // Récupérer les candidatures pour une offre spécifique (pour les employeurs)
  getApplicationsForJob: async (jobId: number): Promise<Candidature[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Candidature[]>>(`/jobs/${jobId}/applications`);
      return response.data.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des candidatures pour l\'offre :', error);
      return [];
    }
  },
  
  // Récupérer les candidatures de l'utilisateur (pour les candidats)
  getUserApplications: async (): Promise<Candidature[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Candidature[]>>('/applications/user');
      return response.data.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des candidatures de l\'utilisateur :', error);
      return [];
    }
  }
};

export default applicationsApi;