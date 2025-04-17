// Types pour la navigation
import { Emploi } from '../api/jobsApi';
import { EmploiFlash } from '../api/flashJobsApi';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
// Types pour la navigation d'authentification
export type AuthNavigatorParamList = {
  Bienvenue: undefined;
  Connexion: undefined;
  Inscription: undefined;
  MotDePasseOublie: undefined;
};

// Types pour la navigation d'accueil
export type AccueilNavigatorParamList = {
  ListeEmplois: undefined;
  Accueil: undefined;
  Recherche: { keyword?: string; location?: string };
  ResultatsRecherche: { params: any };
  DetailEmploi: { id?: number; emploi?: Emploi };
  FiltrageRecherche: { 
    filtres: any; 
    onApply: (nouveauxFiltres: any) => void;
  };
  PublierEmploi: undefined;
};

// Types pour la navigation des candidatures
export type CandidaturesNavigatorParamList = {
  MesCandidatures: undefined;
  DetailCandidature: { id: number };
  NouvellesCandidatures: undefined; // Pour les employeurs
};

// Types pour la navigation de messagerie
export type MessagerieNavigatorParamList = {
  Conversations: undefined;
  Conversation: { id: number; nom: string };
};

// Types pour la navigation des offres d'emploi flash

export type FlashJobsNavigatorParamList = {
  ListeFlashJobs: undefined;
  DetailFlashJob: { id: number } | { emploi: EmploiFlash };
  RechercheFlashJobs: undefined;
  PublierFlashJob: undefined; // Ajoutez cette route manquante
};

// Types pour la navigation des favoris
export type FavorisNavigatorParamList = {
  MesFavoris: undefined;
};

// Types pour la navigation du profil
export type ProfilNavigatorParamList = {
  MonProfil: undefined;
  EditerProfil: undefined;
  Parametres: undefined;
  Abonnements: undefined;
  ApplyAIConfig: undefined;
  Contrats: undefined;
  MesOffres: undefined; // Pour les employeurs
  Notifications: undefined;
  Statistiques: undefined; // Pour les employeurs
};

// Types pour la navigation principale avec les onglets
export type TabNavigatorParamList = {
  AccueilTab: undefined;
  FlashJobsTab: undefined;
  PublierTab: undefined;
  CandidatsTab: undefined;
  MessagesTab: undefined;
};

// Types pour la navigation principale
export type MainNavigatorParamList = {
  Tabs: {
    screen: string;
    params?: {
      screen: string;
      params?: {
        id?: number;
        nom?: string;
        jobId?: number;
        [key: string]: any;
      };
    };
  };
  DetailEmploi: { id: number } | { emploi: Emploi };
  DetailFlashJob: { id: number } | { emploi: EmploiFlash };
  Recherche: { keyword?: string; location?: string };
  PublierEmploi: undefined;
  PublierFlashJob: undefined;
  FiltrageRecherche: { filtres?: any; onApply: (filtres: any) => void };
  EditerEmploi: { id: number };
  EditerFlashJob: { id: number };
};

// Types pour la navigation principale qui regroupe tout
export type RootNavigatorParamList = {
  Splash: undefined;
  Auth: undefined;
  Main: undefined;
  AutresOptions: undefined;
};


// Type for navigation prop
export type MainNavigationProp<RouteName extends keyof MainNavigatorParamList> = 
  StackNavigationProp<MainNavigatorParamList, RouteName>;

// Type for route prop
export type MainRouteProp<RouteName extends keyof MainNavigatorParamList> = 
  RouteProp<MainNavigatorParamList, RouteName>;