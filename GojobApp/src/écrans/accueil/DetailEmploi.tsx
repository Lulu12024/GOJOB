import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Dimensions,
  Share,
  Alert,
  Modal,
  Platform,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../hooks/useTheme';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { AccueilNavigatorParamList, MainNavigatorParamList } from '../../types/navigation';
import { Emploi } from '../../api/jobsApi';
import { ajouterFavori, retirerFavori } from '../../redux/slices/emploisSlice';
import { TextStyle } from 'react-native';
// Composants
import Bouton from '../../components/communs/Bouton';
import { TextStyle as RNTextStyle } from 'react-native';
// API
import jobsApi from '../../api/jobsApi';
import applicationsApi from '../../api/applicationsApi';
import * as DocumentPicker from 'react-native-document-picker';

// Constantes
const LARGEUR_ECRAN = Dimensions.get('window').width;

type DetailEmploiRouteProp = RouteProp<AccueilNavigatorParamList, 'DetailEmploi'>;

const DetailEmploi: React.FC = () => {
  const theme = useTheme();
  const route = useRoute<DetailEmploiRouteProp>();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  
  // Redux state
  const { favoris } = useAppSelector(state => state.emplois);
  const { utilisateur } = useAppSelector(state => state.auth);
  
  // Local state
  const [emploi, setEmploi] = useState<Emploi | null>(null);
  const [chargement, setChargement] = useState(true);
  const [indexImage, setIndexImage] = useState(0);
  const [estFavori, setEstFavori] = useState(false);
  const [envoyerCandidature, setEnvoyerCandidature] = useState(false);
  
  // Modal application states
  const [applicationModalVisible, setApplicationModalVisible] = useState(false);
  const [cv, setCV] = useState<any>(null);
  const [lettre, setLettre] = useState<any>(null);
  
  // Récupérer l'ID de l'emploi depuis les paramètres de route
  const { id, emploi: emploiParam } = route.params as { id?: number; emploi?: Emploi };
  
  // Vérifier si l'utilisateur est un employeur
  const estEmployeur = utilisateur?.role === 'employer';
  
  // Charger les détails de l'emploi
  useEffect(() => {
    const chargerEmploi = async () => {
      try {
        setChargement(true);
        
        // Si l'emploi est déjà fourni dans les paramètres, l'utiliser
        if (emploiParam) {
          setEmploi(emploiParam);
          if (emploiParam.id) {
            await jobsApi.viewJob(emploiParam.id);
          }

        } else if (id) {
          // Sinon, charger depuis l'API
          const emploiData = await jobsApi.getEmploi(id);
          setEmploi(emploiData);

          // Enregistrer une vue pour cette offre d'emploi
          await jobsApi.viewJob(id);
        }
        
        // Vérifier si l'emploi est dans les favoris
        if (id && favoris.includes(id)) {
          setEstFavori(true);
        } else if (emploiParam && favoris.includes(emploiParam.id)) {
          setEstFavori(true);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des détails de l\'emploi :', error);
        Alert.alert('Erreur', 'Impossible de charger les détails de cette offre d\'emploi.');
      } finally {
        setChargement(false);
      }
    };
    
    chargerEmploi();
  }, [id, emploiParam, favoris]);
  
  // Gérer le toggle des favoris
  const gererFavori = async () => {
    if (!emploi) return;
    
    try {
      // Optimistic UI update
      setEstFavori(!estFavori);
      
      if (estFavori) {
        dispatch(retirerFavori(emploi.id));
      } else {
        dispatch(ajouterFavori(emploi.id));
      }
      
      // API call
      await jobsApi.toggleFavori(emploi.id);
    } catch (error) {
      console.error('Erreur lors de la gestion des favoris :', error);
      
      // Rollback en cas d'erreur
      setEstFavori(!estFavori);
      
      if (estFavori) {
        dispatch(ajouterFavori(emploi.id));
      } else {
        dispatch(retirerFavori(emploi.id));
      }
      
      Alert.alert('Erreur', 'Impossible de mettre à jour les favoris.');
    }
  };
  
  // Partager l'offre d'emploi
  const partagerEmploi = async () => {
    if (!emploi) return;
    
    try {
      await Share.share({
        title: emploi.title,
        message: `Découvrez cette offre d'emploi : ${emploi.title} à ${emploi.city || emploi.address || ''}. Plus d'informations sur GoJobs !`,
      });
    } catch (error) {
      console.error('Erreur lors du partage :', error);
    }
  };
  
  // Sélectionner un CV
  const selectCV = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.docx],
      });
      setCV(result[0]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // L'utilisateur a annulé
      } else {
        Alert.alert('Erreur', 'Impossible de sélectionner le CV.');
      }
    }
  };
  
  // Sélectionner une lettre de motivation
  const selectLettre = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.docx],
      });
      setLettre(result[0]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // L'utilisateur a annulé
      } else {
        Alert.alert('Erreur', 'Impossible de sélectionner la lettre de motivation.');
      }
    }
  };
  
  // Soumettre la candidature
  const envoyerApplication = async () => {
    if (!emploi || !utilisateur) return;
    
    if (!cv) {
      Alert.alert('Erreur', 'Veuillez sélectionner votre CV.');
      return;
    }
    
    try {
      setEnvoyerCandidature(true);
      
      // Appel API pour postuler
      const success = await applicationsApi.postuler(emploi.id, utilisateur.id, cv, lettre);
      
      if (success) {
        Alert.alert(
          'Candidature envoyée',
          'Votre candidature a été envoyée avec succès. L\'employeur vous contactera bientôt.',
          [{ text: 'OK' }]
        );
        setApplicationModalVisible(false);
      } else {
        Alert.alert('Erreur', 'Un problème est survenu lors de l\'envoi de votre candidature.');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la candidature :', error);
      Alert.alert('Erreur', 'Impossible d\'envoyer votre candidature. Veuillez réessayer plus tard.');
    } finally {
      setEnvoyerCandidature(false);
    }
  };
  
  // Afficher le modal de candidature
  const ouvrirModalCandidature = () => {
    if (!utilisateur) {
      Alert.alert(
        'Connexion requise',
        'Vous devez être connecté pour postuler à cette offre.',
        [
          { text: 'Annuler', style: 'cancel' },
          { 
            text: 'Se connecter', 
            onPress: () => {
              // Correction de la navigation
              // @ts-ignore - Nous savons que cette route existe
              navigation.navigate('Auth', { screen: 'Connexion' });
            } 
          }
        ]
      );
      return;
    }
    
    if (estEmployeur) {
      Alert.alert('Information', 'Vous ne pouvez pas postuler en tant qu\'employeur.');
      return;
    }
    
    setApplicationModalVisible(true);
  };
  
  // Contacter l'employeur par message
  const envoyerMessage = () => {
    if (!emploi || !utilisateur) {
      Alert.alert(
        'Connexion requise',
        'Vous devez être connecté pour envoyer un message.',
        [
          { text: 'Annuler', style: 'cancel' },
          { 
            text: 'Se connecter', 
            onPress: () => {
              // Correction de la navigation
              // @ts-ignore - Nous savons que cette route existe
              navigation.navigate('Auth', { screen: 'Connexion' });
            } 
          }
        ]
      );
      return;
    }
    
    // Récupérer l'ID de l'employeur
    const employerId = typeof emploi.employer === 'object' ? emploi.employer.id : emploi.employer;
    const employerName = typeof emploi.employer === 'object' 
      ? `${emploi.employer.first_name || ''} ${emploi.employer.last_name || ''}` 
      : (emploi.entreprise || emploi.contact_name || '');
    console.log("navigation vers message");
    // Naviguer vers l'écran de conversation
    // @ts-ignore - On ignore l'erreur de type de navigation
    
    navigation.navigate('Tabs', {
      screen: 'Conversation',
      params: {
        screen: 'Conversation',
        params: {
          conversationId: employerId,
          nom: employerName,
        },
      },
    });
    // navigation.navigate('Conversation', { 
    //   conversationId: null, 
    //   newConversation: true,
    //   receiver: {
    //     id: employerId,
    //     nom: employerName
    //   }
    // });
    
  };
  
  // Modifier l'offre d'emploi (pour les employeurs)
  const modifierEmploi = () => {
    if (!emploi) return;
    
    // @ts-ignore - On ignore l'erreur de type de navigation
    navigation.navigate('EditerEmploi', { emploiId: emploi.id });
  };
  
  // Afficher les photos de l'offre d'emploi
  const renderPhotos = () => {
    if (!emploi || !emploi.logo ) {
      
      // Image par défaut si aucune photo n'est disponible
      return (
        <Image
          source={require('../../assets/images/job-placeholder.png')}
          style={styles.photoEmploi}
          resizeMode="cover"
        />
      );
    }
    
    return (
      <View>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={(event) => {
            const offset = event.nativeEvent.contentOffset.x;
            const page = Math.round(offset / LARGEUR_ECRAN);
            setIndexImage(page);
          }}
          scrollEventThrottle={16}
        >
          <Image
              source={{ uri: emploi.logo }}
              style={styles.photoEmploi}
              resizeMode="cover"
            />
          {emploi.photos.map((photo, index) => (
            <Image
              key={index}
              source={{ uri: photo }}
              style={styles.photoEmploi}
              resizeMode="cover"
            />
          ))}
        </ScrollView>
        
        {/* Indicateurs de pages pour les photos */}
        {emploi.photos.length > 1 && (
          <View style={styles.indicateurContainer}>
            {emploi.photos.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicateur,
                  {
                    backgroundColor: indexImage === index
                      ? theme.couleurs.PRIMAIRE
                      : theme.couleurs.TEXTE_TERTIAIRE,
                  },
                ]}
              />
            ))}
          </View>
        )}
      </View>
    );
  };
  
  // Afficher l'écran de chargement
  if (chargement) {
    return (
      <View style={[styles.chargementContainer, { backgroundColor: theme.couleurs.FOND_SOMBRE }]}>
        <ActivityIndicator size="large" color={theme.couleurs.PRIMAIRE} />
      </View>
    );
  }
  
  // Afficher un message d'erreur si les données ne sont pas disponibles
  if (!emploi) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.couleurs.FOND_SOMBRE }]}>
        <View style={styles.erreurContainer}>
          <Icon name="alert-circle-outline" size={48} color={theme.couleurs.ERREUR} />
          <Text style={[styles.erreurTexte, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>
            Impossible de charger les détails de cette offre d'emploi.
          </Text>
          <Bouton
            titre="Retour"
            onPress={() => navigation.goBack()}
            variante="primaire"
            taille="moyen"
            style={{ marginTop: 16 }}
          />
        </View>
      </SafeAreaView>
    );
  }
  
  // Déterminer les valeurs à afficher
  const displayTitle = emploi.titre || emploi.title;
  const displayCompany = emploi.entreprise || 
    (typeof emploi.employer === 'object' ? emploi.employer.company_name || '' : '');
  const displayLocation = emploi.address || emploi.city || '';
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.couleurs.FOND_SOMBRE }]}>
      <ScrollView>
        {/* Photos de l'emploi */}
        {renderPhotos()}
        
        {/* Corps du contenu */}
        <View style={styles.corpsContenu}>
          {/* En-tête avec titre et actions */}
          <View style={styles.enTete}>
            <View style={styles.titreContainer}>
              <Text
                style={[
                  styles.titre,
                  {
                    color: theme.couleurs.TEXTE_PRIMAIRE,
                    fontSize: theme.typographie.TAILLES.TRES_GRAND,
                    fontWeight: theme.typographie.POIDS.GRAS as TextStyle['fontWeight'],
                  },
                ]}
              >
                {displayTitle}
              </Text>
              <Text
                style={[
                  styles.entreprise,
                  {
                    color: theme.couleurs.TEXTE_SECONDAIRE,
                    fontSize: theme.typographie.TAILLES.MOYEN,
                  },
                ]}
              >
                {displayCompany}
              </Text>
            </View>
            
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={[
                  styles.boutonIcone,
                  { backgroundColor: theme.couleurs.FOND_TERTIAIRE },
                ]}
                onPress={gererFavori}
              >
                <Icon
                  name={estFavori ? 'heart' : 'heart-outline'}
                  size={24}
                  color={estFavori ? theme.couleurs.ERREUR : theme.couleurs.TEXTE_SECONDAIRE}
                />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.boutonIcone,
                  { backgroundColor: theme.couleurs.FOND_TERTIAIRE },
                ]}
                onPress={partagerEmploi}
              >
                <Icon
                  name="share-variant"
                  size={24}
                  color={theme.couleurs.TEXTE_SECONDAIRE}
                />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Badges d'état */}
          <View style={styles.badgesContainer}>
            {emploi.is_urgent && (
              <View style={[styles.badge, { backgroundColor: theme.couleurs.URGENT }]}>
                <Text style={styles.badgeTexte}>URGENT</Text>
              </View>
            )}
            {emploi.is_new && (
              <View style={[styles.badge, { backgroundColor: theme.couleurs.NOUVELLE }]}>
                <Text style={styles.badgeTexte}>NOUVEAU</Text>
              </View>
            )}
            {emploi.contract_type && (
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor: theme.couleurs.FOND_TERTIAIRE,
                    borderWidth: 1,
                    borderColor: theme.couleurs.BORDURE,
                  },
                ]}
              >
                <Text style={[styles.badgeTexte, { color: theme.couleurs.TEXTE_SECONDAIRE }]}>
                  {emploi.typeContrat || emploi.contract_type}
                </Text>
              </View>
            )}
          </View>
          
          {/* Détails principaux */}
          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Icon name="map-marker" size={20} color={theme.couleurs.TEXTE_SECONDAIRE} />
              <Text style={[styles.detailTexte, { color: theme.couleurs.TEXTE_SECONDAIRE }]}>
                {displayLocation}
              </Text>
            </View>
            
            <View style={styles.detailItem}>
              <Icon name="currency-eur" size={20} color={theme.couleurs.TEXTE_SECONDAIRE} />
              <Text style={[styles.detailTexte, { color: theme.couleurs.TEXTE_SECONDAIRE }]}>
                {emploi.salaire || emploi.salary_amount
                  ? `${emploi.salaire || emploi.salary_amount} € / ${
                      (emploi.typeSalaire === 'horaire' || emploi.salary_type === 'hourly') ? 'heure' : 'mois'
                    }`
                  : 'Salaire non précisé'}
              </Text>
            </View>
            
            {emploi.has_accommodation && (
              <View style={styles.detailItem}>
                <Icon name="home" size={20} color={theme.couleurs.TEXTE_SECONDAIRE} />
                <Text style={[styles.detailTexte, { color: theme.couleurs.TEXTE_SECONDAIRE }]}>
                  Logement inclus
                  {emploi.accommodation_accepts_children && ' (enfants acceptés)'}
                  {emploi.accommodation_accepts_dogs && ' (animaux acceptés)'}
                  {emploi.accommodation_is_accessible && ' (accessible PMR)'}
                </Text>
              </View>
            )}
          </View>
          
          {/* Séparateur */}
          <View style={[styles.separateur, { backgroundColor: theme.couleurs.DIVIDER }]} />
          
          {/* Description de l'emploi */}
          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitre,
                {
                  color: theme.couleurs.TEXTE_PRIMAIRE,
                  fontSize: theme.typographie.TAILLES.GRAND,
                  fontWeight: theme.typographie.POIDS.GRAS as TextStyle['fontWeight'],
                },
              ]}
            >
              Description
            </Text>
            <Text style={[styles.descriptionTexte, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>
              {emploi.description}
            </Text>
          </View>
        </View>
      </ScrollView>
      
      {/* Modal de candidature */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={applicationModalVisible}
        onRequestClose={() => setApplicationModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: theme.couleurs.FOND_SECONDAIRE }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>
                Postuler à cette offre
              </Text>
              <TouchableOpacity onPress={() => setApplicationModalVisible(false)}>
                <Icon name="close" size={24} color={theme.couleurs.TEXTE_SECONDAIRE} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
              <Text style={[styles.modalLabel, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>
                Votre CV *
              </Text>
              <TouchableOpacity
                style={[styles.fileSelector, { borderColor: theme.couleurs.BORDURE }]}
                onPress={selectCV}
              >
                <Icon name="file-pdf-box" size={24} color={theme.couleurs.PRIMAIRE} />
                <Text style={[styles.fileSelectorText, { color: theme.couleurs.TEXTE_SECONDAIRE }]}>
                  {cv ? cv.name : 'Sélectionner votre CV'}
                </Text>
              </TouchableOpacity>
              
              <Text style={[styles.modalLabel, { color: theme.couleurs.TEXTE_PRIMAIRE, marginTop: 16 }]}>
                Lettre de motivation (optionnel)
              </Text>
              <TouchableOpacity
                style={[styles.fileSelector, { borderColor: theme.couleurs.BORDURE }]}
                onPress={selectLettre}
              >
                <Icon name="file-document-outline" size={24} color={theme.couleurs.PRIMAIRE} />
                <Text style={[styles.fileSelectorText, { color: theme.couleurs.TEXTE_SECONDAIRE }]}>
                  {lettre ? lettre.name : 'Sélectionner votre lettre de motivation'}
                </Text>
              </TouchableOpacity>
              
              <Text style={[styles.requiredNote, { color: theme.couleurs.TEXTE_TERTIAIRE }]}>
                * Champ obligatoire
              </Text>
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <Bouton
                titre="Annuler"
                onPress={() => setApplicationModalVisible(false)}
                variante="outline"
                taille="moyen"
                style={{ flex: 1, marginRight: 8 }}
              />
              <Bouton
                titre="Envoyer ma candidature"
                onPress={envoyerApplication}
                variante="primaire"
                taille="moyen"
                charge={envoyerCandidature}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Barre d'actions en bas de l'écran */}
      <View
        style={[
          styles.barreActions,
          {
            backgroundColor: theme.couleurs.FOND_SECONDAIRE,
            borderTopColor: theme.couleurs.DIVIDER,
          },
        ]}
      >
        {/* Actions pour les candidats */}
        {!estEmployeur && (
          <View style={styles.actionsPostuler}>
            <Bouton
              titre="Postuler"
              onPress={ouvrirModalCandidature}
              variante="primaire"
              taille="moyen"
              style={{ flex: 1, marginRight: 8 }}
            />
            <Bouton
              titre="Message"
              onPress={envoyerMessage}
              variante="secondaire"
              taille="moyen"
              icone={<Icon name="message-text" size={20} color={theme.couleurs.TEXTE_PRIMAIRE} />}
              style={{ flex: 1 }}
            />
          </View>
        )}
        
        {/* Actions pour les employeurs */}
        {estEmployeur && (
          <View style={styles.actionsEmployeur}>
            <Bouton
              titre="Modifier"
              onPress={modifierEmploi}
              variante="outline"
              taille="moyen"
              icone={<Icon name="pencil" size={20} color={theme.couleurs.PRIMAIRE} />}
              iconePosition="gauche"
              style={{ flex: 1, marginRight: 8 }}
            />
            <Bouton
              titre="Statistiques"
              onPress={() => {
                // Naviguer vers les statistiques de l'offre
                // @ts-ignore - On ignore l'erreur de type de navigation
                navigation.navigate('Tabs', {
                  screen: 'ProfilTab',
                  params: {
                    screen: 'Statistiques',
                    params: { jobId: emploi.id },
                  },
                });
              }}
              variante="primaire"
              taille="moyen"
              icone={<Icon name="chart-line" size={20} color="white" />}
              iconePosition="gauche"
              style={{ flex: 1 }}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chargementContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  erreurContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  erreurTexte: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 16,
  },
  photoEmploi: {
    width: LARGEUR_ECRAN,
    height: 250,
  },
  indicateurContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
  },
  indicateur: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  corpsContenu: {
    padding: 16,
  },
  enTete: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titreContainer: {
    flex: 1,
  },
  titre: {
    marginBottom: 4,
  },
  entreprise: {
    marginBottom: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    marginLeft: 16,
  },
  boutonIcone: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  badgeTexte: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  detailsContainer: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailTexte: {
    fontSize: 16,
    marginLeft: 8,
  },
  separateur: {
    height: 1,
    marginVertical: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitre: {
    marginBottom: 12,
  },
  descriptionTexte: {
    fontSize: 16,
    lineHeight: 24,
  },
  barreActions: {
    padding: 16,
    borderTopWidth: 1,
  },
  actionsPostuler: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionsEmployeur: {
    flexDirection: 'row',
  },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalContent: {
    maxHeight: 400,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  fileSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  fileSelectorText: {
    marginLeft: 12,
    fontSize: 16,
  },
  requiredNote: {
    fontSize: 12,
    marginTop: 16,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  modalFooter: {
    flexDirection: 'row',
    marginTop: 20,
  },
})

export default DetailEmploi;