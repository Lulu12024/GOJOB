import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";

export default function Description({
  description,
  setDescription,
  errors,
  touched,
}) {
  return (
    <View>
      <Text style={styles.label}>Description</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, styles.textArea]}
          multiline={true}
          placeholder="Enter description"
          placeholderTextColor="#666"
          value={description} // Afficher la description actuelle
          onChangeText={setDescription} // Mettre à jour la description
        />
      </View>
      {errors.description && touched.description && (
        <Text style={styles.errorText}>{errors.description}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 10,
  },
  inputContainer: {
    backgroundColor: "#2C2C2E",
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
  },
  input: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  textArea: {
    height: 100,
  },
  errorText: {
    color: "red",
    fontSize: 15,
    marginBottom: 10,
  },
});
