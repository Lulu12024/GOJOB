// Importez MaterialIcons et autres dépendances
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, TextInput } from 'react-native';

export default function Filter({ visible, onClose, onSelectFilter }) {
  const sections = [
    // Sections existantes
    {
      title: 'Niveau d’expériences',
      options: ['Débutant', 'Alternant', 'Expérimenté'],
    },
    {
      title: 'Situation de résidence',
      options: ['Résident permanent', 'Visa étudiant', 'Visa de travail', 'Travailleur international à distance'],
    },
    {
      title: 'Accomodation',
      options: [
        'Hébergement fourni',
        'Enfant accepté',
        'Logement adapté pour personnes à mobilité réduite',
        'Animaux accepté',
      ],
    },
    {
      title: 'Personne en situation de handicaps',
      options: [
        'Personne avec mobilité réduite nécessitant des adaptations légères',
        'Personne avec prothèse fonctionnelle (aucune adaptation nécessaire)',
        'Personne avec handicap auditif léger ou trouble léger de la vision ou de la locution',
        'Personne en fauteuil roulant avec adaptations nécessaires',
      ],
    },
  ];

  // Gestion des options sélectionnées
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [salaryRange, setSalaryRange] = useState({ min: '', max: '' });
  const [extraOptions, setExtraOptions] = useState([]);

  const toggleFilter = (option) => {
    setSelectedFilters((prev) =>
      prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
    );
  };

  const toggleExtraOption = (option) => {
    setExtraOptions((prev) =>
      prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
    );
  };

  const clearAllFilters = () => {
    setSelectedFilters([]);
    setSalaryRange({ min: '', max: '' });
    setExtraOptions([]);
  };

  const handleApplyFilters = () => {
    const allFilters = {
      selectedFilters,
      salaryRange,
      extraOptions,
    };
    onSelectFilter(allFilters); // Passe les filtres sélectionnés au parent
    onClose(); // Ferme le modal
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* En-tête */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Filtres</Text>
            <TouchableOpacity onPress={clearAllFilters} style={styles.clearAllButton}>
              <Text style={styles.clearText}>Clear All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView>
            {/* Section Salaire */}
            

            

            {/* Sections existantes */}
            {sections.map((section, sectionIndex) => (
              <View key={sectionIndex} style={styles.section}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                {section.options.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.filterItem}
                    onPress={() => toggleFilter(option)}
                  >
                    <View style={styles.radioButton}>
                      {selectedFilters.includes(option) && <View style={styles.radioInner} />}
                    </View>
                    <Text style={styles.filterText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}

<View style={styles.section}>
              <Text style={styles.sectionTitle}>Salaire</Text>
              <View style={styles.salaryContainer}>
                <TextInput
                  style={styles.salaryInput}
                  placeholder="$ Min"
                  placeholderTextColor="#888"
                  keyboardType="numeric"
                  value={salaryRange.min}
                  onChangeText={(text) => setSalaryRange((prev) => ({ ...prev, min: text }))}
                />
                <TextInput
                  style={styles.salaryInput}
                  placeholder="$ Max"
                  placeholderTextColor="#888"
                  keyboardType="numeric"
                  value={salaryRange.max}
                  onChangeText={(text) => setSalaryRange((prev) => ({ ...prev, max: text }))}
                />
              </View>
            </View>

            {/* Section Autres */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Autres</Text>
              {['Voiture de fonction', 'Visa'].map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.filterItem}
                  onPress={() => toggleExtraOption(option)}
                >
                  <View style={styles.radioButton}>
                    {extraOptions.includes(option) && <View style={styles.radioInner} />}
                  </View>
                  <Text style={styles.filterText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>

          </ScrollView>

          {/* Bouton "GO" */}
          <TouchableOpacity onPress={handleApplyFilters} style={styles.applyButton}>
            <Text style={styles.applyButtonText}>GO</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// Styles
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#333',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  clearAllButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  clearText: {
    color: '#666666',
    fontSize: 14,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  filterText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  applyButton: {
    backgroundColor: '#0E365BBF',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  salaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  salaryInput: {
    flex: 1,
    backgroundColor: '#444',
    padding: 10,
    borderRadius: 10,
    color: '#FFFFFF',
    marginHorizontal: 5,
    textAlign: 'center',
  },
});
