import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Platform,
  Alert,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../hooks/useTheme';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { ProfilNavigatorParamList } from '../../types/navigation';
import { reinitialiser } from '../../redux/slices/authSlice';

// Components
import Bouton from '../../components/communs/Bouton';

// API
import authApi from '../../api/authApi';
import { TextStyle } from 'react-native';

type NavigationProp = NativeStackNavigationProp<ProfilNavigatorParamList, 'MonProfil'>;

export const MonProfil: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();
  
  // Redux state
  const { utilisateur } = useAppSelector(state => state.auth);
  
  // Local state
  const [chargement, setChargement] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  
  // Vérifier si l'utilisateur est un employeur
  const estEmployeur = utilisateur?.role === 'employer';
  
  // Charger les données du profil
  useEffect(() => {
    const chargerProfil = async () => {
      if (!utilisateur) return;
      
      try {
        setChargement(true);
        // On pourrait rafraîchir les données du profil ici
        // Pour l'instant, on utilise simplement les données déjà en mémoire
      } catch (error) {
        console.error('Erreur lors du chargement du profil :', error);
      } finally {
        setChargement(false);
      }
    };
    
    chargerProfil();
  }, [utilisateur]);
  
  // Déconnexion
  const seDeconnecter = async () => {
    try {
      setChargement(true);
      await authApi.deconnexion();
      console.log("On s'est deconnecté 2")
      // dispatch(reinitialiser());
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
      // Même en cas d'erreur, on réinitialise l'état d'authentification
      dispatch(reinitialiser());
    } finally {
      setChargement(false);
    }
  };
  
  // Confirmer la déconnexion
  const confirmerDeconnexion = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Déconnexion',
          onPress: seDeconnecter,
          style: 'destructive',
        },
      ]
    );
  };
  
  // Naviguer vers l'écran d'édition du profil
  const modifierProfil = () => {
    navigation.navigate('EditerProfil');
  };
  
  // Naviguer vers l'écran des abonnements
  const voirAbonnements = () => {
    navigation.navigate('Abonnements');
  };
  
  // Naviguer vers l'écran des contrats
  const voirContrats = () => {
    navigation.navigate('Contrats');
  };
  
  // Naviguer vers l'écran de configuration ApplyAI
  const configurerApplyAI = () => {
    navigation.navigate('ApplyAIConfig');
  };
  
  // Naviguer vers l'écran des offres publiées (pour les employeurs)
  const voirMesOffres = () => {
    navigation.navigate('MesOffres');
  };
  
  // Naviguer vers l'écran des statistiques (pour les employeurs)
  const voirStatistiques = () => {
    navigation.navigate('Statistiques');
  };
  
  // Naviguer vers l'écran des paramètres
  const voirParametres = () => {
    navigation.navigate('Parametres');
  };
  
  // Ouvrir l'URL des conditions d'utilisation
  const ouvrirConditionsUtilisation = () => {
    Linking.openURL('https://www.gojobs.com/conditions-utilisation');
  };
  
  // Ouvrir l'URL de la politique de confidentialité
  const ouvrirPolitiqueConfidentialite = () => {
    Linking.openURL('https://www.gojobs.com/politique-confidentialite');
  };
  
  // Ouvrir le menu d'options
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };
  
  // Afficher l'écran de chargement
  if (chargement) {
    return (
      <View style={[styles.chargementContainer, { backgroundColor: theme.couleurs.FOND_SOMBRE }]}>
        <ActivityIndicator size="large" color={theme.couleurs.PRIMAIRE} />
      </View>
    );
  }
  
  // Afficher un message d'erreur si les données utilisateur ne sont pas disponibles
  if (!utilisateur) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.couleurs.FOND_SOMBRE }]}>
        <View style={styles.erreurContainer}>
          <Icon name="account-alert" size={64} color={theme.couleurs.ERREUR} />
          <Text
            style={[
              styles.erreurTexte,
              {
                color: theme.couleurs.TEXTE_PRIMAIRE,
                fontSize: theme.typographie.TAILLES.MOYEN,
              },
            ]}
          >
            Impossible de charger les données du profil.
          </Text>
          <Bouton
            titre="Réessayer"
            onPress={() => dispatch(reinitialiser())}
            variante="primaire"
            taille="moyen"
            style={{ marginTop: 16 }}
          />
        </View>
      </SafeAreaView>
    );
  }
  
  // Couleurs adaptées à partir du thème existant
  const themeAdapte = {
    ...theme,
    couleurs: {
      ...theme.couleurs,
      SEPARATEUR: '#EEEEEE', // Couleur par défaut pour séparateurs
      CARTE: theme.couleurs.FOND_SECONDAIRE, // On utilise FOND_SECONDAIRE comme équivalent de CARTE
      FOND: theme.couleurs.FOND_TERTIAIRE, // Utiliser FOND_TERTIAIRE comme équivalent de FOND
      BLANC: '#FFFFFF', // Blanc standard
      BLANC_TRANSPARENT: 'rgba(255, 255, 255, 0.7)', // Blanc avec transparence
      PRIMAIRE_TRANSPARENT: 'rgba(33, 150, 243, 0.1)', // Version transparente de PRIMAIRE
    }
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.couleurs.FOND_SOMBRE }]}>
      <StatusBar
        barStyle={Platform.OS === 'ios' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.couleurs.FOND_SOMBRE}
      />
      
      <ScrollView>
        {/* En-tête du profil */}
        <View
          style={[
            styles.enTete,
            {
              backgroundColor: theme.couleurs.PRIMAIRE,
            },
          ]}
        >
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.boutonMenu}
              onPress={toggleMenu}
            >
              <Icon name="dots-vertical" size={24} color="#FFFFFF" /* Utiliser BLANC explicitement */ />
            </TouchableOpacity>
          </View>
          
          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              {utilisateur.profile_details?.avatar ? (
                <Image
                  source={{ uri: utilisateur.profile_details.avatar }}
                  style={styles.avatar}
                />
              ) : (
                <View
                  style={[
                    styles.avatarPlaceholder,
                    {
                      backgroundColor: theme.couleurs.SECONDAIRE,
                    },
                  ]}
                >
                  <Text style={styles.avatarInitials}>
                    {utilisateur.prenom?.[0] || ''}{utilisateur.nom?.[0] || ''}
                  </Text>
                </View>
              )}
              <TouchableOpacity 
                style={styles.editAvatarButton}
                onPress={modifierProfil}
              >
                <Icon name="pencil" size={16} color="#FFFFFF" /* Utiliser BLANC explicitement */ />
              </TouchableOpacity>
            </View>
            
            <Text
              style={[
                styles.nomUtilisateur,
                {
                  color: '#FFFFFF', // Utiliser BLANC explicitement
                  fontSize: theme.typographie.TAILLES.GRAND,
                  fontFamily: 'System', // Utiliser la famille principale directement
                  fontWeight: theme.typographie.POIDS.GRAS as TextStyle['fontWeight'], // Utiliser POIDS au lieu de FAMILLES
                },
              ]}
            >
              {utilisateur.prenom} {utilisateur.nom}
            </Text>
            
            <Text
              style={[
                styles.roleUtilisateur,
                {
                  color: 'rgba(255, 255, 255, 0.7)', // Utiliser BLANC_TRANSPARENT explicitement
                  fontSize: theme.typographie.TAILLES.PETIT,
                  fontFamily: 'System', // Utiliser la famille principale directement
                  fontWeight: theme.typographie.POIDS.NORMAL as TextStyle['fontWeight'], // Utiliser POIDS au lieu de FAMILLES
                },
              ]}
            >
              {estEmployeur ? 'Employeur' : 'Candidat'}
            </Text>
          </View>
        </View>
        
        {/* Menu d'options (affiché conditionnellement) */}
        {menuVisible && (
          <View 
            style={[
              styles.menuOptions,
              {
                backgroundColor: themeAdapte.couleurs.CARTE, // Utiliser notre adaptation
                borderColor: themeAdapte.couleurs.SEPARATEUR, // Utiliser notre adaptation
              }
            ]}
          >
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                modifierProfil();
              }}
            >
              <Icon name="account-edit" size={20} color={theme.couleurs.TEXTE_SECONDAIRE} />
              <Text style={[styles.menuItemText, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>
                Modifier le profil
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                voirParametres();
              }}
            >
              <Icon name="cog" size={20} color={theme.couleurs.TEXTE_SECONDAIRE} />
              <Text style={[styles.menuItemText, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>
                Paramètres
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                confirmerDeconnexion();
              }}
            >
              <Icon name="logout" size={20} color={theme.couleurs.ERREUR} />
              <Text style={[styles.menuItemText, { color: theme.couleurs.ERREUR }]}>
                Se déconnecter
              </Text>
            </TouchableOpacity>
          </View>
        )}
        
        {/* Sections du profil */}
        <View style={styles.sectionContainer}>
          {/* Section Informations Personnelles */}
          <View 
            style={[
              styles.section,
              {
                backgroundColor: themeAdapte.couleurs.CARTE, // Utiliser notre adaptation
                borderColor: themeAdapte.couleurs.SEPARATEUR, // Utiliser notre adaptation
              }
            ]}
          >
            <View style={styles.sectionHeader}>
              <Icon name="account-details" size={24} color={theme.couleurs.PRIMAIRE} />
              <Text 
                style={[
                  styles.sectionTitle,
                  {
                    color: theme.couleurs.TEXTE_PRIMAIRE,
                    fontSize: theme.typographie.TAILLES.MOYEN,
                    fontWeight: theme.typographie.POIDS.GRAS as TextStyle['fontWeight'], // Utiliser POIDS au lieu de FAMILLES
                  }
                ]}
              >
                Informations Personnelles
              </Text>
              <TouchableOpacity onPress={modifierProfil}>
                <Icon name="pencil" size={20} color={theme.couleurs.PRIMAIRE} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.infoRow}>
              <Icon name="email" size={18} color={theme.couleurs.TEXTE_SECONDAIRE} />
              <Text 
                style={[
                  styles.infoText,
                  {
                    color: theme.couleurs.TEXTE_PRIMAIRE,
                    fontSize: theme.typographie.TAILLES.PETIT,
                  }
                ]}
              >
                {utilisateur.email}
              </Text>
            </View>
            
            {utilisateur.telephone && (
              <View style={styles.infoRow}>
                <Icon name="phone" size={18} color={theme.couleurs.TEXTE_SECONDAIRE} />
                <Text 
                  style={[
                    styles.infoText,
                    {
                      color: theme.couleurs.TEXTE_PRIMAIRE,
                      fontSize: theme.typographie.TAILLES.PETIT,
                    }
                  ]}
                >
                  {utilisateur.telephone}
                </Text>
              </View>
            )}
            
            {utilisateur.profile_details?.adresse && (
              <View style={styles.infoRow}>
                <Icon name="map-marker" size={18} color={theme.couleurs.TEXTE_SECONDAIRE} />
                <Text 
                  style={[
                    styles.infoText,
                    {
                      color: theme.couleurs.TEXTE_PRIMAIRE,
                      fontSize: theme.typographie.TAILLES.PETIT,
                    }
                  ]}
                >
                  {utilisateur.profile_details.adresse}
                </Text>
              </View>
            )}
          </View>
          
          {/* Section Abonnement */}
          <View 
            style={[
              styles.section,
              {
                backgroundColor: themeAdapte.couleurs.CARTE, // Utiliser notre adaptation
                borderColor: themeAdapte.couleurs.SEPARATEUR, // Utiliser notre adaptation
              }
            ]}
          >
            <View style={styles.sectionHeader}>
              <Icon name="star" size={24} color={theme.couleurs.PRIMAIRE} />
              <Text 
                style={[
                  styles.sectionTitle,
                  {
                    color: theme.couleurs.TEXTE_PRIMAIRE,
                    fontSize: theme.typographie.TAILLES.MOYEN,
                    fontWeight: theme.typographie.POIDS.GRAS as TextStyle['fontWeight'], // Utiliser POIDS au lieu de FAMILLES
                  }
                ]}
              >
                Abonnement
              </Text>
            </View>
            
            <View 
              style={[
                styles.abonnementCard,
                {
                  backgroundColor: 'rgba(33, 150, 243, 0.1)', // PRIMAIRE_TRANSPARENT explicitement
                  borderColor: theme.couleurs.PRIMAIRE,
                }
              ]}
            >
              <View style={styles.abonnementInfo}>
                <Text 
                  style={[
                    styles.abonnementType,
                    {
                      color: theme.couleurs.PRIMAIRE,
                      fontSize: theme.typographie.TAILLES.MOYEN,
                      fontWeight: theme.typographie.POIDS.GRAS as TextStyle['fontWeight'], // Utiliser POIDS au lieu de FAMILLES
                    }
                  ]}
                >
                  {utilisateur.profile_details?.abonnement?.type || 'Gratuit'}
                </Text>
                
                <Text 
                  style={[
                    styles.abonnementExpiration,
                    {
                      color: theme.couleurs.TEXTE_SECONDAIRE,
                      fontSize: theme.typographie.TAILLES.TRES_PETIT,
                    }
                  ]}
                >
                  {utilisateur.profile_details?.abonnement?.expiration
                    ? `Expire le ${new Date(utilisateur.profile_details.abonnement.expiration).toLocaleDateString()}`
                    : 'Sans date d\'expiration'}
                </Text>
              </View>
              
              <Bouton
                titre="Gérer"
                onPress={voirAbonnements}
                variante="secondaire"
                taille="petit"
              />
            </View>
          </View>
          
          {/* Section des Fonctionnalités */}
          <View 
            style={[
              styles.section,
              {
                backgroundColor: themeAdapte.couleurs.CARTE, // Utiliser notre adaptation
                borderColor: themeAdapte.couleurs.SEPARATEUR, // Utiliser notre adaptation
              }
            ]}
          >
            <View style={styles.sectionHeader}>
              <Icon name="apps" size={24} color={theme.couleurs.PRIMAIRE} />
              <Text 
                style={[
                  styles.sectionTitle,
                  {
                    color: theme.couleurs.TEXTE_PRIMAIRE,
                    fontSize: theme.typographie.TAILLES.MOYEN,
                    fontWeight: theme.typographie.POIDS.GRAS as TextStyle['fontWeight'], // Utiliser POIDS au lieu de FAMILLES
                  }
                ]}
              >
                Fonctionnalités
              </Text>
            </View>
            
            <View style={styles.fonctionnalitesGrid}>
              {/* Fonctionnalités pour tous les utilisateurs */}
              <TouchableOpacity 
                style={[
                  styles.fonctionnaliteItem,
                  {
                    backgroundColor: themeAdapte.couleurs.FOND, // Utiliser notre adaptation
                    borderColor: themeAdapte.couleurs.SEPARATEUR, // Utiliser notre adaptation
                  }
                ]}
                onPress={voirContrats}
              >
                <Icon name="file-document" size={28} color={theme.couleurs.PRIMAIRE} />
                <Text 
                  style={[
                    styles.fonctionnaliteTexte,
                    {
                      color: theme.couleurs.TEXTE_PRIMAIRE,
                      fontSize: theme.typographie.TAILLES.PETIT,
                    }
                  ]}
                >
                  Mes contrats
                </Text>
              </TouchableOpacity>
              
              {!estEmployeur && (
                <TouchableOpacity 
                  style={[
                    styles.fonctionnaliteItem,
                    {
                      backgroundColor: themeAdapte.couleurs.FOND, // Utiliser notre adaptation
                      borderColor: themeAdapte.couleurs.SEPARATEUR, // Utiliser notre adaptation
                    }
                  ]}
                  onPress={configurerApplyAI}
                >
                  <Icon name="robot" size={28} color={theme.couleurs.PRIMAIRE} />
                  <Text 
                    style={[
                      styles.fonctionnaliteTexte,
                      {
                        color: theme.couleurs.TEXTE_PRIMAIRE,
                        fontSize: theme.typographie.TAILLES.PETIT,
                      }
                    ]}
                  >
                    Apply AI
                  </Text>
                </TouchableOpacity>
              )}
              
              {/* Fonctionnalités spécifiques aux employeurs */}
              {estEmployeur && (
                <>
                  <TouchableOpacity 
                    style={[
                      styles.fonctionnaliteItem,
                      {
                        backgroundColor: themeAdapte.couleurs.FOND, // Utiliser notre adaptation
                        borderColor: themeAdapte.couleurs.SEPARATEUR, // Utiliser notre adaptation
                      }
                    ]}
                    onPress={voirMesOffres}
                  >
                    <Icon name="briefcase" size={28} color={theme.couleurs.PRIMAIRE} />
                    <Text 
                      style={[
                        styles.fonctionnaliteTexte,
                        {
                          color: theme.couleurs.TEXTE_PRIMAIRE,
                          fontSize: theme.typographie.TAILLES.PETIT,
                        }
                      ]}
                    >
                      Mes offres
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[
                      styles.fonctionnaliteItem,
                      {
                        backgroundColor: themeAdapte.couleurs.FOND, // Utiliser notre adaptation
                        borderColor: themeAdapte.couleurs.SEPARATEUR, // Utiliser notre adaptation
                      }
                    ]}
                    onPress={voirStatistiques}
                  >
                    <Icon name="chart-bar" size={28} color={theme.couleurs.PRIMAIRE} />
                    <Text 
                      style={[
                        styles.fonctionnaliteTexte,
                        {
                          color: theme.couleurs.TEXTE_PRIMAIRE,
                          fontSize: theme.typographie.TAILLES.PETIT,
                        }
                      ]}
                    >
                      Statistiques
                    </Text>
                  </TouchableOpacity>
                </>
              )}
              
              <TouchableOpacity 
                style={[
                  styles.fonctionnaliteItem,
                  {
                    backgroundColor: themeAdapte.couleurs.FOND, // Utiliser notre adaptation
                    borderColor: themeAdapte.couleurs.SEPARATEUR, // Utiliser notre adaptation
                  }
                ]}
                onPress={voirParametres}
              >
                <Icon name="cog" size={28} color={theme.couleurs.PRIMAIRE} />
                <Text 
                  style={[
                    styles.fonctionnaliteTexte,
                    {
                      color: theme.couleurs.TEXTE_PRIMAIRE,
                      fontSize: theme.typographie.TAILLES.PETIT,
                    }
                  ]}
                >
                  Paramètres
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Section d'aide et support */}
          <View 
            style={[
              styles.section,
              {
                backgroundColor: themeAdapte.couleurs.CARTE, // Utiliser notre adaptation
                borderColor: themeAdapte.couleurs.SEPARATEUR, // Utiliser notre adaptation
              }
            ]}
          >
            <View style={styles.sectionHeader}>
              <Icon name="help-circle" size={24} color={theme.couleurs.PRIMAIRE} />
              <Text 
                style={[
                  styles.sectionTitle,
                  {
                    color: theme.couleurs.TEXTE_PRIMAIRE,
                    fontSize: theme.typographie.TAILLES.MOYEN,
                    fontWeight: theme.typographie.POIDS.GRAS as TextStyle['fontWeight'], // Utiliser POIDS au lieu de FAMILLES
                  }
                ]}
              >
                Aide et support
              </Text>
            </View>
            
            <TouchableOpacity 
              style={styles.supportItem}
              onPress={() => Linking.openURL('https://www.gojobs.com/faq')}
            >
              <Icon name="frequently-asked-questions" size={20} color={theme.couleurs.TEXTE_SECONDAIRE} />
              <Text 
                style={[
                  styles.supportText,
                  {
                    color: theme.couleurs.TEXTE_PRIMAIRE,
                    fontSize: theme.typographie.TAILLES.PETIT,
                  }
                ]}
              >
                FAQ
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.supportItem}
              onPress={() => Linking.openURL('mailto:support@gojobs.com')}
            >
              <Icon name="email" size={20} color={theme.couleurs.TEXTE_SECONDAIRE} />
              <Text 
                style={[
                  styles.supportText,
                  {
                    color: theme.couleurs.TEXTE_PRIMAIRE,
                    fontSize: theme.typographie.TAILLES.PETIT,
                  }
                ]}
              >
                Contacter le support
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.supportItem}
              onPress={ouvrirConditionsUtilisation}
            >
              <Icon name="file-document" size={20} color={theme.couleurs.TEXTE_SECONDAIRE} />
              <Text 
                style={[
                  styles.supportText,
                  {
                    color: theme.couleurs.TEXTE_PRIMAIRE,
                    fontSize: theme.typographie.TAILLES.PETIT,
                  }
                ]}
              >
                Conditions d'utilisation
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.supportItem}
              onPress={ouvrirPolitiqueConfidentialite}
            >
              <Icon name="shield-account" size={20} color={theme.couleurs.TEXTE_SECONDAIRE} />
              <Text 
                style={[
                  styles.supportText,
                  {
                    color: theme.couleurs.TEXTE_PRIMAIRE,
                    fontSize: theme.typographie.TAILLES.PETIT,
                  }
                ]}
              >
                Politique de confidentialité
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Bouton de déconnexion */}
          <Bouton
            titre="Se déconnecter"
            onPress={confirmerDeconnexion}
            variante="danger"
            taille="moyen"
            style={styles.boutonDeconnexion}
            icone="logout"
          />
          
          {/* Version de l'application */}
          <Text 
            style={[
              styles.versionText,
              {
                color: theme.couleurs.TEXTE_TERTIAIRE,
                fontSize: theme.typographie.TAILLES.TRES_PETIT,
              }
            ]}
          >
            Version 1.0.0
          </Text>
        </View>
      </ScrollView>
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
    padding: 20,
  },
  erreurTexte: {
    textAlign: 'center',
    marginTop: 16,
  },
  enTete: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  boutonMenu: {
    padding: 8,
  },
  profileInfo: {
    alignItems: 'center',
    marginTop: 10,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#00000080',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nomUtilisateur: {
    textAlign: 'center',
    marginBottom: 4,
  },
  roleUtilisateur: {
    textAlign: 'center',
  },
  menuOptions: {
    position: 'absolute',
    top: 50,
    right: 16,
    borderRadius: 8,
    borderWidth: 1,
    padding: 8,
    zIndex: 100,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuItemText: {
    marginLeft: 12,
    fontSize: 16,
  },
  sectionContainer: {
    padding: 16,
  },
  section: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    flex: 1,
    marginLeft: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    marginLeft: 10,
  },
  abonnementCard: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  abonnementInfo: {
    flex: 1,
  },
  abonnementType: {
    marginBottom: 4,
  },
  abonnementExpiration: {},
  fonctionnalitesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  fonctionnaliteItem: {
    width: '48%',
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  fonctionnaliteTexte: {
    marginTop: 8,
    textAlign: 'center',
  },
  supportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  supportText: {
    marginLeft: 10,
  },
  boutonDeconnexion: {
    marginVertical: 16,
  },
  versionText: {
    textAlign: 'center',
    marginBottom: 20,
  },
});