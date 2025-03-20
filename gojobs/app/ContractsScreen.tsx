import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';


type contractItem = {
  id: string;
  name: string;
  filePath: string;
};

const contractScreen = () => {
  const [contract, setcontract] = useState<contractItem[]>([]);

  // Charger les fichiers depuis AsyncStorage
  useEffect(() => {
    const loadFiles = async () => {
      try {
        const storedFiles = await AsyncStorage.getItem('contract');
        if (storedFiles) {
          setcontract(JSON.parse(storedFiles));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des fichiers:', error);
      }
    };

    loadFiles();
  }, []);

  // Enregistrer les fichiers dans AsyncStorage
  const saveFiles = async (files: contractItem[]) => {
    try {
      await AsyncStorage.setItem('contract', JSON.stringify(files));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des fichiers:', error);
    }
  };

  // Sélectionner un fichier PDF
  const selectPDF = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const file = result.assets[0];
        const newFile: contractItem = {
          id: (contract.length + 1).toString(),
          name: file.name || 'Fichier sans nom',
          filePath: file.uri,
        };

        const updatedFiles = [...contract, newFile];
        setcontract(updatedFiles); // Met à jour l'état
        saveFiles(updatedFiles); // Sauvegarde dans AsyncStorage

        Alert.alert('Fichier ajouté', `Nom : ${file.name}`);
      } else {
        console.log('Sélection annulée');
      }
    } catch (error) {
      console.error('Erreur lors de la sélection du fichier:', error);
    }
  };

  const renderContract = ({ item }: { item: contractItem }) => (
    <View style={styles.card}>
      <View style={styles.pdfThumbnail}>
        <Ionicons name="document-text-outline" size={50} color="#FFF" />
      </View>
      <Text style={styles.cardTitle}>{item.name}</Text>
    </View>
  );
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* En-tête */}
      <View style={styles.header}>
         <TouchableOpacity onPress={() => router.back()}>
                  <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
        <Text style={styles.title}>Contrat</Text>
      </View>

      {/* Liste des fichiers */}
      <FlatList
        data={contract}
        keyExtractor={(item) => item.id}
        renderItem={renderContract}
        ListHeaderComponent={
          <TouchableOpacity style={styles.addButton} onPress={selectPDF}>
            <Ionicons name="add" size={50} color="#FFF" />
            <Text style={styles.addButtonText}>Ajouter un fichier</Text>
          </TouchableOpacity>
        }
        numColumns={2}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1D222B',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1D222B', // Fond du header
  },
  title: {
    flex: 1,
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#555555',
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 16,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 14,
    marginTop: 8,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  card: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#333333',
    margin: 8,
    borderRadius: 8,
    padding: 16,
  },
  pdfThumbnail: {
    width: 100,
    height: 150,
    backgroundColor: '#555555',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    color: '#FFF',
    textAlign: 'center',
  },
});

export default contractScreen;
