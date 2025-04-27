import apiClient, { ApiResponse } from './apiClient';
import { Utilisateur } from './authApi';

// Define a type for React Native file objects
interface ReactNativeFile {
  uri: string;
  type?: string;
  name?: string;
}

// Types pour les offres d'emploi
export interface Emploi {
  id: number;
  employer: number | Utilisateur;
  title: string;
  description: string;
  category: string;
  subcategory: string | null;
  has_accommodation_pets?: boolean;
  company: string;
  city: string;
  address: string | null;
  salary_type: 'hourly' | 'monthly';
  salary_amount: number | null;
  contract_type: 'CDI' | 'CDD' | 'Freelance' | 'Alternance';
  is_entry_level: boolean;
  experience_years_required: number;
  requires_driving_license: boolean;
  accepts_working_visa: boolean;
  accepts_holiday_visa: boolean;
  accepts_student_visa: boolean;
  has_accommodation: boolean;
  accommodation_accepts_children: boolean;
  accommodation_accepts_dogs: boolean;
  accommodation_is_accessible: boolean;
  job_accepts_handicapped: boolean;
  has_company_car: boolean;
  contact_name: string | null;
  contact_phone: string | null;
  contact_methods: string[];
  website_url: string | null;
  is_urgent: boolean;
  is_new: boolean;
  is_top: boolean;
  status: 'active' | 'closed' | 'draft';
  created_at: string;
  updated_at: string;
  expires_at: string | null;
  views_count: number;
  applications_count: number;
  conversion_rate: number;
  photos: string[];
  logo: string;
  isFavorite?: boolean;
  // Compatibilité frontend (aliases)
  titre?: string;                // Alias pour title
  entreprise?: string;           // Alias pour employer.company_name
  // address?: string;             // Alias pour city
  typeContrat?: string;          // Alias pour contract_type
  salaire?: number;              // Alias pour salary_amount
  typeSalaire?: 'horaire' | 'mensuel'; // Alias pour salary_type
  logement?: boolean;            // Alias pour has_accommodation
  vehicule?: boolean;            // Alias pour has_company_car
  isUrgent?: boolean;            // Alias pour is_urgent
  isNew?: boolean;               // Alias pour is_new
}

export interface RechercheEmploiParams {
  keyword?: string;
  address?: string;
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
  description: string;
  category: string;
  subcategory?: string;
  // city: string;
  company: string;
  address?: string;
  salary_type: 'hourly' | 'monthly'; 
  salary_amount?: number;
  contract_type: 'CDI' | 'CDD' | 'Freelance' | 'Alternance';
  is_entry_level?: boolean;
  experience_years_required?: number;
  requires_driving_license?: boolean;
  accepts_working_visa?: boolean;
  accepts_holiday_visa?: boolean;
  accepts_student_visa?: boolean;
  has_accommodation?: boolean;
  accommodation_accepts_children?: boolean;
  accommodation_accepts_dogs?: boolean;
  accommodation_is_accessible?: boolean;
  job_accepts_handicapped?: boolean;
  has_company_car?: boolean;
  contact_name?: string;
  contact_phone?: string;
  contact_methods: string[];
  website_url?: string;
  is_urgent?: boolean;
  // photos?: Array<string | ReactNativeFile | File>;
  photos?: Array<string | { uri: string; type?: string; name?: string }>;
  user_id: number; 
  expires_at?: string;
  createdAt?: string;
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

// Helper function to check if a value is a React Native file
function isReactNativeFile(value: any): value is ReactNativeFile {
  return value && typeof value === 'object' && 'uri' in value;
}

// Service API pour les offres d'emploi
const jobsApi = {
  /**
   * Récupérer toutes les offres d'emploi avec pagination
   */
  getEmplois: async (page = 1, perPage = 20): Promise<ReponsePaginee<Emploi>> => {
    try {
      const response = await apiClient.get<ApiResponse<ReponsePaginee<Emploi>>>('/jobs/', {
        params: { page, per_page: perPage }
      });
      
      // Normalisation des données pour le frontend
      const emplois = response.data.data.data.map(emploi => normalizeEmploi(emploi));
      
      return {
        data: emplois,
        meta: response.data.data.meta
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des emplois :', error);
      return { data: [], meta: { current_page: 1, last_page: 1, per_page: perPage, total: 0 } };
    }
  },
  
  /**
   * Récupérer une offre d'emploi par son ID
   */
  getEmploi: async (id: number): Promise<Emploi> => {
    try {
      const response = await apiClient.get<ApiResponse<Emploi>>(`/jobs/${id}/`);
      return normalizeEmploi(response.data.data);
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'emploi ${id} :`, error);
      throw error;
    }
  },
  
  /**
   * Rechercher des offres d'emploi
   */
  rechercherEmplois: async (params: RechercheEmploiParams): Promise<ReponsePaginee<Emploi>> => {
    try {
      // Adaptation des paramètres de recherche pour correspondre au backend
      const apiParams = {
        q: params.keyword,
        address: params.address,
        category: params.category,
        contract_type: params.contract_type,
        has_accommodation: params.accommodation,
        salary_min: params.salary_min,
        salary_max: params.salary_max,
        salary_period: params.salary_period,
        page: params.page,
        per_page: params.per_page,
        sort_by: params.sort_by,
        sort_direction: params.sort_direction,
        has_accommodation_children: params.has_accommodation_children,
        has_accommodation_pets: params.has_accommodation_pets,
        has_accommodation_accessible: params.has_accommodation_accessible,
        has_company_car: params.has_company_car,
        max_distance: params.max_distance,
        distance_unit: params.distance_unit,
        for_backpackers: params.for_backpackers,
        visa_type: params.visa_type,
        is_freelance: params.is_freelance
      };
      
      const response = await apiClient.get<ApiResponse<ReponsePaginee<Emploi>>>('/jobs/search', {
        params: apiParams
      });
      
      // Normalisation des données pour le frontend
      const emplois = response.data.data.data.map(emploi => normalizeEmploi(emploi));
      
      return {
        data: emplois,
        meta: response.data.data.meta
      };
    } catch (error) {
      console.error('Erreur lors de la recherche d\'emplois :', error);
      return { data: [], meta: { current_page: 1, last_page: 1, per_page: 20, total: 0 } };
    }
  },
  
  /**
   * Récupérer les offres d'emploi recommandées
   */
  getEmploisRecommandes: async (): Promise<Emploi[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Emploi[]>>('/jobs/recommended');
      return response.data.data.map(emploi => normalizeEmploi(emploi));
    } catch (error) {
      console.error('Erreur lors de la récupération des emplois recommandés :', error);
      return [];
    }
  },
  
  /**
   * Publier une nouvelle offre d'emploi (employeur uniquement)
   */
  // publierEmploi: async (payload: PublicationEmploiPayload): Promise<Emploi> => {
  //   try {
  //     const formData = new FormData();
      
  //     // Conversion des données en FormData pour pouvoir envoyer des fichiers
  //     Object.entries(payload).forEach(([key, value]) => {
  //       if (key === 'photos' && Array.isArray(value)) {
  //         value.forEach((photo, index) => {
  //           if (typeof photo === 'string') {
  //             // C'est une URL
  //             formData.append(`photos[${index}]`, photo);
  //           } else if (photo instanceof File) {
  //             // C'est un fichier File standard
  //             formData.append(`photos[${index}]`, photo);
  //           } else if (isReactNativeFile(photo)) {
  //             // C'est un objet avec uri (format React Native)
  //             // Using type assertion to handle React Native file format
  //             formData.append(`photos[${index}]`, {
  //               uri: photo.uri,
  //               type: photo.type || 'image/jpeg',
  //               name: photo.name || `photo_${index}.jpg`
  //             } as unknown as Blob);
  //           }
  //         });
  //       } else if (typeof value === 'object' && value !== null) {
  //         formData.append(key, JSON.stringify(value));
  //       } else if (value !== undefined) {
  //         formData.append(key, String(value));
  //       }
  //     });
      
  //     const response = await apiClient.post<ApiResponse<Emploi>>('/jobs/', formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });
      
  //     return normalizeEmploi(response.data.data);
  //   } catch (error) {
  //     console.error('Erreur lors de la publication de l\'emploi :', error);
  //     throw error;
  //   }
  // },
  publierEmploi: async (payload: PublicationEmploiPayload): Promise<Emploi> => {
    try {
      const formData = new FormData();
      
      // Conversion des données en FormData pour pouvoir envoyer des fichiers
      Object.entries(payload).forEach(([key, value]) => {
        if (key === 'photos' && Array.isArray(value)) {
          value.forEach((photo, index) => {
            if (typeof photo === 'string') {
              // C'est une URL
              formData.append(`photos`, photo);
            } else if (photo instanceof File) {
              // C'est un fichier File standard
              formData.append(`photos`, photo);
            } else if (isReactNativeFile(photo)) {
              // C'est un objet avec uri (format React Native)
              // Note: pour React Native, nous devons utiliser cette structure spécifique
              formData.append(`photos`, {
                uri: photo.uri,
                type: photo.type || 'image/jpeg',
                name: photo.name || `photo_${index}.jpg`
              } as any);
            }
          });
        } else if (typeof value === 'object' && value !== null) {
          formData.append(key, JSON.stringify(value));
        } else if (value !== undefined) {
          formData.append(key, String(value));
        }
      });
      
      const response = await apiClient.post<ApiResponse<Emploi>>('/jobs/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return normalizeEmploi(response.data.data);
    } catch (error) {
      console.error('Erreur lors de la publication de l\'emploi :', error);
      throw error;
    }
  },
  
  /**
   * Mettre à jour une offre d'emploi (employeur uniquement)
   */
  updateEmploi: async (id: number, payload: Partial<PublicationEmploiPayload>): Promise<Emploi> => {
    try {
      const formData = new FormData();
      
      // Conversion des données en FormData pour pouvoir envoyer des fichiers
      Object.entries(payload).forEach(([key, value]) => {
        if (key === 'photos' && Array.isArray(value)) {
          value.forEach((photo, index) => {
            if (typeof photo === 'string') {
              // C'est une URL
              formData.append(`photos[${index}]`, photo);
            } else if (photo instanceof File) {
              // C'est un fichier File standard
              formData.append(`photos[${index}]`, photo);
            } else if (isReactNativeFile(photo)) {
              // C'est un objet avec uri (format React Native)
              // Using type assertion to handle React Native file format
              formData.append(`photos[${index}]`, {
                uri: photo.uri,
                type: photo.type || 'image/jpeg',
                name: photo.name || `photo_${index}.jpg`
              } as unknown as Blob);
            }
          });
        } else if (typeof value === 'object' && value !== null) {
          formData.append(key, JSON.stringify(value));
        } else if (value !== undefined) {
          formData.append(key, String(value));
        }
      });
      
      const response = await apiClient.put<ApiResponse<Emploi>>(`/jobs/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return normalizeEmploi(response.data.data);
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'emploi ${id} :`, error);
      throw error;
    }
  },
  
  /**
   * Supprimer une offre d'emploi (employeur uniquement)
   */
  supprimerEmploi: async (id: number): Promise<void> => {
    try {
      await apiClient.delete<ApiResponse<null>>(`/jobs/${id}`);
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'emploi ${id} :`, error);
      throw error;
    }
  },
  deleteJob: async (id: number, userId?: number): Promise<void> => {
    try {
      // Ajouter le userId comme paramètre de requête si fourni
      const params = userId ? { user_id: userId } : {};
      console.log(params)
      await apiClient.delete<ApiResponse<null>>(`/jobs/${id}/`, { params });
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'emploi ${id} :`, error);
      throw error;
    }
  },
  
  /**
   * Obtenir les statistiques d'une offre d'emploi (employeur uniquement)
   */
  getStatistiquesEmploi: async (id: number): Promise<any> => {
    try {
      const response = await apiClient.get<ApiResponse<any>>(`/statistics/job/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des statistiques de l'emploi ${id} :`, error);
      throw error;
    }
  },

  /**
   * Marquer une offre d'emploi comme favorite ou retirer des favoris
   */
  toggleFavori: async (id: number): Promise<boolean> => {
    try {
      const response = await apiClient.post<ApiResponse<{ isFavorite: boolean }>>(`/favorites/toggle/${id}`);
      return response.data.data.isFavorite;
    } catch (error) {
      console.error(`Erreur lors du toggle du favori pour l'emploi ${id} :`, error);
      throw error;
    }
  },

  /**
   * Obtenir les offres d'emploi favorites de l'utilisateur
   */
  getFavoris: async (): Promise<Emploi[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Emploi[]>>('/favorites');
      return response.data.data.map(emploi => normalizeEmploi(emploi));
    } catch (error) {
      console.error('Erreur lors de la récupération des favoris :', error);
      return [];
    }
  },
  
  /**
   * Récupérer les offres d'emploi publiées par l'employeur connecté
   */
  getEmployerJobs: async (employerId:number ): Promise<Emploi[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Emploi[]>>('/jobs/employer/?employer_id=' + employerId);
      return response.data.data.map(emploi => normalizeEmploi(emploi));
    } catch (error) {
      console.error('Erreur lors de la récupération des emplois de l\'employeur :', error);
      return [];
    }
  },
  
  /**
   * Supprimer une offre d'emploi (alternative à supprimerEmploi pour compatibilité)
   */
  // deleteJob: async (id: number): Promise<void> => {
  //   return jobsApi.supprimerEmploi(id);
  // },
  
  /**
   * Consulter une offre d'emploi (incrémenter le compteur de vues)
   */
  viewJob: async (id: number): Promise<void> => {
    try {
      await apiClient.post<ApiResponse<null>>(`/jobs/${id}/view`);
    } catch (error) {
      console.error(`Erreur lors de l'enregistrement de la vue pour l'emploi ${id} :`, error);
      // On n'arrête pas l'exécution pour une simple vue non enregistrée
    }
  }
};

/**
 * Fonction utilitaire pour normaliser les données d'emploi provenant de l'API
 * pour les adapter au format attendu par le frontend
 */
function normalizeEmploi(emploi: any): Emploi {
  // Créer des alias pour assurer la compatibilité avec le frontend
  const normalizedEmploi: Emploi = {
    ...emploi,
    titre: emploi.title,
    entreprise: typeof emploi.employer === 'object' ? 
      emploi.employer.company_name : 
      emploi.company || 'Entreprise',
    location: emploi.city,
    typeContrat: emploi.contract_type,
    salaire: emploi.salary_amount,
    typeSalaire: emploi.salary_type === 'hourly' ? 'horaire' : 'mensuel',
    logement: emploi.has_accommodation,
    vehicule: emploi.has_company_car,
    isUrgent: emploi.is_urgent,
    isNew: emploi.is_new
  };
  
  return normalizedEmploi;
}

export default jobsApi;