import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthNavigatorParamList } from '../../types/navigation';
import { TextStyle } from 'react-native';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
// Importez votre action de connexion 
// import { connexion } from '../../redux/slices/authSlice';
import Bouton from '../../components/communs/Bouton';
import ChampTexte from '../../components/communs/ChampTexte';

type ConnexionProps = {
  navigation: NativeStackNavigationProp<AuthNavigatorParamList, 'Connexion'>;
};

const Connexion: React.FC<ConnexionProps> = ({ navigation }) => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [chargement, setChargement] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  
  const handleConnexion = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }
    
    setChargement(true);
    
    try {
      // Appel à l'action de connexion à décommenter quand vous l'aurez créée
      // await dispatch(connexion({ email, password })).unwrap();
      
      // Pour le moment, simulons une réussite après 1 seconde
      setTimeout(() => {
        setChargement(false);
        
        // Navigation vers l'écran principal - à adapter selon votre flux de navigation
        // navigation.navigate('Main'); 
      }, 1000);
    } catch (error: any) {
      setChargement(false);
      Alert.alert('Erreur', error.message || 'Impossible de se connecter');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView 
        contentContainerStyle={[styles.container, { backgroundColor: theme.couleurs.FOND_SOMBRE }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          <Text 
            style={[
              styles.title, 
              { 
                color: theme.couleurs.TEXTE_PRIMAIRE,
                fontWeight: theme.typographie.POIDS.GRAS as TextStyle['fontWeight'] 
              }
            ]}
          >
            Connectez-vous à votre compte
          </Text>
          
          <ChampTexte
            label="Email"
            placeholder="Votre adresse email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            iconGauche="email"
          />
          
          <ChampTexte
            label="Mot de passe"
            placeholder="Votre mot de passe"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!passwordVisible}
            iconGauche="lock"
            iconDroite={passwordVisible ? "eye-off" : "eye"}
            onPressIconDroite={togglePasswordVisibility}
          />
          
          <TouchableOpacity 
            onPress={() => navigation.navigate('MotDePasseOublie')}
            style={styles.forgotPasswordButton}
          >
            <Text style={[styles.forgotPasswordText, { color: theme.couleurs.PRIMAIRE }]}>
              Mot de passe oublié ?
            </Text>
          </TouchableOpacity>
          
          <Bouton 
            titre="Se connecter" 
            onPress={handleConnexion}
            variante="primaire"
            taille="grand"
            charge={chargement}
            style={styles.loginButton}
          />
        </View>
        
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.couleurs.TEXTE_SECONDAIRE }]}>
            Vous n'avez pas de compte ?
          </Text>
          
          <TouchableOpacity onPress={() => navigation.navigate('Inscription')}>
            <Text style={[styles.signupText, { color: theme.couleurs.PRIMAIRE }]}>
              Créer un compte
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  formContainer: {
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    marginBottom: 30,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
  },
  loginButton: {
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 24,
  },
  footerText: {
    fontSize: 16,
    marginRight: 4,
  },
  signupText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Connexion;