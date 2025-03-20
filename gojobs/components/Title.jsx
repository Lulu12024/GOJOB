import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';

export default function Title({ title, setTitle, errors, touched }) {
  return (
    <View>
      <Text style={styles.label}>Title</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter title"
          placeholderTextColor="#666"
          value={title} // Liaison avec l'état du titre
          onChangeText={setTitle} // Mise à jour du titre lorsque l'utilisateur saisit du texte
        />
      </View>
      <View>
        {errors.title && touched.title && <Text style={styles.errorText}>{errors.title}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 10,
  },
  inputContainer: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 6,
    marginBottom: 4,
  },
  input: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    bottom: 15,
  },
  progressBar: {
    height: 4,
    width: 60,
    backgroundColor: '#00FF00',
    borderRadius: 2,
  },
  progressText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginLeft: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 15,
    marginBottom: 10,
  },
});
