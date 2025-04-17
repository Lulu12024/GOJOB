import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthNavigatorParamList } from '../../types/navigation';
import { TextStyle } from 'react-native';
import Bouton from '../../components/communs/Bouton';
import ChampTexte from '../../components/communs/ChampTexte';

type MotDePasseOublieProps = {
  navigation: NativeStackNavigationProp<AuthNavigatorParamList, 'MotDePasseOublie'>;
};

const MotDePasseOublie: React.FC<MotDePasseOublieProps> = ({ navigation }) => {
  const theme = useTheme();
  
  const [email, setEmail] = useState('');
  const [chargement, setChargement] = useState(false);
  const [emailEnvoye, setEmailEnvoye] = useState(false);
  
  const handleReinitialisation = async () => {
    // Validation de l'email
    if (!email) {
      Alert.alert('Erreur', 'Veuillez entrer votre adresse email');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Erreur', 'Format d\'email invalide');
      return;
    }
    
    setChargement(true);
    
    try {
      // Simuler l'appel à l'API
      setTimeout(() => {
        setChargement(false);
        setEmailEnvoye(true);
      }, 1500);
      
      // En réalité, vous feriez un appel à votre API ici
      // await authApi.resetPassword(email);
    } catch (error) {
      setChargement(false);
      Alert.alert('Erreur', 'Impossible d\'envoyer l\'email de réinitialisation');
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
        <View style={styles.content}>
          <Text 
            style={[
              styles.title, 
              { 
                color: theme.couleurs.TEXTE_PRIMAIRE,
                fontWeight: theme.typographie.POIDS.GRAS as TextStyle['fontWeight'] 
              }
            ]}
          >
            Mot de passe oublié
          </Text>
          
          {!emailEnvoye ? (
            <>
              <Text style={[styles.description, { color: theme.couleurs.TEXTE_SECONDAIRE }]}>
                Veuillez entrer l'adresse email associée à votre compte. Nous vous enverrons un lien pour réinitialiser votre mot de passe.
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
              
              <Bouton 
                titre="Réinitialiser" 
                onPress={handleReinitialisation}
                variante="primaire"
                taille="grand"
                charge={chargement}
                style={styles.button}
              />
            </>
          ) : (
            <>
              <View style={[styles.successContainer, { backgroundColor: `${theme.couleurs.SUCCES}20` }]}>
                <Text style={[styles.successText, { color: theme.couleurs.SUCCES }]}>
                  Un email a été envoyé à {email} avec les instructions pour réinitialiser votre mot de passe.
                </Text>
              </View>
              
              <Text style={[styles.infoText, { color: theme.couleurs.TEXTE_SECONDAIRE }]}>
                Si vous ne recevez pas l'email dans les prochaines minutes, vérifiez votre dossier de spam ou essayez à nouveau.
              </Text>
              
              <Bouton 
                titre="Retour à la connexion" 
                onPress={() => navigation.navigate('Connexion')}
                variante="secondaire"
                taille="grand"
                style={styles.button}
              />
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  content: {
    width: '100%',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    marginBottom: 24,
    lineHeight: 24,
  },
  button: {
    marginTop: 24,
  },
  successContainer: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  successText: {
    fontSize: 16,
    lineHeight: 24,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default MotDePasseOublie;