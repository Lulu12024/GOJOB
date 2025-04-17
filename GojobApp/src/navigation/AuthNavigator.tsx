import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthNavigatorParamList } from '../types/navigation';
import { useTheme } from '../hooks/useTheme';

// Importation des écrans
import Connexion from '../écrans/auth/Connexion';
import Bienvenue from '../écrans/auth/Bienvenue';
import Inscription from '../écrans/auth/Inscription';
import MotDePasseOublie from '../écrans/auth/MotDePasseOublie';
import { TextStyle } from 'react-native';

const Stack = createNativeStackNavigator<AuthNavigatorParamList>();

const AuthNavigator: React.FC = () => {
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
        name="Bienvenue"
        component={Bienvenue}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Connexion"
        component={Connexion }
        options={{ title: 'Connexion' }}
      />
      <Stack.Screen
        name="Inscription"
        component={Inscription}
        options={{ title: 'Créer un compte' }}
      />
      <Stack.Screen
        name="MotDePasseOublie"
        component={MotDePasseOublie}
        options={{ title: 'Mot de passe oublié' }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;