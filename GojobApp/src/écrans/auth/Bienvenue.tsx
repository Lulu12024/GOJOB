import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthNavigatorParamList } from '../../types/navigation';
import { TextStyle } from 'react-native';
import Bouton from '../../components/communs/Bouton';

type BienvenueProp = {
  navigation: NativeStackNavigationProp<AuthNavigatorParamList, 'Bienvenue'>;
};

const Bienvenue: React.FC<BienvenueProp> = ({ navigation }) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.couleurs.FOND_SOMBRE }]}>
      <View style={styles.logoContainer}>
        <Image 
          source={require('../../assets/images/logo.png')} 
          style={styles.logo} 
          resizeMode="contain"
        />
        <Text 
          style={[
            styles.appName, 
            { 
              color: theme.couleurs.TEXTE_PRIMAIRE,
              fontWeight: theme.typographie.POIDS.GRAS as TextStyle['fontWeight']
            }
          ]}
        >
          GoJobs
        </Text>
        <Text 
          style={[
            styles.tagline, 
            { 
              color: theme.couleurs.TEXTE_SECONDAIRE 
            }
          ]}
        >
          Trouvez l'emploi parfait, en quelques clics
        </Text>
      </View>

      <View style={styles.buttonsContainer}>
        <Bouton 
          titre="Se connecter" 
          onPress={() => navigation.navigate('Connexion')}
          variante="primaire"
          taille="grand"
          style={styles.button}
        />
        
        <Bouton 
          titre="Créer un compte" 
          onPress={() => navigation.navigate('Inscription')}
          variante="secondaire"
          taille="grand"
          style={styles.button}
        />
        
        <TouchableOpacity 
          onPress={() => {/* Pour une version future - Continuer sans compte */}} 
          style={styles.skipButton}
        >
          <Text style={[styles.skipText, { color: theme.couleurs.TEXTE_TERTIAIRE }]}>
            Explorer l'application
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  appName: {
    fontSize: 36,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    textAlign: 'center',
  },
  buttonsContainer: {
    width: '100%',
    marginBottom: 40,
  },
  button: {
    marginBottom: 16,
  },
  skipButton: {
    alignItems: 'center',
    padding: 12,
  },
  skipText: {
    fontSize: 16,
  },
});

export default Bienvenue;