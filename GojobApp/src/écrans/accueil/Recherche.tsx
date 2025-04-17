
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Platform,
  Keyboard,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../hooks/useTheme';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { AccueilNavigatorParamList } from '../../types/navigation';

// Components
import BarreRecherche from '../../components/communs/BarreRecherche';
import ChampTexte from '../../components/communs/ChampTexte';
import Bouton from '../../components/communs/Bouton';

// Redux actions
import {
  setTermeRecherche,
  setLocation,
  setFiltres,
  setChargementRecherche,
  setResultatsRecherche,
} from '../../redux/slices/emploisSlice';

// API
import jobsApi from '../../api/jobsApi';
import { TextStyle } from 'react-native';

type RechercheRouteProp = RouteProp<AccueilNavigatorParamList, 'Recherche'>;
type NavigationProp = NativeStackNavigationProp<AccueilNavigatorParamList>;

const Recherche: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RechercheRouteProp>();
  const dispatch = useAppDispatch();
  
  // Récupérer les paramètres de route s'ils existent
  const { keyword, location } = route.params || {};
  
  // Redux state
  const { 
    recherche: { termeRecherche, location: locationState }, 
    filtres 
  } = useAppSelector(state => state.emplois);
  
  // Local state
  const [recherche, setRecherche] = useState(keyword || termeRecherche || '');
  const [lieu, setLieu] = useState(location || locationState || '');
  const [rechercheRecente, setRechercheRecente] = useState<string[]>([]);
  const [lieux, setLieux] = useState<string[]>([]);
  const [categoriesPopulaires, setCategoriesPopulaires] = useState<string[]>([
    'Commercial',
    'Restauration',
    'Hôtellerie',
    'Agriculture',
    'Transport',
    'Informatique',
    'Bâtiment',
    'Santé',
  ]);
  
  // Charger les recherches récentes depuis le stockage local
  useEffect(() => {
    // Ici, vous pourriez implémenter la récupération des recherches récentes depuis AsyncStorage
    // Pour simplifier, nous utilisons des valeurs statiques
    setRechercheRecente([
      'Paysagiste',
      'Commercial',
      'Cuisinier',
      'Chauffeur',
      'Développeur web',
    ]);
    
    // Idem pour les lieux récents
    setLieux([
      'Rennes',
      'Paris',
      'Lyon',
      'Marseille',
      'Bordeaux',
    ]);
  }, []);
  
  // Effectuer une recherche
  const effectuerRecherche = async () => {
    // Masquer le clavier
    Keyboard.dismiss();
    
    // Si les deux champs sont vides, ne pas faire de recherche
    if (!recherche.trim() && !lieu.trim()) return;
    
    // Mettre à jour le state Redux
    dispatch(setTermeRecherche(recherche.trim()));
    dispatch(setLocation(lieu.trim()));
    
    // Construire les paramètres de recherche
    const params = {
      keyword: recherche.trim(),
      location: lieu.trim(),
      ...filtres,
    };
    
    // Naviguer vers les résultats avec les paramètres
    navigation.navigate('ResultatsRecherche', { params });
  };
  
  // Ouvrir les filtres
  const ouvrirFiltres = () => {
    navigation.navigate('FiltrageRecherche', {
      filtres,
      onApply: (nouveauxFiltres) => {
        dispatch(setFiltres(nouveauxFiltres));
      },
    });
  };
  
  // Utiliser une recherche récente ou une catégorie
  const utiliserRecherche = (terme: string) => {
    setRecherche(terme);
    // Focus sur le champ de lieu après avoir sélectionné un terme
    // Pour suggérer à l'utilisateur de compléter sa recherche
  };
  
  // Utiliser un lieu récent
  const utiliserLieu = (lieu: string) => {
    setLieu(lieu);
    // Lancer la recherche immédiatement si un terme est déjà saisi
    if (recherche.trim()) {
      effectuerRecherche();
    }
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.couleurs.FOND_SOMBRE }]}>
      <StatusBar
        barStyle={Platform.OS === 'ios' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.couleurs.FOND_SOMBRE}
      />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Formulaire de recherche */}
        <View style={styles.formContainer}>
          <ChampTexte
            placeholder="Quel emploi recherchez-vous ?"
            value={recherche}
            onChangeText={setRecherche}
            iconGauche="magnify"
            returnKeyType="next"
            autoFocus
            style={styles.champRecherche}
          />
          
          <ChampTexte
            placeholder="Où ? (ville, région, code postal)"
            value={lieu}
            onChangeText={setLieu}
            iconGauche="map-marker"
            returnKeyType="search"
            onSubmitEditing={effectuerRecherche}
            style={styles.champLieu}
          />
          
          <View style={styles.boutonsContainer}>
            <Bouton
              titre="Filtres"
              onPress={ouvrirFiltres}
              variante="outline"
              taille="moyen"
              icone={<Icon name="filter-variant" size={20} color={theme.couleurs.PRIMAIRE} />}
              iconePosition="gauche"
              style={{ marginRight: 12, flex: 1 }}
            />
            
            <Bouton
              titre="Rechercher"
              onPress={effectuerRecherche}
              variante="primaire"
              taille="moyen"
              style={{ flex: 1 }}
            />
          </View>
        </View>
        
        {/* Section Recherches récentes */}
        {rechercheRecente.length > 0 && (
          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitre,
                {
                  color: theme.couleurs.TEXTE_PRIMAIRE,
                  fontSize: theme.typographie.TAILLES.MOYEN,
                  fontWeight: theme.typographie.POIDS.GRAS as TextStyle['fontWeight'],
                },
              ]}
            >
              Recherches récentes
            </Text>
            
            <View style={styles.tagsContainer}>
              {rechercheRecente.map((terme, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.tag,
                    { backgroundColor: theme.couleurs.FOND_TERTIAIRE },
                  ]}
                  onPress={() => utiliserRecherche(terme)}
                >
                  <Icon name="history" size={16} color={theme.couleurs.TEXTE_SECONDAIRE} />
                  <Text
                    style={[
                      styles.tagTexte,
                      { color: theme.couleurs.TEXTE_SECONDAIRE },
                    ]}
                  >
                    {terme}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
        
        {/* Section Lieux récents */}
        {lieux.length > 0 && (
          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitre,
                {
                  color: theme.couleurs.TEXTE_PRIMAIRE,
                  fontSize: theme.typographie.TAILLES.MOYEN,
                  fontWeight: theme.typographie.POIDS.GRAS as TextStyle['fontWeight'],
                },
              ]}
            >
              Lieux récents
            </Text>
            
            <View style={styles.tagsContainer}>
              {lieux.map((lieu, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.tag,
                    { backgroundColor: theme.couleurs.FOND_TERTIAIRE },
                  ]}
                  onPress={() => utiliserLieu(lieu)}
                >
                  <Icon name="map-marker" size={16} color={theme.couleurs.TEXTE_SECONDAIRE} />
                  <Text
                    style={[
                      styles.tagTexte,
                      { color: theme.couleurs.TEXTE_SECONDAIRE },
                    ]}
                  >
                    {lieu}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
        
        {/* Section Catégories populaires */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitre,
              {
                color: theme.couleurs.TEXTE_PRIMAIRE,
                fontSize: theme.typographie.TAILLES.MOYEN,
                fontWeight: theme.typographie.POIDS.GRAS as TextStyle['fontWeight'],
              },
            ]}
          >
            Catégories populaires
          </Text>
          
          <View style={styles.tagsContainer}>
            {categoriesPopulaires.map((categorie, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.tag,
                  { backgroundColor: theme.couleurs.FOND_TERTIAIRE },
                ]}
                onPress={() => utiliserRecherche(categorie)}
              >
                <Text
                  style={[
                    styles.tagTexte,
                    { color: theme.couleurs.TEXTE_SECONDAIRE },
                  ]}
                >
                  {categorie}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* Suggestions pour les employeurs */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitre,
              {
                color: theme.couleurs.TEXTE_PRIMAIRE,
                fontSize: theme.typographie.TAILLES.MOYEN,
                fontWeight: theme.typographie.POIDS.GRAS as TextStyle['fontWeight'],
              },
            ]}
          >
            Vous recrutez ?
          </Text>
          
          <TouchableOpacity
            style={[
              styles.banniereEmployeur,
              {
                backgroundColor: theme.couleurs.PRIMAIRE,
                borderRadius: theme.bordures.RADIUS_MOYEN,
              },
            ]}
            onPress={() => navigation.navigate('PublierEmploi')}
          >
            <View style={styles.banniereContenu}>
              <Icon name="briefcase-plus" size={32} color="white" />
              <View style={styles.banniereTexteContainer}>
                <Text
                  style={[
                    styles.banniereTitre,
                    {
                      color: 'white',
                      fontSize: theme.typographie.TAILLES.MOYEN,
                      fontWeight: theme.typographie.POIDS.GRAS as TextStyle['fontWeight'],
                    },
                  ]}
                >
                  Publiez une offre d'emploi
                </Text>
                <Text
                  style={[
                    styles.banniereDescription,
                    { color: 'rgba(255, 255, 255, 0.8)' },
                  ]}
                >
                  Trouvez rapidement des candidats qualifiés
                </Text>
              </View>
            </View>
            <Icon name="chevron-right" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  formContainer: {
    marginBottom: 24,
  },
  champRecherche: {
    marginBottom: 12,
  },
  champLieu: {
    marginBottom: 16,
  },
  boutonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitre: {
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagTexte: {
    marginLeft: 4,
    fontSize: 14,
  },
  banniereEmployeur: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  banniereContenu: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  banniereTexteContainer: {
    marginLeft: 12,
  },
  banniereTitre: {
    marginBottom: 4,
  },
  banniereDescription: {
    fontSize: 12,
  },
});

export default Recherche;