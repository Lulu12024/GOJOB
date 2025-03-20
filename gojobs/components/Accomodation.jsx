import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomCheckbox from './CustomCheckbox'; // Assurez-vous que CustomCheckbox est bien importé

export default function Accomodation({ selectedOptions, setSelectedOptions, errors, touched }) {
  
  const toggleOption = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((item) => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  return (
    <View>
      <Text style={styles.sectionTitle}>Accomodation</Text>

      <View style={styles.checkboxGroup}>
        <CustomCheckbox
          label="Pas d'accomodation"
          value={selectedOptions.includes('Pas d\'accomodation')}
          onValueChange={() => toggleOption('Pas d\'accomodation')}
        />
        <CustomCheckbox
          label="Accomodation"
          value={selectedOptions.includes('Accomodation')}
          onValueChange={() => toggleOption('Accomodation')}
        />
        <CustomCheckbox
          label="Chiens acceptés"
          value={selectedOptions.includes('Chiens acceptés')}
          onValueChange={() => toggleOption('Chiens acceptés')}
        />
        <CustomCheckbox
          label="Enfants acceptés"
          value={selectedOptions.includes('Enfants acceptés')}
          onValueChange={() => toggleOption('Enfants acceptés')}
        />
        <CustomCheckbox
          label="Logement adapté (pour les personnes à mobilité réduite)"
          value={selectedOptions.includes('Logement adapté')}
          onValueChange={() => toggleOption('Logement adapté')}
        />
      </View>
      {errors.accommodationOptions && touched.accommodationOptions && (
        <Text style={styles.errorText}>{errors.accommodationOptions}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  checkboxGroup: {
    marginBottom: 10,
  },
  errorText: {
    color: "red",
    fontSize: 15,
    marginBottom: 10,
  },
});
