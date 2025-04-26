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
  Image,
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
import { setEmplois, setChargement, ajouterFavori, retirerFavori } from '../../redux/slices/emploisSlice';
import CarteEmploi from '../../components/emplois/CarteEmploi';

type NavigationProp = NativeStackNavigationProp<AccueilNavigatorParamList>;

const Accueil: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  
  // States
  const [keywordSearch, setKeywordSearch] = useState('');
  const [categorySearch, setCategorySearch] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  
  // Redux state
  const { emplois, chargement, favoris } = useAppSelector(state => state.emplois);
  
  // Charger les emplois recommandés au chargement
  useEffect(() => {
    const fetchRecommendedJobs = async () => {
      try {
        dispatch(setChargement(true));
        const response = await jobsApi.getEmplois(1, 10);
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
        category: categorySearch,
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
  // const navigateToFilters = () => {
  //   navigation.navigate('FiltrageRecherche', {
  //     fromScreen: 'Accueil'
  //   });
  // };
  // Naviguer vers les filtres
  const navigateToFilters = () => {
    navigation.navigate('FiltrageRecherche', {
      filtres: {}, // Objet vide pour les filtres initiaux
      onApply: (nouveauxFiltres: any) => {
        // Fonction appelée lorsque l'utilisateur applique de nouveaux filtres
        // Vous pouvez utiliser ces filtres pour mettre à jour votre état ou naviguer vers les résultats
        navigation.navigate('ResultatsRecherche', {
          params: {
            ...nouveauxFiltres,
            keyword: keywordSearch,
            location: locationSearch
          }
        });
      }
    });
  };

  // Gérer le toggle des favoris
  const handleToggleFavorite = async (id: number) => {
    try {
      const estFavori = favoris.includes(id);
      
      // Optimistic UI update
      if (estFavori) {
        dispatch(retirerFavori(id));
      } else {
        dispatch(ajouterFavori(id));
      }
      
      // API call
      await jobsApi.toggleFavori(id);
    } catch (error) {
      console.error('Erreur lors de la gestion des favoris:', error);
    }
  };

  // Formatage de la date relative (ex: il y a 3m, il y a 2h, etc.)
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}j`;
    }
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.couleurs.FOND_SOMBRE }]}>
      <Header />
      
      <ScrollView style={styles.content}>
        <View style={styles.searchSection}>
          <Text style={[styles.label, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>What</Text>
          <TouchableOpacity 
            style={[styles.inputContainer, { backgroundColor: theme.couleurs.FOND_SECONDAIRE }]}
            onPress={navigateToSearch}
          >
            <TextInput
              style={[styles.input, { color: theme.couleurs.TEXTE_PRIMAIRE }]}
              placeholder="Enter keywords"
              placeholderTextColor={theme.couleurs.TEXTE_TERTIAIRE}
              value={keywordSearch}
              onChangeText={setKeywordSearch}
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.inputContainer, { backgroundColor: theme.couleurs.FOND_SECONDAIRE, marginTop: 12 }]}
            onPress={navigateToSearch}
          >
            <TextInput
              style={[styles.input, { color: theme.couleurs.TEXTE_PRIMAIRE }]}
              placeholder="Any classification"
              placeholderTextColor={theme.couleurs.TEXTE_TERTIAIRE}
              value={categorySearch}
              onChangeText={setCategorySearch}
            />
          </TouchableOpacity>
          
          <Text style={[styles.label, { color: theme.couleurs.TEXTE_PRIMAIRE, marginTop: 16 }]}>Where</Text>
          <TouchableOpacity 
            style={[styles.inputContainer, { backgroundColor: theme.couleurs.FOND_SECONDAIRE }]}
            onPress={navigateToSearch}
          >
            <TextInput
              style={[styles.input, { color: theme.couleurs.TEXTE_PRIMAIRE }]}
              placeholder="Enter suburb, city or region"
              placeholderTextColor={theme.couleurs.TEXTE_TERTIAIRE}
              value={locationSearch}
              onChangeText={setLocationSearch}
            />
          </TouchableOpacity>
          
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.filterButton, { backgroundColor: theme.couleurs.FOND_SECONDAIRE }]}
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
              renderItem={({ item }) => (
                <CarteEmploi
                  emploi={item}
                  isFavorite={favoris.includes(item.id)}
                  onFavorite={() => handleToggleFavorite(item.id)}
                />
              )}
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