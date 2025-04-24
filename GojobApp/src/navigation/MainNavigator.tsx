import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainNavigatorParamList } from '../types/navigation';
import { useTheme } from '../hooks/useTheme';
import { MonProfil } from '../écrans/profil/MonProfil';
// Importation des navigateurs et écrans
import {TabNavigator} from './TabNavigator';
import EcranDetailEmploi from '../écrans/accueil/DetailEmploi';
import DetailFlashJob from '../écrans/flashJobs/DetailFlashJob';
import EcranRecherche from '../écrans/accueil/Recherche';
import {PublierEmploi} from '../écrans/employeur/PublierEmploi';
import EcranPublierFlashJob from '../écrans/publier/PublierFlashJob';
import FiltrageRecherche from '../écrans/accueil/FiltrageRecherche';
import EcranEditerEmploi from '../écrans/publier/EditerEmploi';
import EditerFlashJob from '../écrans/publier/EditerFlashJob';
import { TextStyle } from 'react-native';

const Stack = createNativeStackNavigator<MainNavigatorParamList>();

const MainNavigator: React.FC = () => {
  const theme = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.couleurs.FOND_SOMBRE,
        },
        headerTintColor: theme.couleurs.TEXTE_PRIMAIRE,
        headerTitleStyle: {
          fontWeight: theme.typographie.POIDS.GRAS as TextStyle['fontWeight'],
        },
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: theme.couleurs.FOND_SOMBRE,
        },
      }}
    >
      <Stack.Screen
        name="Tabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DetailEmploi"
        component={EcranDetailEmploi}
        options={{
          title: 'Détail de l\'offre',
        }}
      />
      {/* <Stack.Screen
        name="DetailFlashJob"
        component={DetailFlashJob}
        options={{
          title: 'Emploi flash',
        }}
      /> */}
      <Stack.Screen
        name="Recherche"
        component={EcranRecherche}
        options={{
          title: 'Recherche',
        }}
      />
      <Stack.Screen
        name="PublierEmploi"
        component={PublierEmploi}
        options={{
          title: 'Publier une offre',
        }}
      />
      <Stack.Screen
        name="PublierFlashJob"
        component={EcranPublierFlashJob}
        options={{
          title: 'Publier un emploi flash',
        }}
      />
      <Stack.Screen name="MonProfil" component={MonProfil} options={{ title: 'Profil' }} />
      {/* <Stack.Screen
        name="FiltrageRecherche"
        component={FiltrageRecherche}
        options={{
          title: 'Filtres de recherche',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="EditerEmploi"
        component={EcranEditerEmploi}
        options={{
          title: 'Modifier l\'offre',
        }}
      />
      <Stack.Screen
        name="EditerFlashJob"
        component={EditerFlashJob}
        options={{
          title: 'Modifier l\'emploi flash',
        }}
      /> */}
    </Stack.Navigator>
  );
};

export default MainNavigator;