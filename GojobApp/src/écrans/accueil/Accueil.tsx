// src/écrans/accueil/Accueil.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AccueilNavigatorParamList } from '../../types/navigation';
import { useTheme } from '../../hooks/useTheme';
import Header from '../../components/communs/Header';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// API
import jobsApi from '../../api/jobsApi';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setEmplois, setChargement } from '../../redux/slices/emploisSlice';
import { CarteOffre } from '../../components/CarteOffre';

type NavigationProp = NativeStackNavigationProp<AccueilNavigatorParamList>;

const Accueil: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  
  // States
  const [keywordSearch, setKeywordSearch] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  
  // Redux state
  const { emplois, chargement } = useAppSelector(state => state.emplois);
  
  // Charger les emplois recommandés au chargement
  useEffect(() => {
    const fetchRecommendedJobs = async () => {
      try {
        dispatch(setChargement(true));
        const response = await jobsApi.getEmplois(1, 5);
        dispatch(setEmplois(response.data));
      } catch (error) {
        console.error('Erreur lors du chargement des emplois recommandés:', error);
      } finally {
        dispatch(setChargement(false));
      }
    };
    
    fetchRecommendedJobs();
  }, [dispatch]);
  
  // Effectuer une recherche
  const handleSearch = () => {
    navigation.navigate('ResultatsRecherche', {
      params: {
        keyword: keywordSearch,
        location: locationSearch
      }
    });
  };

  // Naviguer vers l'écran de recherche
  const navigateToSearch = () => {
    navigation.navigate('Recherche', {
      keyword: keywordSearch,
      location: locationSearch
    });
  };
  
  // Naviguer vers les filtres
  const navigateToFilters = () => {
    navigation.navigate('FiltrageRecherche', {
      filtres: {},
      onApply: (nouveauxFiltres) => {
        console.log('Nouveaux filtres:', nouveauxFiltres);
      }
    });
  };

  // Rendu de la carte d'emploi
  const renderEmploiItem = ({ item }: any) => (
    <CarteOffre
      titre={item.title || item.titre}
      entreprise={item.company || item.entreprise}
      location={item.city || item.location}
      logo={item.logo || "https://example.com/placeholder.jpg"}
      timeAgo="3m"
      isUrgent={item.is_urgent || item.isUrgent}
      isNew={item.is_new || item.isNew}
      onPress={() => navigation.navigate('DetailEmploi', { id: item.id })}
      onFavoriteToggle={() => {}}
    />
  );
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.couleurs.FOND_SOMBRE }]}>
      <Header />
      
      <ScrollView style={styles.content}>
        <View style={styles.searchSection}>
          <Text style={[styles.label, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>What</Text>
          <View style={[styles.inputContainer, { backgroundColor: theme.couleurs.FOND_SECONDAIRE }]}>
            <TextInput
              style={[styles.input, { color: theme.couleurs.TEXTE_PRIMAIRE }]}
              placeholder="Enter keywords"
              placeholderTextColor={theme.couleurs.TEXTE_TERTIAIRE}
              value={keywordSearch}
              onChangeText={setKeywordSearch}
            />
          </View>
          
          <View style={[styles.inputContainer, { backgroundColor: theme.couleurs.FOND_SECONDAIRE, marginTop: 12 }]}>
            <TextInput
              style={[styles.input, { color: theme.couleurs.TEXTE_PRIMAIRE }]}
              placeholder="Any classification"
              placeholderTextColor={theme.couleurs.TEXTE_TERTIAIRE}
              onFocus={navigateToSearch}
            />
          </View>
          
          <Text style={[styles.label, { color: theme.couleurs.TEXTE_PRIMAIRE, marginTop: 16 }]}>Where</Text>
          <View style={[styles.inputContainer, { backgroundColor: theme.couleurs.FOND_SECONDAIRE }]}>
            <TextInput
              style={[styles.input, { color: theme.couleurs.TEXTE_PRIMAIRE }]}
              placeholder="Enter suburb, city or region"
              placeholderTextColor={theme.couleurs.TEXTE_TERTIAIRE}
              value={locationSearch}
              onChangeText={setLocationSearch}
            />
          </View>
          
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={navigateToFilters}
            >
              <Icon name="filter-variant" size={24} color={theme.couleurs.TEXTE_SECONDAIRE} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.goButton, { backgroundColor: theme.couleurs.PRIMAIRE }]}
              onPress={handleSearch}
            >
              <Text style={styles.goButtonText}>GO</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Section Emplois recommandés */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>
            Recommandation pour vous
          </Text>
          
          {chargement ? (
            <ActivityIndicator size="large" color={theme.couleurs.PRIMAIRE} />
          ) : (
            <FlatList
              data={emplois}
              renderItem={renderEmploiItem}
              keyExtractor={(item) => item.id.toString()}
              horizontal={false}
              scrollEnabled={false}
              nestedScrollEnabled={true}
              ListEmptyComponent={
                <Text style={[styles.emptyText, { color: theme.couleurs.TEXTE_SECONDAIRE }]}>
                  Aucune recommandation disponible pour le moment.
                </Text>
              }
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  searchSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  inputContainer: {
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 50,
    justifyContent: 'center',
  },
  input: {
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 16,
    alignItems: 'center',
  },
  filterButton: {
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  goButton: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  emptyText: {
    textAlign: 'center',
    padding: 20,
  }
});

export default Accueil;