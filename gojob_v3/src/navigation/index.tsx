import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootNavigatorParamList } from '../types/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Importation des navigateurs
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

// Importation des écrans
import EcranSplash from '../écrans/Splash';

// Importation des hooks
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setAuthentifie, setUtilisateur } from '../redux/slices/authSlice';

const Stack = createNativeStackNavigator<RootNavigatorParamList>();

const Navigation: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { estAuthentifie } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    // Vérification de l'authentification au démarrage
    const verifierAuthentification = async () => {
      try {
        const utilisateurJSON = await AsyncStorage.getItem('user_data');
        const token = await AsyncStorage.getItem('auth_token');
        
        if (utilisateurJSON && token) {
          const utilisateur = JSON.parse(utilisateurJSON);
          dispatch(setUtilisateur(utilisateur));
          dispatch(setAuthentifie(true));
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification :', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    verifierAuthentification();
  }, [dispatch]);
  
  if (isLoading) {
    return <EcranSplash />;
  }
  
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {estAuthentifie ? (
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;