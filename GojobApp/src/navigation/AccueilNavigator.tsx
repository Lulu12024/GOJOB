import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AccueilNavigatorParamList } from '../types/navigation';
import { useTheme } from '../hooks/useTheme';
import { MonProfil } from '../écrans/profil/MonProfil';
// Importation des écrans
import EcranListeEmplois from '../écrans/accueil/ListeEmplois';
import EcranDetailEmploi from '../écrans/accueil/DetailEmploi';
import EcranRecherche from '../écrans/accueil/Recherche';
import EcranResultatsRecherche from '../écrans/accueil/ResultatsRecherche';
import { TextStyle } from 'react-native';

const Stack = createNativeStackNavigator<AccueilNavigatorParamList>();

const AccueilNavigator: React.FC = () => {
  const theme = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.couleurs.FOND_SOMBRE,
        },
        headerTintColor: theme.couleurs.TEXTE_PRIMAIRE,
       
        headerTitleStyle: {
            // Utilisez un cast explicite pour informer TypeScript du type correct
            fontWeight: theme.typographie.POIDS.GRAS as TextStyle['fontWeight'],
          },
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: theme.couleurs.FOND_SOMBRE,
        },
      }}
    >
      <Stack.Screen
        name="ListeEmplois"
        component={EcranListeEmplois}
        options={{
          title: 'GoJobs',
        }}
      />
      <Stack.Screen
        name="DetailEmploi"
        component={EcranDetailEmploi}
        options={{
          title: 'Détail de l\'offre',
        }}
      />
      <Stack.Screen
        name="Recherche"
        component={EcranRecherche}
        options={{
          title: 'Recherche',
        }}
      />
      <Stack.Screen
        name="ResultatsRecherche"
        component={EcranResultatsRecherche}
        options={{
          title: 'Résultats',
        }}
      />
      <Stack.Screen
        name="MonProfil"
        component={MonProfil}
        options={{
          title: 'Profil',
          
        }}
      />
      
    </Stack.Navigator>
  );
};

export default AccueilNavigator;