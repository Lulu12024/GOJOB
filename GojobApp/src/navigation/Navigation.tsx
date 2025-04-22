import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store'; // Ajout des types
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import { StatusBar, ActivityIndicator, View } from 'react-native';
import { verifierAuthentification } from '../redux/slices/authSlice'; // Renommé pour plus de clarté
import { useTheme } from '../hooks/useTheme';

export const Navigation: React.FC = () => {
  // Utilisation des types corrects pour Redux
  const { utilisateur, chargement, authenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  
  // Supposons que vous avez une préférence de mode sombre quelque part
  const isDark = true; // À remplacer par votre logique réelle

  useEffect(() => {
    dispatch(verifierAuthentification());
  }, [dispatch]);

  if (chargement) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: theme.couleurs.FOND_SOMBRE 
      }}>
        <ActivityIndicator size="large" color={theme.couleurs.PRIMAIRE} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar
        backgroundColor={theme.couleurs.FOND_SOMBRE}
        barStyle={isDark ? 'light-content' : 'dark-content'}
      />
      {authenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};