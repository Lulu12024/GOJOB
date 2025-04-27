import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../hooks/useTheme';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { AccueilNavigatorParamList } from '../../types/navigation';

// Components
import BarreRecherche from '../../components/communs/BarreRecherche';
import CarteEmploi from '../../components/emplois/CarteEmploi';
import Bouton from '../../components/communs/Bouton';

// Redux actions
import {
  setResultatsRecherche,
  setChargementRecherche,
  ajouterFavori,
  retirerFavori,
} from '../../redux/slices/emploisSlice';

// API
import jobsApi, { Emploi, RechercheEmploiParams } from '../../api/jobsApi';
import { TextStyle } from 'react-native';
import { fetchFavorites, toggleFavorite } from '../../redux/slices/favorisSlice';

type ResultatsRechercheRouteProp = RouteProp<AccueilNavigatorParamList, 'ResultatsRecherche'>;
type NavigationProp = NativeStackNavigationProp<AccueilNavigatorParamList>;

const ResultatsRecherche: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ResultatsRechercheRouteProp>();
  const dispatch = useAppDispatch();
  
  // Récupérer les paramètres de recherche depuis la route
  const { params } = route.params || { params: {} };
  
  // Redux state
  const { 
    recherche: { resultats, chargement, termeRecherche, location }, 
    favoris
  } = useAppSelector(state => state.emplois);
  
  // Local state
  const [page, setPage] = useState(1);
  const [dernierePageAtteinte, setDernierePageAtteinte] = useState(false);
  const [chargementPlus, setChargementPlus] = useState(false);
  const [rafraichissement, setRafraichissement] = useState(false);
  const [nombreResultats, setNombreResultats] = useState(0);
  const [termeSaisi, setTermeSaisi] = useState(termeRecherche || params.keyword || '');
  const [lieuSaisi, setLieuSaisi] = useState(location || params.location || '');
  const { utilisateur } = useAppSelector(state => state.auth);
  
  // Effectuer la recherche
  const effectuerRecherche = useCallback(async (pageNo = 1, rafraichir = false) => {
    try {
      if (pageNo === 1) {
        dispatch(setChargementRecherche(true));
      }
      
      const parametresRecherche: RechercheEmploiParams = {
        ...params,
        page: pageNo,
        per_page: 20,
      };
      
      const response = await jobsApi.rechercherEmplois(parametresRecherche);
      
      // Mise à jour du nombre total de résultats
      setNombreResultats(response.meta.total);
      
      // Vérifier si on a atteint la dernière page
      if (pageNo >= response.meta.last_page) {
        setDernierePageAtteinte(true);
      } else {
        setDernierePageAtteinte(false);
      }
      
      // Mise à jour de la page courante
      setPage(pageNo);
      
      // Mise à jour des résultats
      if (pageNo === 1 || rafraichir) {
        dispatch(setResultatsRecherche(response.data));
      } else {
        // Ajouter les nouveaux résultats à la liste existante
        dispatch(setResultatsRecherche([...resultats, ...response.data]));
      }
    } catch (error) {
      console.error('Erreur lors de la recherche d\'emplois :', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la recherche. Veuillez réessayer.');
    } finally {
      dispatch(setChargementRecherche(false));
      setChargementPlus(false);
      setRafraichissement(false);
    }
  }, [dispatch, params, resultats]);
  
  // Effectuer la recherche initiale
  useEffect(() => {
    effectuerRecherche(1);
  }, [effectuerRecherche]);
  
  // Charger plus de résultats
  const chargerPlus = () => {
    if (dernierePageAtteinte || chargement || chargementPlus) return;
    
    setChargementPlus(true);
    effectuerRecherche(page + 1);
  };
  
  // Rafraîchir les résultats
  const rafraichir = () => {
    setRafraichissement(true);
    effectuerRecherche(1, true);
  };
  
  // Naviguer vers l'écran de recherche
  const allerVersRecherche = () => {
    navigation.navigate('Recherche', {
      keyword: termeSaisi,
      location: lieuSaisi,
    });
  };
  
  // Modifier les filtres
  const modifierFiltres = () => {
    navigation.navigate('FiltrageRecherche', {
      filtres: params,
      onApply: (nouveauxFiltres) => {
        // Naviguer vers les résultats avec les nouveaux filtres
        navigation.navigate('ResultatsRecherche', {
          params: {
            ...params,
            ...nouveauxFiltres,
          },
        });
      },
    });
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
      // await jobsApi.toggleFavori(id);
      if (utilisateur ){
        dispatch(toggleFavorite({ jobId: id, userId: utilisateur.id }));
      }
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
  
  // Rendu d'une offre d'emploi
  const renderEmploi = ({ item }: { item: Emploi }) => {
    return (
      <CarteEmploi
        emploi={item}
        isFavorite={favoris.includes(item.id)}
        onFavorite={() => gererFavori(item.id)}
      />
    );
  };
  
  // Rendu du pied de liste (indicateur de chargement ou message fin de liste)
  const renderFooter = () => {
    if (chargementPlus) {
      return (
        <View style={styles.footerChargement}>
          <ActivityIndicator size="small" color={theme.couleurs.PRIMAIRE} />
          <Text style={[styles.texteChargement, { color: theme.couleurs.TEXTE_SECONDAIRE }]}>
            Chargement...
          </Text>
        </View>
      );
    }
    
    if (dernierePageAtteinte && resultats.length > 0) {
      return (
        <View style={styles.footerFin}>
          <Text style={[styles.texteFin, { color: theme.couleurs.TEXTE_SECONDAIRE }]}>
            Fin des résultats
          </Text>
        </View>
      );
    }
    
    return null;
  };
  
  // Rendu du message "aucun résultat"
  const renderAucunResultat = () => {
    if (chargement) return null;
    
    if (resultats.length === 0) {
      return (
        <View style={styles.aucunResultatContainer}>
          <Icon
            name="magnify-close"
            size={64}
            color={theme.couleurs.TEXTE_TERTIAIRE}
            style={styles.iconeAucunResultat}
          />
          <Text
            style={[
              styles.texteAucunResultat,
              {
                color: theme.couleurs.TEXTE_PRIMAIRE,
                fontSize: theme.typographie.TAILLES.GRAND,
                fontWeight: theme.typographie.POIDS.GRAS as TextStyle['fontWeight'],
              },
            ]}
          >
            Aucun résultat trouvé
          </Text>
          <Text
            style={[
              styles.sousTitreAucunResultat,
              { color: theme.couleurs.TEXTE_SECONDAIRE },
            ]}
          >
            Essayez de modifier vos critères de recherche
          </Text>
          <Bouton
            titre="Modifier la recherche"
            onPress={allerVersRecherche}
            variante="primaire"
            taille="moyen"
            style={{ marginTop: 24 }}
          />
        </View>
      );
    }
    
    return null;
  };
  
  // Construire le titre de la page en fonction des termes de recherche
  const construireTitre = () => {
    let titre = 'Résultats';
    
    if (params.keyword) {
      titre = `"${params.keyword}"`;
    }
    
    if (params.location) {
      titre += ` à ${params.location}`;
    }
    
    return titre;
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.couleurs.FOND_SOMBRE }]}>
      <StatusBar
        barStyle={Platform.OS === 'ios' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.couleurs.FOND_SOMBRE}
      />
      
      {/* Barre de recherche en haut de l'écran */}
      <View style={styles.barreRechercheContainer}>
        <TouchableOpacity
          style={[
            styles.barreRecherche,
            {
              backgroundColor: theme.couleurs.FOND_SECONDAIRE,
              borderRadius: theme.bordures.RADIUS_MOYEN,
            },
          ]}
          onPress={allerVersRecherche}
          activeOpacity={0.7}
        >
          <Icon name="magnify" size={20} color={theme.couleurs.TEXTE_SECONDAIRE} />
          <Text
            style={[
              styles.texteRecherche,
              { color: theme.couleurs.TEXTE_SECONDAIRE },
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {termeSaisi || params.keyword || 'Rechercher un emploi...'}
            {(lieuSaisi || params.location) && ` à ${lieuSaisi || params.location}`}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.boutonFiltres,
            {
              backgroundColor: theme.couleurs.FOND_SECONDAIRE,
              borderRadius: theme.bordures.RADIUS_MOYEN,
            },
          ]}
          onPress={modifierFiltres}
        >
          <Icon name="filter-variant" size={24} color={theme.couleurs.TEXTE_SECONDAIRE} />
        </TouchableOpacity>
      </View>
      
      {/* Affichage du nombre de résultats */}
      {!chargement && resultats.length > 0 && (
        <View style={styles.infoResultats}>
          <Text style={[styles.texteNombreResultats, { color: theme.couleurs.TEXTE_SECONDAIRE }]}>
            {nombreResultats} {nombreResultats > 1 ? 'résultats' : 'résultat'}
          </Text>
        </View>
      )}
      
      {/* Liste des résultats */}
      <FlatList
        data={resultats}
        renderItem={renderEmploi}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listeContainer}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderAucunResultat}
        onEndReached={chargerPlus}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={rafraichissement}
            onRefresh={rafraichir}
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
  barreRechercheContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  barreRecherche: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 12,
  },
  texteRecherche: {
    marginLeft: 8,
    fontSize: 15,
    flex: 1,
  },
  boutonFiltres: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoResultats: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  texteNombreResultats: {
    fontSize: 14,
  },
  listeContainer: {
    padding: 16,
    paddingTop: 0,
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
  footerFin: {
    padding: 16,
    alignItems: 'center',
  },
  texteFin: {
    fontSize: 14,
  },
  aucunResultatContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconeAucunResultat: {
    marginBottom: 16,
  },
  texteAucunResultat: {
    marginBottom: 8,
    textAlign: 'center',
  },
  sousTitreAucunResultat: {
    fontSize: 16,
    textAlign: 'center',
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

export default ResultatsRecherche;