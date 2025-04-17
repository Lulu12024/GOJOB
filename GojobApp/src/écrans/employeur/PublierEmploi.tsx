import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { useTheme } from '../../hooks/useTheme';
import Bouton from '../../components/communs/Bouton';
import ChampTexte from '../../components/communs/ChampTexte';
import { launchImageLibrary } from 'react-native-image-picker';
import { Picker } from '@react-native-picker/picker';
// Si vous n'avez pas ce module, installez-le avec:
// npm install @react-native-community/checkbox
// ou
// yarn add @react-native-community/checkbox
import CheckBox from '@react-native-community/checkbox';
import { AppDispatch } from '../../redux/store';
import jobsApi, { PublicationEmploiPayload } from '../../api/jobsApi';

export const PublierEmploi: React.FC = () => {
  const theme = useTheme(); // Utilisez le thème correctement
  const dispatch = useDispatch<AppDispatch>();
  
  const [formData, setFormData] = useState({
    titre: '',
    categorie: '',
    description: '',
    photos: [] as string[],
    typeContrat: '',
    localisation: '',
    contactName: '',
    contactPhone: '',
    salaire: '',
    typeSalaire: 'mensuel', // "mensuel" ou "horaire"
    logement: false,
    logementEnfants: false,
    logementAnimaux: false,
    logementAdapte: false,
    vehicule: false,
    debutantAccepte: false,
    visaAccepte: false,
    etudiantAccepte: false,
    priorite: 'normale', // "normale", "urgente", "top"
  });
  
  const [step, setStep] = useState(1);
  
  const handleChangeText = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleToggle = (field: string, value: boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleAddPhotos = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 5,
      quality: 0.8,
    });
    
    if (result.assets && result.assets.length > 0) {
      const newPhotos = result.assets.map(asset => asset.uri).filter(uri => uri !== undefined) as string[];
      
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...newPhotos]
      }));
    }
  };
  
  // Fonction pour créer un emploi
  const createJob = async (data: typeof formData) => {
    try {
      // Convertir les données pour qu'elles correspondent à ce que votre API attend
      const payload: PublicationEmploiPayload = {
        title: data.titre,
        company: "Votre entreprise", // À adapter selon votre logique d'application
        location: data.localisation,
        description: data.description,
        contract_type: data.typeContrat as 'CDI' | 'CDD' | 'alternance' | 'freelance',
        salary: data.salaire ? {
          amount: parseFloat(data.salaire),
          period: data.typeSalaire === 'mensuel' ? 'month' : 'hour'
        } : undefined,
        accommodation: data.logement,
        accommodation_details: data.logement ? {
          children_allowed: data.logementEnfants,
          pets_allowed: data.logementAnimaux,
          accessible: data.logementAdapte
        } : undefined,
        // Convertir les photos si nécessaire
        photos: data.photos,
        is_urgent: data.priorite === 'urgente',
        contact_details: {
          name: data.contactName,
          phone: data.contactPhone,
          contact_methods: ['phone', 'message'], // Adapter selon vos besoins
        },
        working_rights: {
          entry_level: data.debutantAccepte,
          working_visa: data.visaAccepte,
          holiday_visa: false, // Ajouté pour correspondre au type attendu
          student_visa: data.etudiantAccepte
        }
      };
      
      await jobsApi.publierEmploi(payload);
      return true;
    } catch (error) {
      console.error('Erreur lors de la création de l\'emploi:', error);
      return false;
    }
  };
  
  const handleSubmit = async () => {
    const success = await createJob(formData);
    
    if (success) {
      Alert.alert('Succès', 'Votre offre d\'emploi a été publiée avec succès!', [
        { text: 'OK', onPress: () => {} }
      ]);
    } else {
      Alert.alert('Erreur', 'Une erreur est survenue lors de la publication de votre offre.', [
        { text: 'OK' }
      ]);
    }
  };
  
  const nextStep = () => {
    setStep(step + 1);
  };
  
  const prevStep = () => {
    setStep(step - 1);
  };
  
  const renderStep1 = () => (
    <View>
      <Text style={[styles.label, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>Titre du poste</Text>
      <ChampTexte
        value={formData.titre}
        onChangeText={(text) => handleChangeText('titre', text)}
        placeholder="Exemple: Paysagiste à Rennes"
      />
      
      <Text style={[styles.label, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>Catégorie</Text>
      <View style={[styles.pickerContainer, { backgroundColor: theme.couleurs.FOND_SECONDAIRE }]}>
        <Picker
          selectedValue={formData.categorie}
          onValueChange={(value: string) => handleChangeText('categorie', value)}
          style={{ color: theme.couleurs.TEXTE_PRIMAIRE }}
        >
          <Picker.Item label="Sélectionnez une catégorie" value="" />
          <Picker.Item label="Services" value="services" />
          <Picker.Item label="Restauration" value="restauration" />
          <Picker.Item label="Informatique" value="informatique" />
          <Picker.Item label="Vente" value="vente" />
          <Picker.Item label="Backpacker" value="backpacker" />
          <Picker.Item label="Freelance" value="freelance" />
        </Picker>
      </View>
      
      <Text style={[styles.label, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>Photos</Text>
      <Text style={[styles.tip, { color: theme.couleurs.TEXTE_SECONDAIRE }]}>Plus de photos attirent plus de candidatures</Text>
      
      <View style={styles.photosContainer}>
        <TouchableOpacity
          onPress={handleAddPhotos}
          style={[styles.addPhotoButton, { borderColor: theme.couleurs.BORDURE }]}
        >
          <Text style={{ color: theme.couleurs.TEXTE_PRIMAIRE }}>+ Ajouter photos</Text>
        </TouchableOpacity>
        
        {formData.photos.map((photo, index) => (
          <Image key={index} source={{ uri: photo }} style={styles.photoThumbnail} />
        ))}
      </View>
      
      <Text style={[styles.label, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>Description</Text>
      <TextInput
        value={formData.description}
        onChangeText={(text) => handleChangeText('description', text)}
        placeholder="Décrivez le poste, les responsabilités, les qualifications requises..."
        multiline
        numberOfLines={6}
        style={[styles.textArea, { backgroundColor: theme.couleurs.FOND_SECONDAIRE, color: theme.couleurs.TEXTE_PRIMAIRE }]}
        placeholderTextColor="#999"
      />
      
      <Bouton 
        titre="Continuer" 
        onPress={nextStep} 
        style={styles.button}
      />
    </View>
  );
  
  const renderStep2 = () => (
    <View>
      <Text style={[styles.label, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>Type de contrat</Text>
      <View style={[styles.pickerContainer, { backgroundColor: theme.couleurs.FOND_SECONDAIRE }]}>
        <Picker
          selectedValue={formData.typeContrat}
          onValueChange={(value: string) => handleChangeText('typeContrat', value)}
          style={{ color: theme.couleurs.TEXTE_PRIMAIRE }}
        >
          <Picker.Item label="Sélectionnez un type de contrat" value="" />
          <Picker.Item label="CDI" value="cdi" />
          <Picker.Item label="CDD" value="cdd" />
          <Picker.Item label="Alternance" value="alternance" />
          <Picker.Item label="Freelance" value="freelance" />
        </Picker>
      </View>
      
      <Text style={[styles.label, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>Localisation</Text>
      <ChampTexte
        value={formData.localisation}
        onChangeText={(text) => handleChangeText('localisation', text)}
        placeholder="Exemple: Rennes, Île-et-Vilaine"
      />
      
      <Text style={[styles.label, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>Salaire</Text>
      <View style={styles.salaryContainer}>
        <TextInput
          value={formData.salaire}
          onChangeText={(text) => handleChangeText('salaire', text)}
          placeholder="Montant"
          keyboardType="numeric"
          style={[styles.salaryInput, { backgroundColor: theme.couleurs.FOND_SECONDAIRE, color: theme.couleurs.TEXTE_PRIMAIRE }]}
          placeholderTextColor="#999"
        />
        
        <TouchableOpacity
          style={[
            styles.salaryTypeButton,
            formData.typeSalaire === 'mensuel' && { backgroundColor: theme.couleurs.PRIMAIRE }
          ]}
          onPress={() => handleChangeText('typeSalaire', 'mensuel')}
        >
          <Text
            style={[
              styles.salaryTypeText,
              formData.typeSalaire === 'mensuel' && { color: 'white' }
            ]}
          >
            /Mois
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.salaryTypeButton,
            formData.typeSalaire === 'horaire' && { backgroundColor: theme.couleurs.PRIMAIRE }
          ]}
          onPress={() => handleChangeText('typeSalaire', 'horaire')}
        >
          <Text
            style={[
              styles.salaryTypeText,
              formData.typeSalaire === 'horaire' && { color: 'white' }
            ]}
          >
            /Heure
          </Text>
        </TouchableOpacity>
      </View>
      
      <Text style={[styles.label, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>Vos coordonnées</Text>
      <ChampTexte
        value={formData.contactName}
        onChangeText={(text) => handleChangeText('contactName', text)}
        placeholder="Nom du contact"
      />
      <ChampTexte
        value={formData.contactPhone}
        onChangeText={(text) => handleChangeText('contactPhone', text)}
        placeholder="Numéro de téléphone"
        keyboardType="phone-pad"
      />
      
      <View style={styles.buttonsContainer}>
        <Bouton 
          titre="Retour" 
          onPress={prevStep} 
          variante="texte"
          style={{ marginRight: 10, flex: 1 }}
        />
        <Bouton 
          titre="Continuer" 
          onPress={nextStep} 
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
  
  const renderStep3 = () => (
    <View>
      <Text style={[styles.sectionTitle, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>Avantages & Exigences</Text>
      
      <Text style={[styles.label, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>Logement</Text>
      <View style={styles.checkboxRow}>
        <CheckBox
          value={formData.logement}
          onValueChange={(value) => handleToggle('logement', value)}
          tintColors={{ true: theme.couleurs.PRIMAIRE, false: theme.couleurs.TEXTE_TERTIAIRE }}
        />
        <Text style={[styles.checkboxLabel, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>Logement de fonction</Text>
      </View>
      
      {formData.logement && (
        <>
          <View style={styles.checkboxRow}>
            <CheckBox
              value={formData.logementEnfants}
              onValueChange={(value) => handleToggle('logementEnfants', value)}
              tintColors={{ true: theme.couleurs.PRIMAIRE, false: theme.couleurs.TEXTE_TERTIAIRE }}
            />
            <Text style={[styles.checkboxLabel, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>Enfants acceptés</Text>
          </View>
          
          <View style={styles.checkboxRow}>
            <CheckBox
              value={formData.logementAnimaux}
              onValueChange={(value) => handleToggle('logementAnimaux', value)}
              tintColors={{ true: theme.couleurs.PRIMAIRE, false: theme.couleurs.TEXTE_TERTIAIRE }}
            />
            <Text style={[styles.checkboxLabel, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>Animaux acceptés</Text>
          </View>
          
          <View style={styles.checkboxRow}>
            <CheckBox
              value={formData.logementAdapte}
              onValueChange={(value) => handleToggle('logementAdapte', value)}
              tintColors={{ true: theme.couleurs.PRIMAIRE, false: theme.couleurs.TEXTE_TERTIAIRE }}
            />
            <Text style={[styles.checkboxLabel, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>Adapté aux personnes à mobilité réduite</Text>
          </View>
        </>
      )}
      
      <View style={styles.checkboxRow}>
        <CheckBox
          value={formData.vehicule}
          onValueChange={(value) => handleToggle('vehicule', value)}
          tintColors={{ true: theme.couleurs.PRIMAIRE, false: theme.couleurs.TEXTE_TERTIAIRE }}
        />
        <Text style={[styles.checkboxLabel, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>Véhicule de fonction</Text>
      </View>
      
      <Text style={[styles.label, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>Critères d'acceptation</Text>
      <View style={styles.checkboxRow}>
        <CheckBox
          value={formData.debutantAccepte}
          onValueChange={(value) => handleToggle('debutantAccepte', value)}
          tintColors={{ true: theme.couleurs.PRIMAIRE, false: theme.couleurs.TEXTE_TERTIAIRE }}
        />
        <Text style={[styles.checkboxLabel, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>Débutant accepté</Text>
      </View>
      
      <View style={styles.checkboxRow}>
        <CheckBox
          value={formData.visaAccepte}
          onValueChange={(value) => handleToggle('visaAccepte', value)}
          tintColors={{ true: theme.couleurs.PRIMAIRE, false: theme.couleurs.TEXTE_TERTIAIRE }}
        />
        <Text style={[styles.checkboxLabel, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>Visa de travail / PVT accepté</Text>
      </View>
      
      <View style={styles.checkboxRow}>
        <CheckBox
          value={formData.etudiantAccepte}
          onValueChange={(value) => handleToggle('etudiantAccepte', value)}
          tintColors={{ true: theme.couleurs.PRIMAIRE, false: theme.couleurs.TEXTE_TERTIAIRE }}
        />
        <Text style={[styles.checkboxLabel, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>Visa étudiant accepté</Text>
      </View>
      
      <Text style={[styles.label, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>Visibilité de l'annonce</Text>
      
      <View style={styles.priorityContainer}>
        <TouchableOpacity
          style={[
            styles.priorityButton,
            formData.priorite === 'urgente' && { borderColor: theme.couleurs.ERREUR, backgroundColor: `${theme.couleurs.ERREUR}20` }
          ]}
          onPress={() => handleChangeText('priorite', 'urgente')}
        >
          <Text style={[styles.priorityLabel, { color: theme.couleurs.ERREUR }]}>URGENT</Text>
          <Text style={[styles.priorityPrice, { color: theme.couleurs.TEXTE_SECONDAIRE }]}>3 € / jour</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.priorityButton,
            formData.priorite === 'top' && { borderColor: theme.couleurs.PRIMAIRE, backgroundColor: `${theme.couleurs.PRIMAIRE}20` }
          ]}
          onPress={() => handleChangeText('priorite', 'top')}
        >
          <Text style={[styles.priorityLabel, { color: theme.couleurs.PRIMAIRE }]}>TOP</Text>
          <Text style={[styles.priorityPrice, { color: theme.couleurs.TEXTE_SECONDAIRE }]}>2 € / jour</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.priorityButton,
            formData.priorite === 'nouvelle' && { borderColor: theme.couleurs.NOUVELLE, backgroundColor: `${theme.couleurs.NOUVELLE}20` }
          ]}
          onPress={() => handleChangeText('priorite', 'nouvelle')}
        >
          <Text style={[styles.priorityLabel, { color: theme.couleurs.NOUVELLE }]}>NEW</Text>
          <Text style={[styles.priorityPrice, { color: theme.couleurs.TEXTE_SECONDAIRE }]}>1,50 € / jour</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={[styles.totalPrice, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>Total: 23,99 € / Semaine</Text>
      
      <View style={styles.buttonsContainer}>
        <Bouton 
          titre="Retour" 
          onPress={prevStep} 
          variante="texte"
          style={{ marginRight: 10, flex: 1 }}
        />
        <Bouton 
          titre="Publier" 
          onPress={handleSubmit} 
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.couleurs.FOND_SOMBRE }]}>
      <Text style={[styles.title, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>Publier une offre d'emploi</Text>
      
      <View style={styles.stepper}>
        <View style={[styles.stepCircle, step >= 1 && { backgroundColor: theme.couleurs.PRIMAIRE }]}>
          <Text style={step >= 1 ? styles.activeStepText : [styles.stepText, { color: theme.couleurs.TEXTE_SECONDAIRE }]}>1</Text>
        </View>
        <View style={[styles.stepLine, { backgroundColor: theme.couleurs.BORDURE }]} />
        <View style={[styles.stepCircle, step >= 2 && { backgroundColor: theme.couleurs.PRIMAIRE }]}>
          <Text style={step >= 2 ? styles.activeStepText : [styles.stepText, { color: theme.couleurs.TEXTE_SECONDAIRE }]}>2</Text>
        </View>
        <View style={[styles.stepLine, { backgroundColor: theme.couleurs.BORDURE }]} />
        <View style={[styles.stepCircle, step >= 3 && { backgroundColor: theme.couleurs.PRIMAIRE }]}>
          <Text style={step >= 3 ? styles.activeStepText : [styles.stepText, { color: theme.couleurs.TEXTE_SECONDAIRE }]}>3</Text>
        </View>
      </View>
      
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepLine: {
    height: 2,
    width: 50,
    backgroundColor: '#e0e0e0',
  },
  stepText: {
    color: '#666',
  },
  activeStepText: {
    color: 'white',
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  pickerContainer: {
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  photosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  addPhotoButton: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 10,
  },
  photoThumbnail: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  textArea: {
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  tip: {
    fontSize: 12,
    marginBottom: 10,
    fontStyle: 'italic',
  },
  button: {
    marginBottom: 20,
  },
  salaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  salaryInput: {
    flex: 1,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginRight: 10,
  },
  salaryTypeButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginRight: 10,
  },
  salaryTypeText: {
    color: '#666',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkboxLabel: {
    marginLeft: 10,
    fontSize: 16,
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  priorityButton: {
    width: '30%',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  priorityLabel: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  priorityPrice: {
    fontSize: 12,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  }
});