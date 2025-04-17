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
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../hooks/useTheme';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { FlashJobsNavigatorParamList } from '../../types/navigation';

// Components
import BarreRecherche from '../../components/communs/BarreRecherche';
import Bouton from '../../components/communs/Bouton';

// Redux actions
import {
  setFlashJobs,
  ajouterFlashJobs,
  setChargement,
  setPage,
  setTotalPages,
} from '../../redux/slices/flashJobsSlice';

// API
import flashJobsApi, { EmploiFlash } from '../../api/flashJobsApi';
import { TextStyle } from 'react-native';

type NavigationProp = NativeStackNavigationProp<FlashJobsNavigatorParamList, 'ListeFlashJobs'>;

const ListeFlashJobs: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();
  
  // Redux state
  const { flashJobs, chargement, page, totalPages } = useAppSelector(state => state.flashJobs);
  const { utilisateur } = useAppSelector(state => state.auth);
  
  // Local state
  const [rafraichissement, setRafraichissement] = useState(false);
  const [chargementPlus, setChargementPlus] = useState(false);
  const [termeRecherche, setTermeRecherche] = useState('');
  const [locationRecherche, setLocationRecherche] = useState('');
  
  // Vérifier si l'utilisateur est un employeur
  const estEmployeur = utilisateur?.role === 'employer';
  
  // Charger la liste initiale des emplois flash
  const chargerFlashJobs = useCallback(async () => {
    try {
      dispatch(setChargement(true));
      dispatch(setPage(1));
      
      const response = await flashJobsApi.getEmploisFlash(1, 20);
      dispatch(setFlashJobs(response.data));
      dispatch(setTotalPages(response.meta.last_page));
    } catch (error) {
      console.error('Erreur lors du chargement des emplois flash :', error);
      Alert.alert('Erreur', 'Impossible de charger les emplois flash. Veuillez réessayer plus tard.');
    } finally {
      dispatch(setChargement(false));
    }
  }, [dispatch]);
  
  // Charger plus d'emplois flash (pagination)
  const chargerPlusFlashJobs = async () => {
    // Si on est déjà à la dernière page ou en cours de chargement, ne rien faire
    if (page >= totalPages || chargement || chargementPlus) return;
    
    try {
      setChargementPlus(true);
      const nouvellePage = page + 1;
      
      const response = await flashJobsApi.getEmploisFlash(nouvellePage, 20);
      dispatch(ajouterFlashJobs(response.data));
      dispatch(setPage(nouvellePage));
    } catch (error) {
      console.error('Erreur lors du chargement des emplois flash supplémentaires :', error);
    } finally {
      setChargementPlus(false);
    }
  };
  
  // Rafraîchir la liste des emplois flash
  const rafraichirFlashJobs = async () => {
    setRafraichissement(true);
    await chargerFlashJobs();
    setRafraichissement(false);
  };
  
  // Effect pour charger les emplois flash au montage du composant
  useEffect(() => {
    chargerFlashJobs();
  }, [chargerFlashJobs]);
  
  // Naviguer vers la page de détail d'un emploi flash
  const naviguerVersDetail = (emploi: EmploiFlash) => {
    navigation.navigate('DetailFlashJob', { emploi });
  };
  
  // Naviguer vers la page de recherche d'emplois flash
  const naviguerVersRecherche = () => {
    navigation.navigate('RechercheFlashJobs');
  };
  
  // Naviguer vers la page de publication d'un emploi flash (pour les employeurs)
  const naviguerVersPublication = () => {
    navigation.navigate('PublierFlashJob');
  };
  
  // Postuler à un emploi flash
  const postulerEmploiFlash = async (id: number) => {
    try {
      await flashJobsApi.postulerEmploiFlash(id);
      
      Alert.alert(
        'Candidature envoyée',
        'Votre candidature a été envoyée avec succès. L\'employeur vous contactera bientôt.',
        [{ text: 'OK' }]
      );
      
      // Rafraîchir la liste pour mettre à jour le compteur de candidatures
      rafraichirFlashJobs();
    } catch (error) {
      console.error('Erreur lors de la candidature à l\'emploi flash :', error);
      Alert.alert('Erreur', 'Impossible d\'envoyer votre candidature. Veuillez réessayer plus tard.');
    }
  };
  
  // Formater la date et l'heure pour affichage
  const formaterDateHeure = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  // Calculer le temps restant avant le début de l'emploi flash
  const calculerTempsRestant = (dateDebut: string) => {
    const maintenant = new Date();
    const debut = new Date(dateDebut);
    const differenceMs = debut.getTime() - maintenant.getTime();
    
    if (differenceMs <= 0) {
      return 'Maintenant';
    }
    
    const heures = Math.floor(differenceMs / (1000 * 60 * 60));
    const minutes = Math.floor((differenceMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (heures > 24) {
      const jours = Math.floor(heures / 24);
      return `Dans ${jours} ${jours > 1 ? 'jours' : 'jour'}`;
    }
    
    if (heures > 0) {
      return `Dans ${heures}h${minutes > 0 ? ` ${minutes}min` : ''}`;
    }
    
    return `Dans ${minutes} min`;
  };
  
  // Rendu d'un élément de la liste d'emplois flash
  const renderFlashJob = ({ item }: { item: EmploiFlash }) => {
    const tempsRestant = calculerTempsRestant(item.start_time);
    const estUrgent = tempsRestant === 'Maintenant' || tempsRestant.includes('min');
    
    return (
      <TouchableOpacity
        style={[
          styles.carteEmploi,
          {
            backgroundColor: theme.couleurs.FOND_SECONDAIRE,
            borderRadius: theme.bordures.RADIUS_MOYEN,
            ...theme.ombres.LEGERE,
          },
        ]}
        onPress={() => naviguerVersDetail(item)}
        activeOpacity={0.7}
      >
        {/* En-tête avec image, entreprise et emplacement */}
        <View style={styles.enTete}>
          <Image
            source={
              item.photos && item.photos.length > 0
                ? { uri: item.photos[0] }
                : require('../../assets/images/job-placeholder.png')
            }
            style={styles.image}
            resizeMode="cover"
          />
          
          <View style={styles.detailsEnTete}>
            <Text
              style={[
                styles.entreprise,
                {
                  color: theme.couleurs.TEXTE_SECONDAIRE,
                  fontSize: theme.typographie.TAILLES.PETIT,
                },
              ]}
              numberOfLines={1}
            >
              {item.company}
            </Text>
            
            <View style={styles.ligne}>
              <Icon name="map-marker" size={14} color={theme.couleurs.TEXTE_SECONDAIRE} />
              <Text
                style={[
                  styles.texteSecondaire,
                  { color: theme.couleurs.TEXTE_SECONDAIRE },
                ]}
                numberOfLines={1}
              >
                {item.location}
              </Text>
            </View>
          </View>
          
          {/* Badge urgence */}
          {estUrgent && (
            <View
              style={[
                styles.badgeUrgent,
                { backgroundColor: theme.couleurs.URGENT },
              ]}
            >
              <Text style={styles.texteUrgent}>URGENT</Text>
            </View>
          )}
        </View>
        
        {/* Titre et description */}
        <Text
          style={[
            styles.titre,
            {
              color: theme.couleurs.TEXTE_PRIMAIRE,
              fontSize: theme.typographie.TAILLES.MOYEN,
              fontWeight: theme.typographie.POIDS.GRAS as TextStyle['fontWeight'],
            },
          ]}
          numberOfLines={1}
        >
          {item.title}
        </Text>
        
        <Text
          style={[
            styles.description,
            { color: theme.couleurs.TEXTE_SECONDAIRE },
          ]}
          numberOfLines={2}
        >
          {item.description}
        </Text>
        
        {/* Informations de temps et salaire */}
        <View style={styles.infoSection}>
          <View style={styles.ligne}>
            <Icon name="clock-outline" size={16} color={theme.couleurs.TEXTE_SECONDAIRE} />
            <Text
              style={[
                styles.texteSecondaire,
                { color: theme.couleurs.TEXTE_SECONDAIRE },
              ]}
            >
              {formaterDateHeure(item.start_time)}
            </Text>
          </View>
          
          <View style={styles.ligne}>
            <Icon name="timer-sand" size={16} color={theme.couleurs.TEXTE_SECONDAIRE} />
            <Text
              style={[
                styles.texteSecondaire,
                {
                    color: estUrgent ? theme.couleurs.URGENT : theme.couleurs.TEXTE_SECONDAIRE,
                  // Lignes 331-332
                    fontWeight: theme.typographie.POIDS.GRAS as TextStyle['fontWeight'],
                    // fontWeight: estUrgent ? theme.typographie.POIDS.GRAS : 'normal' as TextStyle['fontWeight'],
                },
              ]}
            >
              {tempsRestant}
            </Text>
          </View>
          
          {item.salary && (
            <View style={styles.ligne}>
              <Icon name="currency-eur" size={16} color={theme.couleurs.TEXTE_SECONDAIRE} />
              <Text
                style={[
                  styles.texteSecondaire,
                  { color: theme.couleurs.TEXTE_SECONDAIRE },
                ]}
              >
                {item.salary.amount} € / {item.salary.period === 'hour' ? 'h' : 'forfait'}
              </Text>
            </View>
          )}
        </View>
        
        {/* Pied de carte avec bouton d'action */}
        <View style={styles.piedCarte}>
          <View style={styles.statsCandidatures}>
            <Icon name="account-group" size={16} color={theme.couleurs.TEXTE_SECONDAIRE} />
            <Text style={[styles.texteCandidatures, { color: theme.couleurs.TEXTE_SECONDAIRE }]}>
              {item.current_applicants} / {item.max_applicants || '∞'}
            </Text>
          </View>
          
          {!estEmployeur && (
            <Bouton
              titre="Postuler"
              onPress={() => postulerEmploiFlash(item.id)}
              variante="primaire"
              taille="petit"
              desactive={item.is_filled}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };
  
  // Rendu du header de la liste avec barre de recherche
  const renderHeader = () => (
    <View style={styles.header}>
      <BarreRecherche
        placeholder="Rechercher un emploi flash..."
        valeur={termeRecherche}
        onChange={setTermeRecherche}
        onSubmit={naviguerVersRecherche}
        style={styles.barreRecherche}
      />
      
      <View style={styles.messageFlashJob}>
        <Text
          style={[
            styles.texteMessageFlashJob,
            {
              color: theme.couleurs.TEXTE_PRIMAIRE,
              fontSize: theme.typographie.TAILLES.MOYEN,
              fontWeight: theme.typographie.POIDS.GRAS as TextStyle['fontWeight'],
            },
          ]}
        >
          Emplois Flash 
        </Text>
        <Text
          style={[
            styles.sousTitreFlashJob,
            { color: theme.couleurs.TEXTE_SECONDAIRE },
          ]}
        >
          Trouvez des missions de dernière minute près de chez vous
        </Text>
      </View>
      
      {estEmployeur && (
        <TouchableOpacity
          style={[
            styles.boutonPublier,
            {
              backgroundColor: theme.couleurs.PRIMAIRE,
              borderRadius: theme.bordures.RADIUS_MOYEN,
            },
          ]}
          onPress={naviguerVersPublication}
        >
          <Icon name="plus" size={24} color="white" />
          <Text style={styles.textePublier}>Publier un emploi flash</Text>
        </TouchableOpacity>
      )}
    </View>
  );
  
  // Rendu du footer de la liste (indicateur de chargement pour "charger plus")
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
    
    return null;
  };
  
  // Rendu du message "aucun emploi flash"
  const renderAucunEmploi = () => {
    if (chargement) return null;
    
    if (flashJobs.length === 0) {
      return (
        <View style={styles.aucunEmploiContainer}>
          <Icon
            name="calendar-alert"
            size={64}
            color={theme.couleurs.TEXTE_TERTIAIRE}
            style={styles.iconeAucunEmploi}
          />
          <Text
            style={[
              styles.texteAucunEmploi,
              {
                color: theme.couleurs.TEXTE_PRIMAIRE,
                fontSize: theme.typographie.TAILLES.GRAND,
                fontWeight: theme.typographie.POIDS.GRAS as TextStyle['fontWeight'],
              },
            ]}
          >
            Aucun emploi flash disponible
          </Text>
          <Text
            style={[
              styles.sousTitreAucunEmploi,
              { color: theme.couleurs.TEXTE_SECONDAIRE },
            ]}
          >
            Revenez plus tard pour voir les nouvelles opportunités
          </Text>
          
          {estEmployeur && (
            <Bouton
              titre="Publier un emploi flash"
              onPress={naviguerVersPublication}
              variante="primaire"
              taille="moyen"
              style={{ marginTop: 24 }}
            />
          )}
        </View>
      );
    }
    
    return null;
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.couleurs.FOND_SOMBRE }]}>
      <StatusBar
        barStyle={Platform.OS === 'ios' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.couleurs.FOND_SOMBRE}
      />
      
      <FlatList
        data={flashJobs}
        renderItem={renderFlashJob}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listeContainer}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderAucunEmploi}
        onEndReached={chargerPlusFlashJobs}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={rafraichissement}
            onRefresh={rafraichirFlashJobs}
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
  header: {
    padding: 16,
  },
  barreRecherche: {
    marginBottom: 16,
  },
  messageFlashJob: {
    marginBottom: 16,
  },
  texteMessageFlashJob: {
    marginBottom: 4,
  },
  sousTitreFlashJob: {
    fontSize: 14,
    lineHeight: 20,
  },
  boutonPublier: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginBottom: 8,
  },
  textePublier: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  listeContainer: {
    paddingBottom: 16,
  },
  carteEmploi: {
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  enTete: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  detailsEnTete: {
    flex: 1,
    justifyContent: 'center',
  },
  entreprise: {
    marginBottom: 4,
  },
  badgeUrgent: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  texteUrgent: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  titre: {
    marginBottom: 8,
  },
  description: {
    marginBottom: 12,
    fontSize: 14,
    lineHeight: 20,
  },
  infoSection: {
    marginBottom: 12,
  },
  ligne: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  texteSecondaire: {
    marginLeft: 6,
    fontSize: 14,
  },
  piedCarte: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  statsCandidatures: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  texteCandidatures: {
    marginLeft: 6,
    fontSize: 14,
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
  aucunEmploiContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconeAucunEmploi: {
    marginBottom: 16,
  },
  texteAucunEmploi: {
    marginBottom: 8,
    textAlign: 'center',
  },
  sousTitreAucunEmploi: {
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

export default ListeFlashJobs;