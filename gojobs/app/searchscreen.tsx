import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/header'; // Assure-toi que le chemin est correct
import Categories from '@/components/Categories'; // Assure-toi que le chemin est correct
import Filter from '@/components/Filter'; // Import du composant Filter
import Slider from '@react-native-community/slider'; // Fonctionne avec Expo
import { router } from 'expo-router';


export default function SearchScreen() {
  const [isCategoriesVisible, setCategoriesVisible] = useState(false);
  const [isFilterVisible, setFilterVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Any classification');
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);


  // Variables pour les critères de recherche
  const [keyword, setKeyword] = useState('');
  const [region, setRegion] = useState('');

  const handleSelectCategory = (categories) => {
    console.log('Categories received from modal:', categories);
    setSelectedCategory(categories.join(', ')); // Combiner les catégories sélectionnées dans une chaîne
    setCategoriesVisible(false); // Fermer la modal
  };


  const handleSelectFilter = (filter) => {
    setSelectedFilter(filter);
    setFilterVisible(false); // Fermer le modal après la sélection
  };

  // États pour les champs et options
  const [regionn, setRegionn] = useState('');
  const [distance, setDistance] = useState(50); // Distance par défaut : 50KM
  const [isRemote, setIsRemote] = useState(false); // Télétravail désactivé par défaut

  const handleSelectCountries = () => {
    Alert.alert('Pays ciblés', 'Fonctionnalité à implémenter pour choisir les pays.');
  };
  const handleSearch = () => {
    // Construire la chaîne de recherche
    const searchQuery = `Keyword: ${keyword}, Classification: ${selectedCategory}, Region: ${region}, Filter: ${selectedFilter || 'No filter'}`;

    // Ici tu peux appeler une fonction pour faire la recherche ou simplement afficher la query
    Alert.alert('Search Query', searchQuery); // Affiche la requête de recherche
  };

  return (
    <View style={styles.container}>
      <Header />

      {/* Champs de recherche */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>What</Text>
        <TextInput
          placeholder="Enter keywords"
          placeholderTextColor="#888"
          style={styles.input}
          value={keyword}
          onChangeText={setKeyword} // Stocker le mot-clé
        />
      </View>

      {/* Champ de classification qui ouvre la liste des catégories */}
      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={() => setCategoriesVisible(true)}>
          <TextInput
            value={selectedCategory}
            placeholder="Any classification"
            placeholderTextColor="#888"
            editable={false} // Désactivé pour rendre cliquable
            style={styles.input}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Where</Text>
        <TextInput
          placeholder="Enter suburb, city or region"
          placeholderTextColor="#888"
          style={styles.input}
          value={region}
          onChangeText={setRegion} // Stocker la région
        />
      </View>

      <View style={styles.distanceContainer}>
        <Text style={styles.inputLabel}>Distance</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={500} // Distance max : 500KM
          step={10} // Incrément de 10KM
          minimumTrackTintColor="#1EB1FC"
          maximumTrackTintColor="#D3D3D3"
          thumbTintColor="#1EB1FC"
          value={distance}
          onValueChange={setDistance}
        />
        <Text style={styles.distanceText}>{distance}KM</Text>
      </View>

      {/* Section Télétravail et Pays ciblés */}
      <View style={styles.optionsContainer}>
        <View style={styles.remoteContainer}>
          <Text style={styles.inputLabel}>Télétravail</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#3FF876FF' }}
            thumbColor={isRemote ? '#FFFFFF' : '#f4f3f4'}
            onValueChange={setIsRemote}
            value={isRemote}
          />
        </View>
        <TouchableOpacity style={styles.countriesButton} onPress={handleSelectCountries}>
          <Text style={styles.countriesButtonText}>Pays ciblés</Text>
        </TouchableOpacity>
      </View>


      {/* Conteneur pour l'icône de filtre et le bouton GO sur la même ligne */}
      <View style={styles.rowContainer}>
        <TouchableOpacity onPress={() => setFilterVisible(true)}>
          <Ionicons name="options-outline" size={24} color="#FFFFFF" style={styles.filterIcon} />
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.goButton} onPress={handleSearch} >
          <Text style={styles.goButtonText}>GO</Text>
        </TouchableOpacity> */}

        <TouchableOpacity style={styles.goButton} onPress={() => router.push('../../result')} >
          <Text style={styles.goButtonText}>GO</Text>
        </TouchableOpacity>
      </View>

      {/* Modal pour les catégories */}
      <Categories
        visible={isCategoriesVisible}
        onClose={() => setCategoriesVisible(false)}
        onSelectCategories={handleSelectCategory}
      />

      {/* Modal pour les filtres */}
      <Filter
        visible={isFilterVisible}
        onClose={() => setFilterVisible(false)}
        onSelectFilter={handleSelectFilter}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1D222B', // Couleur de fond sombre
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  inputContainer: {
    marginBottom: 20,
  },
  distanceContainer: {
    marginBottom: 20,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  distanceText: {
    color: '#FFFFFF',
    textAlign: 'right',
    fontSize: 16,
    marginTop: -10,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  remoteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countriesButton: {
    backgroundColor: '#464649FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  countriesButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputLabel: {
    color: '#FFFFFF',
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    backgroundColor: '#2C2C2E',
    color: '#FFFFFF',
    borderRadius: 50,
    padding: 12,
    fontSize: 16,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    position: 'relative',
  },
  filterIcon: {
    position: 'absolute',
    left: -90, // Place l'icône à gauche
    padding: 10,
    borderRadius: 25,
    bottom: -18
  },
  goButton: {
    backgroundColor: '#0E365BBF', // Couleur du bouton "GO"
    borderRadius: 25,
    paddingVertical: 10, // Taille ajustée
    paddingHorizontal: 50, // Largeur ajustée pour correspondre à l'image
    alignItems: 'center',
    alignContent: 'center',
  },
  goButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
