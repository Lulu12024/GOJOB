import React, { useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, GestureResponderEvent } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  label: string;
  value: boolean;
  onValueChange: (label: string) => void;
};

export default function CustomCheckbox({ label, value, onValueChange }: Props) {
  return (
    <TouchableOpacity style={styles.container} onPress={() => onValueChange(label)}>
      <View style={[styles.checkbox, value && styles.checked]}>
        {value && <Ionicons name="checkmark" size={18} color="#FFFFFF" />}
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#888',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checked: {
    backgroundColor: '#00FF00', // Couleur lorsque la case est cochée
    borderColor: '#00FF00',
  },
  label: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});
