import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert, TouchableOpacity } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthNavigatorParamList } from '../../types/navigation';
import { TextStyle } from 'react-native';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
// Importez votre action d'inscription
// import { inscription } from '../../redux/slices/authSlice';
import Bouton from '../../components/communs/Bouton';
import ChampTexte from '../../components/communs/ChampTexte';

type InscriptionProps = {
  navigation: NativeStackNavigationProp<AuthNavigatorParamList, 'Inscription'>;
};

const Inscription: React.FC<InscriptionProps> = ({ navigation }) => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [role, setRole] = useState<'candidate' | 'employer'>('candidate');
  const [chargement, setChargement] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  
  const validateForm = () => {
    if (!nom || !prenom || !email || !password || !passwordConfirm) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return false;
    }
    
    if (password !== passwordConfirm) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return false;
    }
    
    // Vérification du format de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Erreur', 'Format d\'email invalide');
      return false;
    }
    
    return true;
  };
  
  const handleInscription = async () => {
    if (!validateForm()) return;
    
    setChargement(true);
    
    try {
      // Appel à l'action d'inscription à décommenter quand vous l'aurez créée
      /* 
      await dispatch(inscription({
        nom,
        prenom,
        email,
        telephone,
        password,
        password_confirmation: passwordConfirm,
        role
      })).unwrap();
      */
      
      // Pour le moment, simulons une réussite après 1 seconde
      setTimeout(() => {
        setChargement(false);
        Alert.alert(
          'Compte créé',
          'Votre compte a été créé avec succès !',
          [{ text: 'OK', onPress: () => navigation.navigate('Connexion') }]
        );
      }, 1000);
    } catch (error: any) {
      setChargement(false);
      Alert.alert('Erreur', error.message || 'Impossible de créer le compte');
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
        <Text 
          style={[
            styles.title, 
            { 
              color: theme.couleurs.TEXTE_PRIMAIRE,
              fontWeight: theme.typographie.POIDS.GRAS as TextStyle['fontWeight'] 
            }
          ]}
        >
          Créer un compte
        </Text>
        
        {/* Type de compte */}
        <View style={styles.roleContainer}>
          <Text style={[styles.roleTitle, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>
            Je suis :
          </Text>
          
          <View style={styles.roleButtons}>
            <TouchableOpacity
              style={[
                styles.roleButton,
                role === 'candidate' && { 
                  backgroundColor: theme.couleurs.PRIMAIRE,
                  borderColor: theme.couleurs.PRIMAIRE 
                },
                role !== 'candidate' && { 
                  backgroundColor: 'transparent',
                  borderColor: theme.couleurs.TEXTE_TERTIAIRE  
                }
              ]}
              onPress={() => setRole('candidate')}
            >
              <Text 
                style={[
                  styles.roleText, 
                  { 
                    color: role === 'candidate' 
                      ? '#FFFFFF' 
                      : theme.couleurs.TEXTE_SECONDAIRE 
                  }
                ]}
              >
                Candidat
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.roleButton,
                role === 'employer' && { 
                  backgroundColor: theme.couleurs.PRIMAIRE,
                  borderColor: theme.couleurs.PRIMAIRE 
                },
                role !== 'employer' && { 
                  backgroundColor: 'transparent',
                  borderColor: theme.couleurs.TEXTE_TERTIAIRE  
                }
              ]}
              onPress={() => setRole('employer')}
            >
              <Text 
                style={[
                  styles.roleText, 
                  { 
                    color: role === 'employer' 
                      ? '#FFFFFF' 
                      : theme.couleurs.TEXTE_SECONDAIRE 
                  }
                ]}
              >
                Employeur
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Champs de formulaire */}
        <ChampTexte
          label="Prénom *"
          placeholder="Votre prénom"
          value={prenom}
          onChangeText={setPrenom}
          iconGauche="account"
        />
        
        <ChampTexte
          label="Nom *"
          placeholder="Votre nom"
          value={nom}
          onChangeText={setNom}
          iconGauche="account"
        />
        
        <ChampTexte
          label="Email *"
          placeholder="Votre adresse email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          iconGauche="email"
        />
        
        <ChampTexte
          label="Téléphone (optionnel)"
          placeholder="Votre numéro de téléphone"
          value={telephone}
          onChangeText={setTelephone}
          keyboardType="phone-pad"
          iconGauche="phone"
        />
        
        <ChampTexte
          label="Mot de passe *"
          placeholder="Créez un mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!passwordVisible}
          iconGauche="lock"
          iconDroite={passwordVisible ? "eye-off" : "eye"}
          onPressIconDroite={togglePasswordVisibility}
        />
        
        <ChampTexte
          label="Confirmer le mot de passe *"
          placeholder="Confirmez votre mot de passe"
          value={passwordConfirm}
          onChangeText={setPasswordConfirm}
          secureTextEntry={!passwordVisible}
          iconGauche="lock"
        />
        
        <Text style={[styles.infoText, { color: theme.couleurs.TEXTE_TERTIAIRE }]}>
          * Champs obligatoires
        </Text>
        
        <Bouton 
          titre="Créer mon compte" 
          onPress={handleInscription}
          variante="primaire"
          taille="grand"
          charge={chargement}
          style={styles.registerButton}
        />
        
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.couleurs.TEXTE_SECONDAIRE }]}>
            Vous avez déjà un compte ?
          </Text>
          
          <TouchableOpacity onPress={() => navigation.navigate('Connexion')}>
            <Text style={[styles.loginText, { color: theme.couleurs.PRIMAIRE }]}>
              Se connecter
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
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    marginTop: 16,
  },
  roleContainer: {
    marginBottom: 20,
  },
  roleTitle: {
    fontSize: 16,
    marginBottom: 10,
  },
  roleButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roleButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  roleText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 12,
    marginTop: 8,
    marginBottom: 16,
  },
  registerButton: {
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 24,
  },
  footerText: {
    fontSize: 16,
    marginRight: 4,
  },
  loginText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Inscription;