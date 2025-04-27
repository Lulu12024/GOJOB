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
  userId?: number; // ID de l'utilisateur candidat
  coverLetter?: string;
  cv?: any; // FormData file
  lettre?: any; // FormData file
  custom_answers?: Record<string, string>;
}

// API pour les candidatures
const applicationsApi = {
  // Récupérer toutes les candidatures
  getCandidatures: async (employerId: number): Promise<Candidature[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Candidature[]>>(`/applications/employer/${employerId}/`);
      console.log(response.data.data)
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
  // postuler: async (jobId: number, coverLetter?: string, cvFile?: any, lettreFile?: any): Promise<boolean> => {
  //   try {
  //     const formData = new FormData();
  //     formData.append('job_id', jobId.toString());
      
  //     // Ajouter le CV
  //     if (cvFile) {
  //       const cvFileData = {
  //         uri: cvFile.uri,
  //         type: cvFile.type || 'application/pdf',
  //         name: cvFile.name || 'cv.pdf'
  //       };
  //       formData.append('cv', cvFileData);
  //     }
      
  //     // Ajouter la lettre de motivation si disponible
  //     if (lettreFile) {
  //       const lettreFileData = {
  //         uri: lettreFile.uri,
  //         type: lettreFile.type || 'application/pdf',
  //         name: lettreFile.name || 'lettre.pdf'
  //       };
  //       formData.append('lettre', lettreFileData);
  //     }

  //     // Ajouter la lettre de motivation textuelle si fournie
  //     if (coverLetter) {
  //       formData.append('cover_letter', coverLetter);
  //     }
      
  //     const response = await apiClient.post<ApiResponse<Candidature>>('/applications', formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });
      
  //     return true;
  //   } catch (error) {
  //     console.error('Erreur lors de la candidature :', error);
  //     throw error; // Relancer l'erreur pour permettre de la traiter dans le composant
  //   }
  // },

  postuler: async (jobId: number, candidateId: number, coverLetter?: string, cvFile?: any, lettreFile?: any): Promise<boolean> => {
    try {
      const formData = new FormData();
      formData.append('job_id', jobId.toString());
      formData.append('user_id', candidateId.toString());  // Ajouter l'ID du candidat
      
      if (coverLetter) {
        formData.append('cover_letter', coverLetter);
      }
      
      if (cvFile) {
        formData.append('cv', cvFile as any);
      }
      
      if (lettreFile) {
        formData.append('lettre', lettreFile as any);
      }
      
      await apiClient.post<ApiResponse<Candidature>>('/applications/', formData, {
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
    try {
      const formData = new FormData();
      formData.append('job_id', data.jobId.toString());
      
      // Ajouter l'ID de l'utilisateur si fourni
      if (data.userId) {
        formData.append('user_id', data.userId.toString());
      }
      
      // Ajouter le CV
      if (data.cv) {
        formData.append('cv', data.cv);
      }
      
      // Ajouter la lettre de motivation si disponible
      if (data.lettre) {
        formData.append('lettre', data.lettre);
      }
      
      // Ajouter la lettre de motivation textuelle si fournie
      if (data.coverLetter) {
        formData.append('cover_letter', data.coverLetter);
      }
      
      // Ajouter des réponses personnalisées si présentes
      if (data.custom_answers) {
        for (const [key, value] of Object.entries(data.custom_answers)) {
          formData.append(`question_${key}`, value);
        }
      }
      
      const response = await apiClient.post<ApiResponse<Candidature>>('/applications', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la création de la candidature :', error);
      throw error; // Relancer l'erreur pour permettre de la traiter dans le composant
    }
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