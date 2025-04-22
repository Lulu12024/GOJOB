// src/components/AuthRedirect.tsx
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '../redux/store';

export const AuthRedirect: React.FC = () => {
    const { utilisateur, authenticated } = useSelector((state: RootState) => state.auth);
    // Utilisez le bon type pour la navigation
    const navigation = useNavigation<any>(); // Correction temporaire, idéalement utilisez le type exact
     
    useEffect(() => {
      if (authenticated && utilisateur) {
        if (utilisateur.role === 'employer') {
          // Rediriger vers le tableau de bord employeur
          navigation.reset({
            index: 0,
            routes: [{ name: 'EmployeurTabs' as never }],
          });
        } else if (utilisateur.role === 'candidate') {
          // Rediriger vers l'écran principal des candidats
          navigation.reset({
            index: 0,
            routes: [{ name: 'CandidatTabs' as never }],
          });
        }
      }
    }, [authenticated, utilisateur, navigation]);
     
    return null;
  };