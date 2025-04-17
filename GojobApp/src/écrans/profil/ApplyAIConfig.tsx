
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DatePicker from 'react-native-date-picker';
import { useTheme } from '../../hooks/useTheme';
import { useAppSelector } from '../../redux/hooks';
import { ProfilNavigatorParamList } from '../../types/navigation';

// Composants
import Bouton from '../../components/communs/Bouton';
import ChampTexte from '../../components/communs/ChampTexte';

// API
import applyAiApi, { ConfigurationApplyAI, ApplyAIConfigPayload } from '../../api/applyAiApiConfig';
import { TextStyle } from 'react-native';

type NavigationProp = NativeStackNavigationProp<ProfilNavigatorParamList, 'ApplyAIConfig'>;

const ApplyAIConfig: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  
  // Redux state
  const { utilisateur } = useAppSelector(state => state.auth);
  
  // Local state
  const [configuration, setConfiguration] = useState<ConfigurationApplyAI | null>(null);
  const [chargement, setChargement] = useState(true);
  const [enregistrement, setEnregistrement] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  
  // Form state
  const [categories, setCategories] = useState<string[]>([]);
  const [nouveauCategorie, setNouveauCategorie] = useState('');
  const [salaireMin, setSalaireMin] = useState('');
  const [salaireMax, setSalaireMax] = useState('');
  const [periodeSalaire, setPeriodeSalaire] = useState<'hour' | 'month'>('month');
  const [accommodation, setAccommodation] = useState(false);
  const [childrenFriendly, setChildrenFriendly] = useState(false);
  const [petsFriendly, setPetsFriendly] = useState(false);
  const [accessible, setAccessible] = useState(false);
  const [companyCar, setCompanyCar] = useState(false);
  const [maxDistance, setMaxDistance] = useState('');
  const [entreprisesExclues, setEntreprisesExclues] = useState<string[]>([]);
  const [nouvelleEntreprise, setNouvelleEntreprise] = useState('');
  const [heureNotification, setHeureNotification] = useState(new Date());
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  
  // Vérifier si l'utilisateur a un abonnement ApplyAI
  useEffect(() => {
    const verifierAbonnement = async () => {
      try {
        const { has_subscription } = await applyAiApi.verifierAbonnement();
        
        if (!has_subscription) {
          Alert.alert(
            'Abonnement requis',
            'Cette fonctionnalité nécessite un abonnement ApplyAI. Voulez-vous vous abonner maintenant ?',
            [
              {
                text: 'Annuler',
                onPress: () => navigation.goBack(),
                style: 'cancel',
              },
              {
                text: 'Voir les abonnements',
                onPress: () => {
                  navigation.navigate('Abonnements');
                },
              },
            ]
          );
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'abonnement :', error);
        navigation.goBack();
      }
    };
    
    verifierAbonnement();
  }, [navigation]);
  
  // Charger la configuration existante
  useEffect(() => {
    const chargerConfiguration = async () => {
      try {
        setChargement(true);
        setErreur(null);
        
        const config = await applyAiApi.getConfiguration();
        setConfiguration(config);
        
        // Remplir le formulaire avec les données existantes
        if (config) {
          setCategories(config.categories || []);
          setSalaireMin(config.salary_range?.min?.toString() || '');
          setSalaireMax(config.salary_range?.max?.toString() || '');
          setPeriodeSalaire(config.salary_range?.period || 'month');
          setAccommodation(config.filters?.accommodation || false);
          setChildrenFriendly(config.filters?.children_friendly || false);
          setPetsFriendly(config.filters?.pets_friendly || false);
          setAccessible(config.filters?.accessible || false);
          setCompanyCar(config.filters?.company_car || false);
          setMaxDistance(config.filters?.max_distance?.toString() || '');
          setEntreprisesExclues(config.excluded_companies || []);
          
          // Configurer l'heure de notification
          if (config.notification_time) {
            const [hours, minutes] = config.notification_time.split(':').map(Number);
            const date = new Date();
            date.setHours(hours);
            date.setMinutes(minutes);
            setHeureNotification(date);
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la configuration :', error);
        setErreur('Impossible de charger votre configuration ApplyAI.');
      } finally {
        setChargement(false);
      }
    };
    
    chargerConfiguration();
  }, []);
  
  // Ajouter une catégorie
  const ajouterCategorie = () => {
    if (!nouveauCategorie.trim()) return;
    
    if (!categories.includes(nouveauCategorie.trim())) {
      setCategories([...categories, nouveauCategorie.trim()]);
    }
    
    setNouveauCategorie('');
  };
  
  // Supprimer une catégorie
  const supprimerCategorie = (index: number) => {
    const nouvellesCategories = [...categories];
    nouvellesCategories.splice(index, 1);
    setCategories(nouvellesCategories);
  };
  
  // Ajouter une entreprise exclue
  const ajouterEntrepriseExclue = () => {
    if (!nouvelleEntreprise.trim()) return;
    
    if (!entreprisesExclues.includes(nouvelleEntreprise.trim())) {
      setEntreprisesExclues([...entreprisesExclues, nouvelleEntreprise.trim()]);
    }
    
    setNouvelleEntreprise('');
  };
  
  // Supprimer une entreprise exclue
  const supprimerEntrepriseExclue = (index: number) => {
    const nouvellesEntreprises = [...entreprisesExclues];
    nouvellesEntreprises.splice(index, 1);
    setEntreprisesExclues(nouvellesEntreprises);
  };
  
  // Ouvrir le sélecteur d'heure
  const ouvrirSelecteurHeure = () => {
    setDatePickerVisible(true);
  };
  
  // Confirmer la sélection d'heure
  const confirmerHeure = (date: Date) => {
    setHeureNotification(date);
    setDatePickerVisible(false);
  };
  
  // Formater l'heure pour l'affichage
  const formaterHeure = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Formater l'heure pour l'API (format HH:MM)
  const formaterHeureAPI = (date: Date) => {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };
  
  // Valider le formulaire
  const validerFormulaire = (): boolean => {
    if (categories.length === 0) {
      Alert.alert('Erreur', 'Veuillez sélectionner au moins une catégorie d\'emploi.');
      return false;
    }
    
    if (!salaireMin.trim() || !salaireMax.trim()) {
      Alert.alert('Erreur', 'Veuillez indiquer une fourchette de salaire.');
      return false;
    }
    
    const min = parseFloat(salaireMin);
    const max = parseFloat(salaireMax);
    
    if (isNaN(min) || isNaN(max) || min < 0 || max < 0) {
      Alert.alert('Erreur', 'Les valeurs de salaire doivent être des nombres positifs.');
      return false;
    }
    
    if (min > max) {
      Alert.alert('Erreur', 'Le salaire minimum ne peut pas être supérieur au salaire maximum.');
      return false;
    }
    
    if (maxDistance.trim() && (isNaN(parseFloat(maxDistance)) || parseFloat(maxDistance) < 0)) {
      Alert.alert('Erreur', 'La distance maximale doit être un nombre positif.');
      return false;
    }
    
    return true;
  };
  
  // Enregistrer la configuration
  const enregistrerConfiguration = async () => {
    // Validation du formulaire
    if (!validerFormulaire()) return;
    
    try {
      setEnregistrement(true);
      setErreur(null);
      
      const payload: ApplyAIConfigPayload = {
        categories,
        salary_range: {
          min: parseFloat(salaireMin),
          max: parseFloat(salaireMax),
          period: periodeSalaire,
        },
        filters: {
          accommodation,
          children_friendly: childrenFriendly,
          pets_friendly: petsFriendly,
          accessible,
          company_car: companyCar,
        },
        excluded_companies: entreprisesExclues,
        notification_time: formaterHeureAPI(heureNotification),
      };
      
    //   if (maxDistance.trim()) {
    //     payload.filters.max_distance = parseFloat(maxDistance);
    //   }
      
      // Si la configuration existe déjà, mise à jour, sinon création
      let resultat;
      if (configuration?.id) {
        resultat = await applyAiApi.updateConfiguration(configuration.id, payload);
      } else {
        resultat = await applyAiApi.saveConfiguration(payload);
      }
      
      setConfiguration(resultat);
      
      Alert.alert(
        'Configuration enregistrée',
        'Votre configuration ApplyAI a été enregistrée avec succès. Vous recevrez désormais des suggestions d\'emploi basées sur vos préférences.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la configuration :', error);
      setErreur('Impossible d\'enregistrer votre configuration ApplyAI. Veuillez réessayer plus tard.');
    } finally {
      setEnregistrement(false);
    }
  };
  
  // Afficher l'écran de chargement
  if (chargement) {
    return (
      <View style={[styles.chargementContainer, { backgroundColor: theme.couleurs.FOND_SOMBRE }]}>
        <ActivityIndicator size="large" color={theme.couleurs.PRIMAIRE} />
      </View>
    );
  }
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.couleurs.FOND_SOMBRE }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* En-tête explicatif */}
        <View style={styles.section}>
          <Text
            style={[
              styles.titre,
              {
                color: theme.couleurs.TEXTE_PRIMAIRE,
                fontSize: theme.typographie.TAILLES.GRAND,
                fontWeight: theme.typographie.POIDS.GRAS as TextStyle['fontWeight'],
              },
            ]}
          >
            Configuration ApplyAI
          </Text>
          <Text
            style={[
              styles.description,
              { color: theme.couleurs.TEXTE_SECONDAIRE },
            ]}
          >
            ApplyAI vous permet de trouver automatiquement des offres d'emploi correspondant à vos
            critères. Configurez vos préférences ci-dessous et recevez des suggestions chaque jour.
          </Text>
        </View>
        
        {/* Affichage des erreurs */}
        {erreur && (
          <View
            style={[
              styles.erreurContainer,
              { backgroundColor: 'rgba(255, 82, 82, 0.1)', borderColor: theme.couleurs.ERREUR },
            ]}
          >
            <Icon name="alert-circle" size={24} color={theme.couleurs.ERREUR} />
            <Text style={[styles.erreurTexte, { color: theme.couleurs.ERREUR }]}>
              {erreur}
            </Text>
          </View>
        )}
        
        {/* Section Catégories */}
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
            Catégories d'emploi
          </Text>
          <Text
            style={[
              styles.sectionDescription,
              { color: theme.couleurs.TEXTE_SECONDAIRE },
            ]}
          >
            Sélectionnez les catégories d'emploi qui vous intéressent.
          </Text>
          
          {/* Liste des catégories sélectionnées */}
          <View style={styles.tagsContainer}>
            {categories.map((categorie, index) => (
              <View
                key={index}
                style={[
                  styles.tag,
                  { backgroundColor: theme.couleurs.FOND_TERTIAIRE },
                ]}
              >
                <Text style={[styles.tagTexte, { color: theme.couleurs.TEXTE_SECONDAIRE }]}>
                  {categorie}
                </Text>
                <TouchableOpacity
                  onPress={() => supprimerCategorie(index)}
                  style={styles.tagSupprimer}
                >
                  <Icon name="close" size={16} color={theme.couleurs.TEXTE_TERTIAIRE} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
          
          {/* Ajout d'une nouvelle catégorie */}
          <View style={styles.ajoutContainer}>
            <ChampTexte
              placeholder="Ajouter une catégorie"
              value={nouveauCategorie}
              onChangeText={setNouveauCategorie}
              iconDroite="plus-circle"
              onPressIconDroite={ajouterCategorie}
              onSubmitEditing={ajouterCategorie}
              returnKeyType="done"
              style={{ flex: 1 }}
            />
          </View>
        </View>
        
        {/* Section Salaire */}
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
            Fourchette de salaire
          </Text>
          <Text
            style={[
              styles.sectionDescription,
              { color: theme.couleurs.TEXTE_SECONDAIRE },
            ]}
          >
            Indiquez la fourchette de salaire souhaitée.
          </Text>
          
          <View style={styles.rangee}>
            <ChampTexte
              placeholder="Min"
              value={salaireMin}
              onChangeText={setSalaireMin}
              keyboardType="numeric"
              iconGauche="currency-eur"
              style={{ flex: 1, marginRight: 8 }}
            />
            <ChampTexte
              placeholder="Max"
              value={salaireMax}
              onChangeText={setSalaireMax}
              keyboardType="numeric"
              iconGauche="currency-eur"
              style={{ flex: 1 }}
            />
          </View>
          
          {/* Sélection de la période (heure/mois) */}
          <View style={styles.periodeSalaire}>
            <TouchableOpacity
              style={[
                styles.boutonPeriode,
                {
                  backgroundColor: periodeSalaire === 'hour'
                    ? theme.couleurs.PRIMAIRE
                    : theme.couleurs.FOND_TERTIAIRE,
                },
              ]}
              onPress={() => setPeriodeSalaire('hour')}
            >
              <Text
                style={[
                  styles.textePeriode,
                  {
                    color: periodeSalaire === 'hour'
                      ? theme.couleurs.TEXTE_PRIMAIRE
                      : theme.couleurs.TEXTE_SECONDAIRE,
                  },
                ]}
              >
                Par heure
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.boutonPeriode,
                {
                  backgroundColor: periodeSalaire === 'month'
                    ? theme.couleurs.PRIMAIRE
                    : theme.couleurs.FOND_TERTIAIRE,
                },
              ]}
              onPress={() => setPeriodeSalaire('month')}
            >
              <Text
                style={[
                  styles.textePeriode,
                  {
                    color: periodeSalaire === 'month'
                      ? theme.couleurs.TEXTE_PRIMAIRE
                      : theme.couleurs.TEXTE_SECONDAIRE,
                  },
                ]}
              >
                Par mois
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Section Filtres */}
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
            Filtres supplémentaires
          </Text>
          <Text
            style={[
              styles.sectionDescription,
              { color: theme.couleurs.TEXTE_SECONDAIRE },
            ]}
          >
            Affinez votre recherche avec des critères spécifiques.
          </Text>
          
          {/* Options de filtrage */}
          <View style={styles.optionContainer}>
            <Text style={[styles.optionTexte, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>
              Logement de fonction
            </Text>
            <Switch
              value={accommodation}
              onValueChange={setAccommodation}
              trackColor={{ false: theme.couleurs.FOND_TERTIAIRE, true: theme.couleurs.PRIMAIRE }}
              thumbColor={accommodation ? '#ffffff' : '#f4f3f4'}
            />
          </View>
          
          {accommodation && (
            <>
              <View style={styles.optionContainer}>
                <Text style={[styles.optionTexte, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>
                  Logement acceptant les enfants
                </Text>
                <Switch
                  value={childrenFriendly}
                  onValueChange={setChildrenFriendly}
                  trackColor={{ false: theme.couleurs.FOND_TERTIAIRE, true: theme.couleurs.PRIMAIRE }}
                  thumbColor={childrenFriendly ? '#ffffff' : '#f4f3f4'}
                />
              </View>
              
              <View style={styles.optionContainer}>
                <Text style={[styles.optionTexte, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>
                  Logement acceptant les animaux
                </Text>
                <Switch
                  value={petsFriendly}
                  onValueChange={setPetsFriendly}
                  trackColor={{ false: theme.couleurs.FOND_TERTIAIRE, true: theme.couleurs.PRIMAIRE }}
                  thumbColor={petsFriendly ? '#ffffff' : '#f4f3f4'}
                />
              </View>
              
              <View style={styles.optionContainer}>
                <Text style={[styles.optionTexte, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>
                  Logement accessible PMR
                </Text>
                <Switch
                  value={accessible}
                  onValueChange={setAccessible}
                  trackColor={{ false: theme.couleurs.FOND_TERTIAIRE, true: theme.couleurs.PRIMAIRE }}
                  thumbColor={accessible ? '#ffffff' : '#f4f3f4'}
                />
              </View>
            </>
          )}
          
          <View style={styles.optionContainer}>
            <Text style={[styles.optionTexte, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>
              Voiture de fonction
            </Text>
            <Switch
              value={companyCar}
              onValueChange={setCompanyCar}
              trackColor={{ false: theme.couleurs.FOND_TERTIAIRE, true: theme.couleurs.PRIMAIRE }}
              thumbColor={companyCar ? '#ffffff' : '#f4f3f4'}
            />
          </View>
          
          {/* Distance maximale */}
          <ChampTexte
            label="Distance maximale (km)"
            placeholder="ex: 50"
            value={maxDistance}
            onChangeText={setMaxDistance}
            keyboardType="numeric"
            iconGauche="map-marker-radius"
          />
        </View>
        
        {/* Section Entreprises à exclure */}
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
            Entreprises à exclure
          </Text>
          <Text
            style={[
              styles.sectionDescription,
              { color: theme.couleurs.TEXTE_SECONDAIRE },
            ]}
          >
            Ajoutez les entreprises pour lesquelles vous ne souhaitez pas recevoir d'offres.
          </Text>
          
          {/* Liste des entreprises exclues */}
          <View style={styles.tagsContainer}>
            {entreprisesExclues.map((entreprise, index) => (
              <View
                key={index}
                style={[
                  styles.tag,
                  { backgroundColor: theme.couleurs.FOND_TERTIAIRE },
                ]}
              >
                <Text style={[styles.tagTexte, { color: theme.couleurs.TEXTE_SECONDAIRE }]}>
                  {entreprise}
                </Text>
                <TouchableOpacity
                  onPress={() => supprimerEntrepriseExclue(index)}
                  style={styles.tagSupprimer}
                >
                  <Icon name="close" size={16} color={theme.couleurs.TEXTE_TERTIAIRE} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
          
          {/* Ajout d'une nouvelle entreprise à exclure */}
          <View style={styles.ajoutContainer}>
            <ChampTexte
              placeholder="Ajouter une entreprise"
              value={nouvelleEntreprise}
              onChangeText={setNouvelleEntreprise}
              iconDroite="plus-circle"
              onPressIconDroite={ajouterEntrepriseExclue}
              onSubmitEditing={ajouterEntrepriseExclue}
              returnKeyType="done"
              style={{ flex: 1 }}
            />
          </View>
        </View>
        
        {/* Section Heure de notification */}
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
            Heure de notification
          </Text>
          <Text
            style={[
              styles.sectionDescription,
              { color: theme.couleurs.TEXTE_SECONDAIRE },
            ]}
          >
            Choisissez l'heure à laquelle vous souhaitez recevoir vos suggestions quotidiennes.
          </Text>
          
          <TouchableOpacity
            style={[
              styles.selecteurHeure,
              {
                backgroundColor: theme.couleurs.FOND_TERTIAIRE,
                borderColor: theme.couleurs.BORDURE,
              },
            ]}
            onPress={ouvrirSelecteurHeure}
          >
            <Icon name="clock-outline" size={24} color={theme.couleurs.TEXTE_SECONDAIRE} />
            <Text style={[styles.texteHeure, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>
              {formaterHeure(heureNotification)}
            </Text>
            <Icon name="chevron-down" size={24} color={theme.couleurs.TEXTE_SECONDAIRE} />
          </TouchableOpacity>
          
          {/* Date Picker pour l'heure */}
          <DatePicker
            modal
            open={datePickerVisible}
            date={heureNotification}
            onConfirm={confirmerHeure}
            onCancel={() => setDatePickerVisible(false)}
            mode="time"
            locale="fr"
            title="Choisissez l'heure de notification"
            confirmText="Confirmer"
            cancelText="Annuler"
            theme={Platform.OS === 'ios' ? 'dark' : 'auto'} // iOS only
            // textColor={theme.couleurs.TEXTE_PRIMAIRE} // Android only
          />
        </View>
        
        {/* Boutons d'action */}
        <View style={styles.boutons}>
          <Bouton
            titre="Annuler"
            onPress={() => navigation.goBack()}
            variante="outline"
            taille="moyen"
            style={{ marginRight: 16, flex: 1 }}
          />
          <Bouton
            titre="Enregistrer"
            onPress={enregistrerConfiguration}
            variante="primaire"
            taille="moyen"
            charge={enregistrement}
            style={{ flex: 1 }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
  },
  chargementContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 24,
  },
  titre: {
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 16,
  },
  erreurContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  erreurTexte: {
    marginLeft: 8,
    flex: 1,
  },
  sectionTitre: {
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagTexte: {
    fontSize: 14,
  },
  tagSupprimer: {
    marginLeft: 4,
  },
  ajoutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rangee: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  periodeSalaire: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  boutonPeriode: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    marginRight: 8,
  },
  textePeriode: {
    fontWeight: 'bold',
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  optionTexte: {
    fontSize: 16,
    flex: 1,
  },
  selecteurHeure: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  texteHeure: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  boutons: {
    flexDirection: 'row',
    marginTop: 24,
    marginBottom: 32,
  },
});

export default ApplyAIConfig;