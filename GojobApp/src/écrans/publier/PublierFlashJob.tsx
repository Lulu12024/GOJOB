// src/écrans/publier/PublierFlashJob.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Platform, KeyboardAvoidingView } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { TextStyle } from 'react-native';
import ChampTexte from '../../components/communs/ChampTexte';
import Bouton from '../../components/communs/Bouton';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StackNavigationProp } from '@react-navigation/stack';

type PublierFlashJobProps = {
  navigation: StackNavigationProp<any>;
};

const PublierFlashJob: React.FC<PublierFlashJobProps> = ({ navigation }) => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  
  // Formulaire
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [localisation, setLocalisation] = useState('');
  const [salaire, setSalaire] = useState('');
  const [dateDebut, setDateDebut] = useState(new Date());
  const [dateFin, setDateFin] = useState(new Date());
  const [showDateDebut, setShowDateDebut] = useState(false);
  const [showDateFin, setShowDateFin] = useState(false);
  
  const [loading, setLoading] = useState(false);
  
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
  
  const publierFlashJob = async () => {
    if (!validerFormulaire()) return;
    
    setLoading(true);
    
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Données à envoyer à l'API
      const flashJobData = {
        titre,
        description,
        localisation,
        salaire: parseFloat(salaire),
        dateDebut: dateDebut.toISOString(),
        dateFin: dateFin.toISOString(),
      };
      
      // Remplacer par l'appel API réel
      // const response = await flashJobsApi.createFlashJob(flashJobData);
      
      setLoading(false);
      Alert.alert(
        'Succès', 
        'Votre emploi flash a été publié avec succès !',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      setLoading(false);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la publication');
      console.error('Erreur lors de la publication:', error);
    }
  };
  
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
          Publier un emploi flash
        </Text>
        
        <Text style={[styles.description, { color: theme.couleurs.TEXTE_SECONDAIRE }]}>
          Les emplois flash sont des missions courtes et ponctuelles. Ils sont visibles par les candidats jusqu'à leur date de fin.
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
          
          <Bouton
            titre="Publier"
            onPress={publierFlashJob}
            variante="primaire"
            taille="grand"
            charge={loading}
            style={styles.submitButton}
          />
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
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 24,
    lineHeight: 22,
  },
  form: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  submitButton: {
    marginTop: 32,
  },
});

export default PublierFlashJob;