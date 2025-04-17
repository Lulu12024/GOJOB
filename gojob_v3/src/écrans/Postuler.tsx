import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TextInput, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../hooks/useTheme';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Bouton from '../components/communs/Bouton';
import { fetchJobDetails } from '../redux/slices/emploisSlice';
import { createApplication } from '../redux/slices/applicationsSlice';
import DocumentPicker from 'react-native-document-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { AppDispatch, RootState } from '../redux/store'; // Ajoutez cette ligne

type PostulerProps = {
  route: RouteProp<{ params: { jobId: number } }, 'params'>;
  navigation: StackNavigationProp<any>;
};

export const Postuler: React.FC<PostulerProps> = ({ route, navigation }) => {
  const theme = useTheme(); // Correction ici
  const dispatch = useDispatch<AppDispatch>(); // Correction ici
  const { jobId } = route.params;
  
//   const { jobDetails } = useSelector((state: RootState) => state.emplois); // Correction ici
  const { user } = useSelector((state: any) => state.auth);
  const { jobDetails, loading, error } = useSelector((state: any) => state.emplois);
  const { favoris } = useSelector((state: any) => state.favoris);

  const [cv, setCV] = useState<any>(null);
  const [lettreMotivation, setLettreMotivation] = useState<any>(null);
  const [reponses, setReponses] = useState<Record<string, string>>({});
  const [useAI, setUseAI] = useState(false);
  
  useEffect(() => {
    if (!jobDetails || jobDetails.id !== jobId) {
      dispatch(fetchJobDetails(jobId));
    }
  }, [dispatch, jobId, jobDetails]);
  
  
  const selectCV = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.docx],
      });
      
      setCV(res[0]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // L'utilisateur a annulé
      } else {
        Alert.alert('Erreur', 'Impossible de sélectionner le CV.');
      }
    }
  };
  
  const selectLettreMotivation = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.docx],
      });
      
      setLettreMotivation(res[0]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // L'utilisateur a annulé
      } else {
        Alert.alert('Erreur', 'Impossible de sélectionner la lettre de motivation.');
      }
    }
  };
  
  const handleReponseChange = (questionId: string, value: string) => {
    setReponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };
  
  const handleSubmit = () => {
    if (!cv) {
      Alert.alert('Erreur', 'Veuillez sélectionner votre CV.');
      return;
    }
    
    const formData = new FormData();
    formData.append('jobId', jobId.toString());
    formData.append('cv', {
      uri: cv.uri,
      type: cv.type,
      name: cv.name,
    });
    
    if (lettreMotivation) {
      formData.append('lettre', {
        uri: lettreMotivation.uri,
        type: lettreMotivation.type,
        name: lettreMotivation.name,
      });
    }
    
    // Ajouter les réponses aux questions
    for (const [questionId, reponse] of Object.entries(reponses)) {
      formData.append(`question_${questionId}`, reponse);
    }
    
    dispatch(createApplication(formData));
    
    Alert.alert(
      'Candidature envoyée', 
      'Votre candidature a été envoyée avec succès!', 
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };
  
  const handleUseAI = () => {
    if (useAI) {
      // Désactiver l'IA
      setUseAI(false);
      return;
    }
    
    // Vérifier l'abonnement ApplyAI
    if (!user.hasSubscription('apply_ai') && !user.hasSubscription('apply_ai_pro')) {
      navigation.navigate('Abonnements', { highlight: 'applyai' });
      return;
    }
    
    setUseAI(true);
  };
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.couleurs.FOND_SOMBRE }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>Postuler</Text>
        {jobDetails && (
          <View>
            <Text style={[styles.jobTitle, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>{jobDetails.titre}</Text>
            <Text style={styles.company}>{jobDetails.entreprise} - {jobDetails.location}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>Documents</Text>
        
        <TouchableOpacity 
          onPress={selectCV}
          style={[styles.fileButton, { borderColor: theme.couleurs.BORDURE || '#e0e0e0' }]}
        >
          <Icon name="document-outline" size={24} color={theme.couleurs.PRIMAIRE} />
          <Text style={[styles.fileButtonText, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>
            {cv ? cv.name : 'Sélectionner votre CV'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={selectLettreMotivation}
          style={[styles.fileButton, { borderColor: theme.couleurs.BORDURE || '#e0e0e0' }]}
        >
          <Icon name="document-text-outline" size={24} color={theme.couleurs.PRIMAIRE} />
          <Text style={[styles.fileButtonText, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>
            {lettreMotivation ? lettreMotivation.name : 'Sélectionner une lettre de motivation (optionnel)'}
          </Text>
        </TouchableOpacity>
      </View>
      
      {jobDetails && jobDetails.questions && jobDetails.questions.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>Questions</Text>
          
          {jobDetails.questions.map((question: any) => (
            <View key={question.id} style={styles.questionContainer}>
              <Text style={[styles.questionText, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>{question.text}</Text>
              <TextInput
                value={reponses[question.id] || ''}
                onChangeText={(text) => handleReponseChange(question.id, text)}
                style={[
                  styles.input,
                  { backgroundColor: theme.couleurs.FOND_SECONDAIRE, color: theme.couleurs.TEXTE_PRIMAIRE }
                ]}
                multiline
                placeholder="Votre réponse..."
                placeholderTextColor="#999"
              />
            </View>
          ))}
        </View>
      )}
      
      <TouchableOpacity 
        onPress={handleUseAI}
        style={[
          styles.aiButton, 
          useAI ? { backgroundColor: theme.couleurs.PRIMAIRE } : { borderColor: theme.couleurs.PRIMAIRE, borderWidth: 1 }
        ]}
      >
        <Icon name="flash-outline" size={20} color={useAI ? 'white' : theme.couleurs.PRIMAIRE} />
        <Text style={[styles.aiButtonText, { color: useAI ? 'white' : theme.couleurs.PRIMAIRE }]}>
          {useAI ? 'ApplyAI activé' : 'Utilisez ApplyAI pour optimiser votre candidature'}
        </Text>
      </TouchableOpacity>
      
      {useAI && (
        <View style={[styles.aiInfoContainer, { backgroundColor: `${theme.couleurs.PRIMAIRE}20` }]}>
          <Text style={{ color: theme.couleurs.TEXTE_PRIMAIRE }}>
            ApplyAI analysera votre CV et la description du poste pour optimiser votre candidature et améliorer vos chances.
          </Text>
        </View>
      )}
      
      <Bouton 
        titre="Envoyer ma candidature" 
        onPress={handleSubmit} 
        style={styles.submitButton}
      />
    </ScrollView>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 5,
  },
  company: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  fileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 10,
    marginBottom: 15,
  },
  fileButtonText: {
    marginLeft: 10,
    fontSize: 16,
  },
  questionContainer: {
    marginBottom: 15,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
  },
  input: {
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  aiButtonText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '500',
  },
  aiInfoContainer: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  submitButton: {
    marginBottom: 30,
  }
});