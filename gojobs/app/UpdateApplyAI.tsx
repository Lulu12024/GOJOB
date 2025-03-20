import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function UpdateApplyAI() {
  const [category, setCategory] = useState('');
  const [salaryRange, setSalaryRange] = useState('');
  const [filter, setFilter] = useState('');
  const [excludedCompany, setExcludedCompany] = useState('');
  const [notificationTime, setNotificationTime] = useState('');

  const handleSubmit = () => {
    const formData = {
      category,
      salaryRange,
      filter,
      excludedCompany,
      notificationTime,
    };

    Alert.alert('Form Data', JSON.stringify(formData, null, 2));
  };
  const router = useRouter();

  

  return (
    <View style={styles.container}>
        
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>ApplyAI</Text>
      </View>

      <View style={styles.form}>
        {/* Catégorie recherchée */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Catégorie recherchée</Text>
          <View style={styles.pickerWrapper}>
 <Picker
            selectedValue={category}
            onValueChange={(itemValue) => setCategory(itemValue)}
            style={styles.picker}
            dropdownIconColor="#fff"
          >
            <Picker.Item label="Sélectionnez une catégorie" value="" />
            <Picker.Item label="Informatique" value="informatique" />
            <Picker.Item label="Santé" value="santé" />
            <Picker.Item label="Commerce" value="commerce" />
          </Picker>
          </View>
         
        </View>

        {/* Tranche de salaire souhaitée */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tranche de salaire souhaitée</Text>
          <View style={styles.pickerWrapper}>
<Picker
            selectedValue={salaryRange}
            onValueChange={(itemValue) => setSalaryRange(itemValue)}
            style={styles.picker}
            dropdownIconColor="#fff"
          >
            <Picker.Item label="Sélectionnez une tranche" value="" />
            <Picker.Item label="20k-30k" value="20k-30k" />
            <Picker.Item label="30k-40k" value="30k-40k" />
            <Picker.Item label="40k-50k" value="40k-50k" />
          </Picker>
          </View>
          
        </View>

        {/* Filtre souhaité */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Filtre souhaité</Text>
          <View style={styles.pickerWrapper}>
 <Picker
            selectedValue={filter}
            onValueChange={(itemValue) => setFilter(itemValue)}
            style={styles.picker}
            dropdownIconColor="#fff"
          >
            <Picker.Item label="Sélectionnez un filtre" value="" />
            <Picker.Item label="Temps plein" value="temps_plein" />
            <Picker.Item label="Temps partiel" value="temps_partiel" />
            <Picker.Item label="Télétravail" value="télétravail" />
          </Picker>
          </View>
         
        </View>

        {/* Société non désirée */}
       {/* Société non désirée */}
<View style={styles.inputContainer}>
  <View style={styles.labelWithImage}>
    <Text style={styles.label}>Société non désirée</Text>
    <Image 
      source={require('@/assets/images/Info.png')} 
      style={styles.imageIcon} 
    />
  </View>
  <TextInput
    style={styles.textInput}
    placeholder="Saisir une société"
    placeholderTextColor="#888"
    value={excludedCompany}
    onChangeText={(text) => setExcludedCompany(text)}
  />
</View>


        {/* Heure de notification */}
        <View style={styles.inputContainer}>
          <View style={styles.labelWithImage}>
          <Text style={styles.label}>Heure de notification</Text>
          <Image 
      source={require('@/assets/images/Info.png')} 
      style={styles.imageIcon} 
    />
          </View>
          
          <TextInput
            style={styles.textInput}
            placeholder="Ex: 08:30"
            placeholderTextColor="#888"
            value={notificationTime}
            onChangeText={(text) => setNotificationTime(text)}
          />
        </View>

        <View style={styles.buttonContainer}>
        <TouchableOpacity 
    style={[styles.button, styles.desabonnerButton]} 
    onPress={() => {
      router.push({
        pathname: '/paramCand',
      });
    }}>
    <Text style={styles.buttonText}>Désabonner</Text>
  </TouchableOpacity>
  <TouchableOpacity 
    style={styles.button} 
    onPress={() => {
      const formData = {
        category,
        salaryRange,
        filter,
        excludedCompany,
        notificationTime,
      };
      router.push({
        pathname: '/ConfirmationPage',
        params: formData,
      });
    }}>
    <Text style={styles.buttonText}>Continuer</Text>
  </TouchableOpacity>

  
</View>

        

      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1D222B',
    padding: 16,
  },
  labelWithImage: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageIcon: {
    width: 20, // Largeur de l'image
    height: 20, // Hauteur de l'image
    marginLeft: 5, // Espacement entre le texte et l'image
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  form: {
    flex: 1,
    borderRadius: 25,
    
  },
  pickerWrapper: {
    backgroundColor: '#2F2F2F',
    borderRadius: 25, // Ajoute les coins arrondis
    overflow: 'hidden', // Assure que le contenu reste à l'intérieur des bords
  },
  
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
  },
  picker: {
    backgroundColor: '#2F2F2F',
    color: '#fff',
    borderRadius: 25,
    padding: 10,
  },
  textInput: {
    backgroundColor: '#2F2F2F',
    color: '#fff',
    borderRadius: 25,
    padding: 10,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row', // Organise les boutons côte à côte
    justifyContent: 'space-between', // Ajoute de l'espace entre les boutons
    marginTop: 20, // Espacement par rapport au contenu au-dessus
  },
  button: {
    backgroundColor: '#0E365B',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1, // Permet aux boutons de prendre un espace égal
    marginHorizontal: 5, // Ajoute un espacement entre les boutons
  },
  desabonnerButton: {
    backgroundColor: '#FF3A2F9E', // Couleur différente pour le bouton "Désabonner"
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
