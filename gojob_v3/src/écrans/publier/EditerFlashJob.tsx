// src/écrans/publier/EditerFlashJob.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Platform, KeyboardAvoidingView } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { TextStyle } from 'react-native';
import ChampTexte from '../../components/communs/ChampTexte';
import Bouton from '../../components/communs/Bouton';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

type EditerFlashJobProps = {
  route: RouteProp<{ params: { flashJobId: number } }, 'params'>;
  navigation: StackNavigationProp<any>;
};

const EditerFlashJob: React.FC<EditerFlashJobProps> = ({ route, navigation }) => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { flashJobId } = route.params;
  
  // Formulaire
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [localisation, setLocalisation] = useState('');
  const [salaire, setSalaire] = useState('');
  const [dateDebut, setDateDebut] = useState(new Date());
  const [dateFin, setDateFin] = useState(new Date());
  const [showDateDebut, setShowDateDebut] = useState(false);
  const [showDateFin, setShowDateFin] = useState(false);
  
  const [chargement, setChargement] = useState(true);
  const [soumission, setSoumission] = useState(false);
  
  // Charger les données de l'emploi flash
  useEffect(() => {
    const chargerFlashJob = async () => {
      try {
        // Simuler l'appel API
        setTimeout(() => {
          // Données fictives pour l'exemple
          setTitre('Serveur en restaurant');
          setDescription('Nous recherchons un serveur pour la soirée du 15 juin...');
          setLocalisation('Paris, 75001');
          setSalaire('80');
          
          const debut = new Date('2025-06-15T18:00:00');
          const fin = new Date('2025-06-15T23:00:00');
          setDateDebut(debut);
          setDateFin(fin);
          
          setChargement(false);
        }, 1000);
        
        // Remplacer par l'appel API réel
        // const response = await flashJobsApi.getFlashJob(flashJobId);
        // const flashJob = response.data;
        // setTitre(flashJob.titre);
        // setDescription(flashJob.description);
        // etc.
      } catch (error) {
        console.error('Erreur lors du chargement de l\'emploi flash:', error);
        setChargement(false);
        Alert.alert('Erreur', 'Impossible de charger les détails de l\'emploi flash');
      }
    };
    
    chargerFlashJob();
  }, [flashJobId]);
  
  // Gestion du DateTimePicker pour la date de début
  const onChangeDateDebut = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || dateDebut;
    setShowDateDebut(Platform.OS === 'ios');
    setDateDebut(currentDate);
    
    // Si la date de fin est avant la date de début, on ajuste
    if (dateFin < currentDate) {
      const newEndDate = new Date(currentDate);
      newEndDate.setHours(currentDate.getHours() + 2); // Par défaut 2h plus tard
      setDateFin(newEndDate);
    }
  };
  
  // Gestion du DateTimePicker pour la date de fin
  const onChangeDateFin = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || dateFin;
    setShowDateFin(Platform.OS === 'ios');
    setDateFin(currentDate);
  };
  
  const validerFormulaire = () => {
    if (!titre || !description || !localisation || !salaire) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return false;
    }
    
    if (isNaN(parseFloat(salaire)) || parseFloat(salaire) <= 0) {
      Alert.alert('Erreur', 'Le salaire doit être un nombre positif');
      return false;
    }
    
    if (dateFin <= dateDebut) {
      Alert.alert('Erreur', 'La date de fin doit être postérieure à la date de début');
      return false;
    }
    
    return true;
  };
  
  const mettreAJourFlashJob = async () => {
    if (!validerFormulaire()) return;
    
    setSoumission(true);
    
    try {
      // Données à envoyer à l'API
      const flashJobData = {
        id: flashJobId,
        titre,
        description,
        localisation,
        salaire: parseFloat(salaire),
        dateDebut: dateDebut.toISOString(),
        dateFin: dateFin.toISOString(),
      };
      
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Remplacer par l'appel API réel
      // const response = await flashJobsApi.updateFlashJob(flashJobId, flashJobData);
      
      setSoumission(false);
      Alert.alert(
        'Succès', 
        'Votre emploi flash a été mis à jour avec succès !',
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
          Modifier l'emploi flash
        </Text>
        
        <View style={styles.form}>
          <ChampTexte
            label="Titre de l'emploi *"
            placeholder="Ex: Serveur pour soirée privée"
            value={titre}
            onChangeText={setTitre}
            iconGauche="briefcase"
          />
          
          <ChampTexte
            label="Description *"
            placeholder="Décrivez la mission, les tâches à effectuer, les compétences requises..."
            value={description}
            onChangeText={setDescription}
            multiline
            iconGauche="text-box"
            style={{ height: 120 }}
          />
          
          <ChampTexte
            label="Localisation *"
            placeholder="Ex: Paris, 75001"
            value={localisation}
            onChangeText={setLocalisation}
            iconGauche="map-marker"
          />
          
          <ChampTexte
            label="Salaire (€) *"
            placeholder="Ex: 80"
            value={salaire}
            onChangeText={setSalaire}
            keyboardType="numeric"
            iconGauche="currency-eur"
          />
          
          <Text style={[styles.sectionLabel, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>
            Date et heure de début *
          </Text>
          
          <Bouton
            titre={dateDebut.toLocaleString()}
            onPress={() => setShowDateDebut(true)}
            variante="outline"
            taille="moyen"
            icone="calendar-clock"
          />
          
          {/* */}
          {showDateDebut && (
            <DateTimePicker
                value={dateDebut}
                mode="datetime"
                display="default"
                onChange={onChangeDateDebut}
            />
            )}
          
          <Text style={[styles.sectionLabel, { 
            color: theme.couleurs.TEXTE_PRIMAIRE,
            marginTop: 16
          }]}>
            Date et heure de fin *
          </Text>
          
          <Bouton
            titre={dateFin.toLocaleString()}
            onPress={() => setShowDateFin(true)}
            variante="outline"
            taille="moyen"
            icone="calendar-clock"
          />
          
          {showDateFin && (
            <DateTimePicker
              value={dateFin}
              mode="datetime"
              display="default"
              onChange={onChangeDateFin}
            />
          )}
          
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
              onPress={mettreAJourFlashJob}
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

export default EditerFlashJob;