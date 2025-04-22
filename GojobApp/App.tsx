import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from './src/redux/store';
import { Navigation } from './src/navigation/Navigation';
import { LogBox } from 'react-native';
import { enableScreens } from 'react-native-screens';
import { chargerUtilisateur } from './src/redux/slices/authSlice';
import { AppDispatch } from './src/redux/store';

enableScreens(false);

// Ignorer les avertissements spécifiques
LogBox.ignoreLogs([
  'ViewPropTypes will be removed',
  'ColorPropType will be removed',
]);

// Composant qui se charge de vérifier l'authentification
const AuthCheck = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  useEffect(() => {
    dispatch(chargerUtilisateur());
  }, [dispatch]);
  
  return null;
};

const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        {/* Ajouter le composant AuthCheck à l'intérieur du Provider pour avoir accès au dispatch */}
        <AuthCheck />
        <Navigation />
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;