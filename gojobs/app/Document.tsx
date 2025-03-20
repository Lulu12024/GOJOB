import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Données des fiches de paye
const contrat = [
  { id: '1', name: 'amazon', filePath: '../assets/lettre.pdf' },
  { id: '2', name: 'électricité', filePath: '../assets/lettre.pdf' },
  { id: '3', name: 'médecin', filePath: '../assets/lettre.pdf' },
  { id: '4', name: 'médecin', filePath: '../assets/lettre.pdf' },
];

const Document = () => {
  const router = useRouter(); // Déplacement de `useRouter` à l'intérieur du composant fonctionnel

  // Fonction pour ouvrir le fichier PDF
  const openPDF = (filePath) => {
    // Ajoutez ici la logique pour ouvrir le fichier PDF
    console.log('Open PDF:', filePath);
  };

  // Fonction pour rendre chaque fiche de paye
  const renderContract = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => openPDF(item.filePath)}>
      <View style={styles.pdfThumbnail}>
        <Ionicons name="document-text-outline" size={50} color="#FFF" />
      </View>
      <Text style={styles.cardTitle}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* En-tête */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Document</Text>
        <TouchableOpacity onPress={() => console.log('Settings')}>
          <Ionicons name="settings-outline" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Liste des fiches de paye */}
      <FlatList
        data={contrat}
        keyExtractor={(item) => item.id}
        renderItem={renderContract}
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
    justifyContent: 'space-between',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  listContainer: {
    padding: 16,
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

export default Document;
