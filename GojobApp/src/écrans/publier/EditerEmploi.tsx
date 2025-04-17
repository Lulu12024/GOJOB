// src/écrans/publier/EditerEmploi.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TextStyle } from 'react-native';
import ChampTexte from '../../components/communs/ChampTexte';
import Bouton from '../../components/communs/Bouton';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainNavigatorParamList } from '../../types/navigation';
type EditerEmploiProps = {
  route: RouteProp<{ params: { emploiId: number } }, 'params'>;
  navigation: StackNavigationProp<any>;
};
// type EditerEmploiProps = NativeStackScreenProps<MainNavigatorParamList, 'EditerEmploi'>;
const EditerEmploi: React.FC<EditerEmploiProps> = ({ route, navigation }) => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { emploiId } = route.params;
  
  // Formulaire
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [localisation, setLocalisation] = useState('');
  const [entreprise, setEntreprise] = useState('');
  const [salaire, setSalaire] = useState('');
  const [typeContrat, setTypeContrat] = useState('CDI');
  const [avecLogement, setAvecLogement] = useState(false);
  const [avecVehicule, setAvecVehicule] = useState(false);
  
  const [chargement, setChargement] = useState(true);
  const [soumission, setSoumission] = useState(false);
  
  // Charger les données de l'emploi
  useEffect(() => {
    const chargerEmploi = async () => {
      try {
        // Simuler l'appel API
        setTimeout(() => {
          // Données fictives pour l'exemple
          setTitre('Serveur en restaurant');
          setDescription('Nous recherchons un serveur expérimenté pour notre restaurant gastronomique...');
          setLocalisation('Paris, 75001');
          setEntreprise('Le Bistrot Parisien');
          setSalaire('2000');
          setTypeContrat('CDI');
          setAvecLogement(true);
          setAvecVehicule(false);
          setChargement(false);
        }, 1000);
        
        // Remplacer par l'appel API réel
        // const response = await emploisApi.getEmploi(emploiId);
        // const emploi = response.data;
        // setTitre(emploi.titre);
        // setDescription(emploi.description);
        // etc.
      } catch (error) {
        console.error('Erreur lors du chargement de l\'emploi:', error);
        setChargement(false);
        Alert.alert('Erreur', 'Impossible de charger les détails de l\'offre');
      }
    };
    
    chargerEmploi();
  }, [emploiId]);
  
  const validerFormulaire = () => {
    if (!titre || !description || !localisation || !entreprise || !salaire || !typeContrat) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return false;
    }
    
    if (isNaN(parseFloat(salaire)) || parseFloat(salaire) <= 0) {
      Alert.alert('Erreur', 'Le salaire doit être un nombre positif');
      return false;
    }
    
    return true;
  };
  
  const mettreAJourEmploi = async () => {
    if (!validerFormulaire()) return;
    
    setSoumission(true);
    
    try {
      // Données à envoyer à l'API
      const emploiData = {
        id: emploiId,
        titre,
        description,
        localisation,
        entreprise,
        salaire: parseFloat(salaire),
        typeContrat,
        avecLogement,
        avecVehicule,
      };
      
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Remplacer par l'appel API réel
      // const response = await emploisApi.updateEmploi(emploiId, emploiData);
      
      setSoumission(false);
      Alert.alert(
        'Succès', 
        'Votre offre d\'emploi a été mise à jour avec succès !',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      setSoumission(false);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la mise à jour');
      console.error('Erreur lors de la mise à jour:', error);
    }
  };
  
  if (chargement) {
    return (
      <View style={[styles.container, { backgroundColor: theme.couleurs.FOND_SOMBRE }]}>
        <Text style={{ color: theme.couleurs.TEXTE_PRIMAIRE }}>Chargement des données...</Text>
      </View>
    );
  }
  
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={[styles.container, { backgroundColor: theme.couleurs.FOND_SOMBRE }]}
        contentContainerStyle={styles.contentContainer}
      >
        <Text style={[styles.title, { 
          color: theme.couleurs.TEXTE_PRIMAIRE,
          fontWeight: theme.typographie.POIDS.GRAS as TextStyle['fontWeight']
        }]}>
          Modifier l'offre d'emploi
        </Text>
        
        <View style={styles.form}>
          <ChampTexte
            label="Titre de l'emploi *"
            value={titre}
            onChangeText={setTitre}
            iconGauche="briefcase"
          />
          
          <ChampTexte
            label="Description *"
            value={description}
            onChangeText={setDescription}
            multiline
            iconGauche="text-box"
            style={{ height: 150 }}
          />
          
          <ChampTexte
            label="Localisation *"
            value={localisation}
            onChangeText={setLocalisation}
            iconGauche="map-marker"
          />
          
          <ChampTexte
            label="Entreprise *"
            value={entreprise}
            onChangeText={setEntreprise}
            iconGauche="domain"
          />
          
          <ChampTexte
            label="Salaire mensuel (€) *"
            value={salaire}
            onChangeText={setSalaire}
            keyboardType="numeric"
            iconGauche="currency-eur"
          />
          
          <Text style={[styles.sectionLabel, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>
            Type de contrat *
          </Text>
          
          <View style={styles.contractButtons}>
            {['CDI', 'CDD', 'Intérim', 'Saisonnier'].map(type => (
              <Bouton
                key={type}
                titre={type}
                onPress={() => setTypeContrat(type)}
                variante={typeContrat === type ? 'primaire' : 'outline'}
                taille="petit"
                style={styles.contractButton}
              />
            ))}
          </View>
          
          <Text style={[styles.sectionLabel, { 
            color: theme.couleurs.TEXTE_PRIMAIRE,
            marginTop: 16,
          }]}>
            Options supplémentaires
          </Text>
          
          <View style={styles.optionsContainer}>
            <Bouton
              titre="Logement de fonction"
              onPress={() => setAvecLogement(!avecLogement)}
              variante={avecLogement ? 'primaire' : 'outline'}
              taille="petit"
              style={styles.optionButton}
              icone="home"
            />
            
            <Bouton
              titre="Véhicule de fonction"
              onPress={() => setAvecVehicule(!avecVehicule)}
              variante={avecVehicule ? 'primaire' : 'outline'}
              taille="petit"
              style={styles.optionButton}
              icone="car"
            />
          </View>
          
          <View style={styles.buttonsContainer}>
            <Bouton
              titre="Annuler"
              onPress={() => navigation.goBack()}
              variante="secondaire"
              taille="moyen"
              style={styles.cancelButton}
            />
            
            <Bouton
              titre="Mettre à jour"
              onPress={mettreAJourEmploi}
              variante="primaire"
              taille="moyen"
              charge={soumission}
              style={styles.submitButton}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
  },
  form: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    marginBottom: 12,
  },
  contractButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  contractButton: {
    marginRight: 8,
    marginBottom: 8,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  optionButton: {
    marginRight: 8,
    marginBottom: 8,
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 32,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  submitButton: {
    flex: 1,
    marginLeft: 8,
  },
});

export default EditerEmploi;