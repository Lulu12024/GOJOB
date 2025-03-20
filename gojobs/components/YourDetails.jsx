import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';

export default function YourDetails({ contactName, setContactName, location, setLocation, phoneNumber, setPhoneNumber, errors, touched }) {
  return (
    <View>
      <Text style={styles.sectionTitle}>Your details</Text>

      <View style={styles.inputGroup}>
        <TextInput
          style={styles.input}
          placeholder="Contact name"
          placeholderTextColor="#666"
          value={contactName} // Affiche la valeur actuelle du nom du contact
          onChangeText={setContactName} // Met à jour la valeur du nom du contact
        />
        {errors.contactName && touched.contactName && (
          <Text style={styles.errorText}>{errors.contactName}</Text>
        )}
        <TextInput
          style={styles.input}
          placeholder="Location"
          placeholderTextColor="#666"
          value={location} // Affiche la valeur actuelle de la localisation
          onChangeText={setLocation} // Met à jour la localisation

        />
        {errors.location && touched.location && (
          <Text style={styles.errorText}>{errors.location}</Text>
        )}
        <TextInput
          style={styles.input}
          placeholder="Phone number"
          placeholderTextColor="#666"
          keyboardType="phone-pad"

          value={phoneNumber} // Affiche la valeur actuelle du numéro de téléphone
          onChangeText={setPhoneNumber} // Met à jour le numéro de téléphone
        />
        {errors.phoneNumber && touched.phoneNumber && (
          <Text style={styles.errorText}>{errors.phoneNumber}</Text>
        )}
      </View>
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
  inputGroup: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 10,
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 16,
  },
  errorText: {
    color: "red",
    fontSize: 15,
    marginBottom: 10,
  },
});
