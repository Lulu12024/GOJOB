import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  RefreshControl,
  ActivityIndicator,
  Platform,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AccueilNavigatorParamList } from '../../types/navigation';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { useTheme } from '../../hooks/useTheme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Components
import BarreRecherche from '../../components/communs/BarreRecherche';
import CarteEmploi from '../../components/emplois/CarteEmploi';

// Redux actions
import {
  setEmplois,
  ajouterEmplois,
  setFavoris,
  ajouterFavori,
  retirerFavori,
  setChargement,
  setPage,
  setTotalPages,
} from '../../redux/slices/emploisSlice';

// API
import jobsApi from '../../api/jobsApi';
import { TextStyle } from 'react-native';

type NavigationProp = NativeStackNavigationProp<AccueilNavigatorParamList, 'ListeEmplois'>;

const ListeEmplois: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();
  
  // Redux state
  const { emplois, favoris, chargement, page, totalPages } = useAppSelector(state => state.emplois);
  const { utilisateur } = useAppSelector(state => state.auth);
  
  // Local state
  const [rafraichissement, setRafraichissement] = useState(false);
  const [chargementPlus, setChargementPlus] = useState(false);
  const [termeRecherche, setTermeRecherche] = useState('');
  
  // Charger la liste initiale des emplois
  const chargerEmplois = useCallback(async () => {
    try {
      dispatch(setChargement(true));
      dispatch(setPage(1));
      
      const response = await jobsApi.getEmplois(1, 20);
      dispatch(setEmplois(response.data));
      dispatch(setTotalPages(response.meta.last_page));
      
      // Charger également les favoris
      await chargerFavoris();
    } catch (error) {
      console.error('Erreur lors du chargement des emplois :', error);
    } finally {
      dispatch(setChargement(false));
    }
  }, [dispatch]);
  
  // Charger les favoris de l'utilisateur
  const chargerFavoris = async () => {
    try {
      const favorisData = await jobsApi.getFavoris();
      dispatch(setFavoris(favorisData.map(favori => favori.id)));
    } catch (error) {
      console.error('Erreur lors du chargement des favoris :', error);
    }
  };
  
  // Charger plus d'emplois (pagination)
  const chargerPlusEmplois = async () => {
    // Si on est déjà à la dernière page ou en cours de chargement, ne rien faire
    if (page >= totalPages || chargement || chargementPlus) return;
    
    try {
      setChargementPlus(true);
      const nouvellePage = page + 1;
      
      const response = await jobsApi.getEmplois(nouvellePage, 20);
      dispatch(ajouterEmplois(response.data));
      dispatch(setPage(nouvellePage));
    } catch (error) {
      console.error('Erreur lors du chargement des emplois supplémentaires :', error);
    } finally {
      setChargementPlus(false);
    }
  };
  
  // Rafraîchir la liste des emplois
  const rafraichirEmplois = async () => {
    setRafraichissement(true);
    await chargerEmplois();
    setRafraichissement(false);
  };
  
  // Gérer le toggle des favoris
  const gererFavori = async (id: number) => {
    try {
      // Optimistic UI update
      if (favoris.includes(id)) {
        dispatch(retirerFavori(id));
      } else {
        dispatch(ajouterFavori(id));
      }
      
      // API call
      await jobsApi.toggleFavori(id);
    } catch (error) {
      console.error('Erreur lors de la gestion des favoris :', error);
      
      // Rollback en cas d'erreur
      if (favoris.includes(id)) {
        dispatch(ajouterFavori(id));
      } else {
        dispatch(retirerFavori(id));
      }
    }
  };
  
  // Naviguer vers l'écran de recherche
  const allerVersRecherche = () => {
    navigation.navigate('Recherche', {});
  };
  
  // Naviguer vers le détail d'un emploi
  const allerVersDetailEmploi = (id: number) => {
    navigation.navigate('DetailEmploi', { id });
  };
  
  // Hook d'effet pour charger les emplois au premier rendu
  useEffect(() => {
    chargerEmplois();
  }, [chargerEmplois]);
  
  // Hook pour rafraîchir les données lorsque l'écran est de nouveau en focus
  useFocusEffect(
    useCallback(() => {
      chargerFavoris();
    }, [])
  );
  
  // Rendu du footer de la FlatList (indicateur de chargement pour "charger plus")
  const renderFooter = () => {
    if (!chargementPlus) return null;
    
    return (
      <View style={styles.footerChargement}>
        <ActivityIndicator size="small" color={theme.couleurs.PRIMAIRE} />
        <Text style={[styles.texteChargement, { color: theme.couleurs.TEXTE_SECONDAIRE }]}>
          Chargement...
        </Text>
      </View>
    );
  };
  
  // Rendu d'un élément de la liste
  const renderEmploi = ({ item }: { item: any }) => {
    return (
      <CarteEmploi
        emploi={item}
        isFavorite={favoris.includes(item.id)}
        onFavorite={() => gererFavori(item.id)}
      />
    );
  };
  
  // Rendu du header de la liste avec les sections recommandées, etc.
  const renderHeader = () => {
    return (
      <View style={styles.header}>
        {/* Barre de recherche */}
        <TouchableOpacity
          style={[
            styles.barreRechercheContainer,
            {
              backgroundColor: theme.couleurs.FOND_SECONDAIRE,
              borderRadius: theme.bordures.RADIUS_MOYEN,
              ...theme.ombres.LEGERE,
            },
          ]}
          onPress={allerVersRecherche}
          activeOpacity={0.7}
        >
          <Icon name="magnify" size={22} color={theme.couleurs.TEXTE_SECONDAIRE} />
          <Text
            style={[
              styles.placeholderRecherche,
              { color: theme.couleurs.TEXTE_TERTIAIRE },
            ]}
          >
            Rechercher un emploi...
          </Text>
        </TouchableOpacity>
        
        {/* Section "Recommandé pour vous" */}
        <View style={styles.sectionTitre}>
          <Text
            style={[
              styles.titrePrincipal,
              {
                color: theme.couleurs.TEXTE_PRIMAIRE,
                fontSize: theme.typographie.TAILLES.GRAND,
                fontWeight: theme.typographie.POIDS.GRAS as TextStyle['fontWeight'],
              },
            ]}
          >
            Recommandé pour vous
          </Text>
        </View>
      </View>
    );
  };
  
  // Contenu principal
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.couleurs.FOND_SOMBRE }]}>
      <StatusBar
        barStyle={Platform.OS === 'ios' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.couleurs.FOND_SOMBRE}
      />
      
      {/* Liste des offres d'emploi */}
      <FlatList
        data={emplois}
        renderItem={renderEmploi}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        onEndReached={chargerPlusEmplois}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={rafraichissement}
            onRefresh={rafraichirEmplois}
            colors={[theme.couleurs.PRIMAIRE]}
            tintColor={theme.couleurs.PRIMAIRE}
            progressBackgroundColor={theme.couleurs.FOND_SECONDAIRE}
          />
        }
      />
      
      {/* Indicateur de chargement initial */}
      {chargement && !rafraichissement && (
        <View style={[styles.chargementOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
          <ActivityIndicator size="large" color={theme.couleurs.PRIMAIRE} />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  header: {
    paddingTop: 8,
    marginBottom: 16,
  },
  barreRechercheContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  placeholderRecherche: {
    marginLeft: 8,
    fontSize: 16,
  },
  sectionTitre: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  titrePrincipal: {
    marginBottom: 8,
  },
  footerChargement: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  texteChargement: {
    marginLeft: 8,
  },
  chargementOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
});

export default ListeEmplois;