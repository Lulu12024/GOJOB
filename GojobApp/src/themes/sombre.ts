
import { COULEURS } from '../constants/couleurs';
import { TextStyle } from 'react-native';
type FontWeight = TextStyle['fontWeight'];

export const themeSombre = {
  couleurs: {
    ...COULEURS,
    // On peut ajouter ici des spécificités du thème sombre
  },
  
  typographie: {
    FAMILLE_PRINCIPALE: 'System',  // À remplacer par votre police personnalisée si nécessaire
    
    TAILLES: {
      TRES_PETIT: 12,
      PETIT: 14,
      MOYEN: 16,
      GRAND: 18,
      TRES_GRAND: 22,
      ENORME: 26,
    },
    
    // POIDS: {
    //   NORMAL: '400',
    //   SEMI_GRAS: '500',
    //   GRAS: '600',
    //   TRES_GRAS: '700',
    // },
    POIDS: {
      NORMAL: 'normal',
      SEMI_GRAS: 'medium',
      GRAS: 'bold',
      TRES_GRAS: '700',
    }
  },
  
  espacement: {
    TRES_PETIT: 4,
    PETIT: 8,
    MOYEN: 16,
    GRAND: 24,
    TRES_GRAND: 32,
    ENORME: 48,
  },
  
  bordures: {
    RADIUS_PETIT: 5,
    RADIUS_MOYEN: 10,
    RADIUS_GRAND: 15,
    RADIUS_COMPLET: 9999,
  },
  
  ombres: {
    LEGERE: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
    },
    MOYENNE: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 4,
    },
    FORTE: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 8,
    },
  },
};
