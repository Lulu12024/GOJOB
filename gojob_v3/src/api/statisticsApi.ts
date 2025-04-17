// src/api/statisticsApi.ts
import apiClient from './apiClient';

// Types pour les statistiques
interface DashboardData {
  totalApplications: number;
  totalViews: number;
  cvRate: number;
  activeJobs: number;
  viewsData: {
    labels: string[];
    values: number[];
  };
  applicationData: {
    labels: string[];
    values: number[];
  };
  activeJobsData: Array<{
    id: number;
    title: string;
    views: number;
    cvCount: number;
    cvRate: number;
  }>;
}

interface JobStats {
  views: number;
  applications: number;
  conversionRate: number;
  dailyStats: {
    labels: string[];
    views: number[];
    applications: number[];
  };
  // Autres statistiques spécifiques à un emploi
}

// API pour les statistiques
export const statisticsApi = {
  // Récupérer les statistiques du tableau de bord de l'employeur
  getEmployerDashboard: async () => {
    const response = await apiClient.get<{ data: DashboardData }>('/statistics/dashboard');
    return response.data;
  },
  
  // Récupérer les statistiques d'un emploi spécifique
  getJobStats: async (jobId: number) => {
    const response = await apiClient.get<{ data: JobStats }>(`/statistics/job/${jobId}`);
    return response.data;
  }
};

export default statisticsApi;