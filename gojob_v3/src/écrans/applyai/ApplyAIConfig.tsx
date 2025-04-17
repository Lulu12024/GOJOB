import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../hooks/useTheme';
import Bouton from '../../components/communs/Bouton';
import { Picker } from '@react-native-picker/picker';
import DocumentPicker from 'react-native-document-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { updateApplyAiConfig } from '../../redux/slices/applyAiSlice';
import { AppDispatch } from '../../redux/store'; // Importez AppDispatch

export const ApplyAIConfig: React.FC = () => {
  const theme = useTheme(); // Utilisez le thème sans déstructuration
  const dispatch = useDispatch<AppDispatch>(); // Typez correctement le dispatch
  const { config, loading } = useSelector((state: any) => state.applyAi);
  const { user } = useSelector((state: any) => state.auth);
  
  const [categories, setCategories] = useState<string[]>(config?.categories || []);
  const [salary, setSalary] = useState<{min: string, max: string}>({
    min: config?.salary?.min?.toString() || '',
    max: config?.salary?.max?.toString() || ''
  });
  const [filters, setFilters] = useState({
    logement: config?.filters?.logement || false,
    vehicule: config?.filters?.vehicule || false,
    debutant: config?.filters?.debutant || true,
    visa: config?.filters?.visa || false
  });
  const [excludedCompanies, setExcludedCompanies] = useState<string>(
    config?.excludedCompanies?.join(', ') || ''
  );
  const [notificationTime, setNotificationTime] = useState<string>(
    config?.notificationTime || '21:00'
  );
  const [cv, setCV] = useState<any>(null);
  
  useEffect(() => {
    if (config) {
      setCategories(config.categories || []);
      setSalary({
        min: config.salary?.min?.toString() || '',
        max: config.salary?.max?.toString() || ''
      });
      setFilters({
        logement: config.filters?.logement || false,
        vehicule: config.filters?.vehicule || false,
        debutant: config.filters?.debutant || true,
        visa: config.filters?.visa || false
      });
      setExcludedCompanies(config.excludedCompanies?.join(', ') || '');
      setNotificationTime(config.notificationTime || '21:00');
    }
  }, [config]);
  
  const handleCategoryToggle = (category: string) => {
    if (categories.includes(category)) {
      setCategories(categories.filter(c => c !== category));
    } else {
      setCategories([...categories, category]);
    }
  };
  
  const handleFilterToggle = (filter: keyof typeof filters) => {
    setFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
  };
  
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
  
  const handleSave = () => {
    const formData = new FormData();
    
    formData.append('categories', JSON.stringify(categories));
    formData.append('salary', JSON.stringify({
      min: parseInt(salary.min) || 0,
      max: parseInt(salary.max) || 0
    }));
    formData.append('filters', JSON.stringify(filters));
    formData.append('excludedCompanies', JSON.stringify(
      excludedCompanies.split(',').map(company => company.trim()).filter(company => company)
    ));
    formData.append('notificationTime', notificationTime);
    
    if (cv) {
      formData.append('cv', {
        uri: cv.uri,
        type: cv.type,
        name: cv.name,
      });
    }
    
    dispatch(updateApplyAiConfig(formData));
    Alert.alert('Succès', 'Configuration ApplyAI mise à jour avec succès!');
  };
  
  const availableCategories = [
    'Services',
    'Restauration',
    'Commerce',
    'Hôtellerie',
    'Administration',
    'Informatique',
    'BTP',
    'Transport',
    'Santé',
    'Éducation',
    'Communication',
    'Industrie',
    'Agriculture',
    'Backpacker',
    'Freelance'
  ];
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.couleurs.FOND_SOMBRE }]}>
      <Text style={[styles.title, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>Configuration ApplyAI</Text>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>CV pour analyse</Text>
        <Text style={[styles.description, { color: theme.couleurs.TEXTE_SECONDAIRE }]}>
          ApplyAI utilise votre CV pour analyser vos compétences et trouver les meilleures offres d'emploi correspondantes.
        </Text>
        
        <TouchableOpacity 
          onPress={selectCV}
          style={[styles.cvButton, { borderColor: theme.couleurs.BORDURE }]}
        >
          <Icon name="document-outline" size={24} color={theme.couleurs.PRIMAIRE} />
          <Text style={[styles.cvButtonText, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>
            {cv ? cv.name : config?.cv ? 'CV actuel: CV_analyse.pdf' : 'Sélectionner votre CV'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>Catégories recherchées</Text>
        <Text style={[styles.description, { color: theme.couleurs.TEXTE_SECONDAIRE }]}>
          Sélectionnez les catégories d'emploi qui vous intéressent.
        </Text>
        
        <View style={styles.categoriesContainer}>
          {availableCategories.map(category => (
            <TouchableOpacity
              key={category}
              onPress={() => handleCategoryToggle(category)}
              style={[
                styles.categoryButton,
                categories.includes(category) 
                  ? { backgroundColor: theme.couleurs.PRIMAIRE } 
                  : { borderColor: theme.couleurs.BORDURE, borderWidth: 1 }
              ]}
            >
              <Text 
                style={[
                  styles.categoryText,
                  categories.includes(category) ? { color: 'white' } : { color: theme.couleurs.TEXTE_PRIMAIRE }
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>Fourchette de salaire</Text>
        <Text style={[styles.description, { color: theme.couleurs.TEXTE_SECONDAIRE }]}>
          Définissez votre fourchette de salaire souhaitée (mensuel).
        </Text>
        
        <View style={styles.salaryContainer}>
          <TextInput
            value={salary.min}
            onChangeText={(text) => setSalary(prev => ({ ...prev, min: text }))}
            placeholder="Min"
            keyboardType="numeric"
            style={[
              styles.salaryInput,
              { backgroundColor: theme.couleurs.FOND_SECONDAIRE, color: theme.couleurs.TEXTE_PRIMAIRE }
            ]}
            placeholderTextColor="#999"
          />
          
          <Text style={{ marginHorizontal: 10, color: theme.couleurs.TEXTE_PRIMAIRE }}>-</Text>
          
          <TextInput
            value={salary.max}
            onChangeText={(text) => setSalary(prev => ({ ...prev, max: text }))}
            placeholder="Max"
            keyboardType="numeric"
            style={[
              styles.salaryInput,
              { backgroundColor: theme.couleurs.FOND_SECONDAIRE, color: theme.couleurs.TEXTE_PRIMAIRE }
            ]}
            placeholderTextColor="#999"
          />
          
          <Text style={{ marginLeft: 10, color: theme.couleurs.TEXTE_PRIMAIRE }}>€ / mois</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>Filtres</Text>
        
        <View style={[styles.filterItem, { borderBottomColor: theme.couleurs.DIVIDER }]}>
          <Text style={[styles.filterLabel, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>Logement de fonction</Text>
          <Switch
            value={filters.logement}
            onValueChange={() => handleFilterToggle('logement')}
            trackColor={{ false: '#e0e0e0', true: `${theme.couleurs.PRIMAIRE}90` }}
            thumbColor={filters.logement ? theme.couleurs.PRIMAIRE : '#f4f3f4'}
          />
        </View>
        
        <View style={[styles.filterItem, { borderBottomColor: theme.couleurs.DIVIDER }]}>
          <Text style={[styles.filterLabel, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>Véhicule de fonction</Text>
          <Switch
            value={filters.vehicule}
            onValueChange={() => handleFilterToggle('vehicule')}
            trackColor={{ false: '#e0e0e0', true: `${theme.couleurs.PRIMAIRE}90` }}
            thumbColor={filters.vehicule ? theme.couleurs.PRIMAIRE : '#f4f3f4'}
          />
        </View>
        
        <View style={[styles.filterItem, { borderBottomColor: theme.couleurs.DIVIDER }]}>
          <Text style={[styles.filterLabel, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>Accepte les débutants</Text>
          <Switch
            value={filters.debutant}
            onValueChange={() => handleFilterToggle('debutant')}
            trackColor={{ false: '#e0e0e0', true: `${theme.couleurs.PRIMAIRE}90` }}
            thumbColor={filters.debutant ? theme.couleurs.PRIMAIRE : '#f4f3f4'}
          />
        </View>
        
        <View style={[styles.filterItem, { borderBottomColor: theme.couleurs.DIVIDER }]}>
          <Text style={[styles.filterLabel, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>Accepte les visas de travail</Text>
          <Switch
            value={filters.visa}
            onValueChange={() => handleFilterToggle('visa')}
            trackColor={{ false: '#e0e0e0', true: `${theme.couleurs.PRIMAIRE}90` }}
            thumbColor={filters.visa ? theme.couleurs.PRIMAIRE : '#f4f3f4'}
          />
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>Entreprises à exclure</Text>
        <Text style={[styles.description, { color: theme.couleurs.TEXTE_SECONDAIRE }]}>
          Entrez les noms des entreprises à exclure des résultats, séparés par des virgules.
        </Text>
        
        <TextInput
          value={excludedCompanies}
          onChangeText={setExcludedCompanies}
          placeholder="Ex: Amazon, H&M, ..."
          style={[
            styles.input,
            { backgroundColor: theme.couleurs.FOND_SECONDAIRE, color: theme.couleurs.TEXTE_PRIMAIRE }
          ]}
          placeholderTextColor="#999"
        />
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>Heure de notification</Text>
        <Text style={[styles.description, { color: theme.couleurs.TEXTE_SECONDAIRE }]}>
          Choisissez l'heure à laquelle vous souhaitez recevoir les notifications quotidiennes.
        </Text>
        
        <View style={[
          styles.pickerContainer,
          { backgroundColor: theme.couleurs.FOND_SECONDAIRE, borderColor: theme.couleurs.BORDURE }
        ]}>
          <Picker
            selectedValue={notificationTime}
            onValueChange={(value: string) => setNotificationTime(value)}
            style={{ color: theme.couleurs.TEXTE_PRIMAIRE }}
          >
            {Array.from({ length: 24 }, (_, i) => {
              const hour = i.toString().padStart(2, '0');
              return <Picker.Item key={hour} label={`${hour}:00`} value={`${hour}:00`} />;
            })}
          </Picker>
        </View>
      </View>
      
      <Bouton 
        titre="Enregistrer" 
        onPress={handleSave} 
        style={styles.saveButton}
        charge={loading} // Utiliser "charge" au lieu de "loading"
      />
      
      {!user.hasSubscription('apply_ai_pro') && (
        <TouchableOpacity style={[styles.upgradeButton, { backgroundColor: '#FFD700' }]}>
          <Text style={styles.upgradeText}>Passer à ApplyAI Pro pour plus de fonctionnalités</Text>
        </TouchableOpacity>
      )}
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
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    marginBottom: 15,
  },
  cvButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 10,
  },
  cvButtonText: {
    marginLeft: 10,
    fontSize: 16,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 14,
  },
  salaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  salaryInput: {
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    width: 100,
  },
  filterItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  filterLabel: {
    fontSize: 16,
  },
  input: {
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  pickerContainer: {
    borderRadius: 10,
    borderWidth: 1,
  },
  saveButton: {
    marginBottom: 20,
  },
  upgradeButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
  },
  upgradeText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  }
});