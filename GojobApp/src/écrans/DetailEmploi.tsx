import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Share, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../hooks/useTheme';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { fetchJobDetails }  from '../redux/slices/emploisSlice';
import { toggleFavorite } from '../redux/slices/favorisSlice';
import Bouton from '../components/communs/Bouton';
import Icon from 'react-native-vector-icons/Ionicons';
import { AppDispatch, RootState } from '../redux/store';
import { MainNavigatorParamList } from '../types/navigation';

type DetailEmploiProps = {
  route: RouteProp<{ params: { jobId: number } }, 'params'>;
  navigation: StackNavigationProp<any>;
};

export const DetailEmploi: React.FC<DetailEmploiProps> = ({ route, navigation }) => {
  const theme  = useTheme();
  const dispatch = useDispatch<AppDispatch>();
//   const dispatch = useDispatch();
  const { jobId } = route.params;
  
  const { jobDetails, loading, error } = useSelector((state: any) => state.emplois);
  const { favoris } = useSelector((state: any) => state.favoris);
  const { user } = useSelector((state: any) => state.auth);
  
  const [isFavorite, setIsFavorite] = useState(false);
  
  useEffect(() => {
    dispatch(fetchJobDetails(jobId));
  }, [dispatch, jobId]);
  
  useEffect(() => {
    if (favoris) {
      const found = favoris.some((fav: { id: number }) => fav.id === jobId);
      setIsFavorite(found);
    }
  }, [favoris, jobId]);
  
  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(jobId));
    setIsFavorite(!isFavorite);
  };
//   useEffect(() => {
//     dispatch(fetchJobDetails(jobId));
//   }, [dispatch, jobId]);
  
//   useEffect(() => {
//     if (favoris) {
//       const found = favoris.some((fav: any) => fav.id === jobId);
//       setIsFavorite(found);
//     }
//   }, [favoris, jobId]);
  
//   const handleToggleFavorite = () => {
//     dispatch(toggleFavorite(jobId));
//     setIsFavorite(!isFavorite);
//   };
    
  
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Découvre cette offre d'emploi sur GoJobs: ${jobDetails.titre} - ${jobDetails.entreprise} à ${jobDetails.location}`,
      });
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de partager cette offre.');
    }
  };
  
  const handlePostuler = () => {
    // Pour les candidats
    if (user.role === 'candidate') {
      navigation.navigate('Postuler', { jobId });
    } else {
      Alert.alert('Information', 'Vous devez être un candidat pour postuler à cette offre.');
    }
  };
  
  const handleContact = () => {
    navigation.navigate('Conversation', { 
      conversationId: null, 
      newConversation: true,
      receiver: {
        id: jobDetails.employeur.id,
        nom: jobDetails.employeur.nom
      }
    });
  };
  
  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.couleurs.FOND_SOMBRE }]}>
        <Text style={{ color: theme.couleurs.TEXTE_PRIMAIRE }}>Chargement des détails de l'offre...</Text>
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: theme.couleurs.FOND_SOMBRE }]}>
        <Text style={{ color: theme.couleurs.ERREUR }}>Erreur: {error}</Text>
      </View>
    );
  }
  
  if (!jobDetails) {
    return (
      <View style={[styles.container, { backgroundColor: theme.couleurs.FOND_SOMBRE }]}>
        <Text style={{ color: theme.couleurs.TEXTE_PRIMAIRE }}>Offre d'emploi non trouvée.</Text>
      </View>
    );
  }
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.couleurs.FOND_SOMBRE }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={theme.couleurs.TEXTE_PRIMAIRE} />
        </TouchableOpacity>
        
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleToggleFavorite} style={styles.actionButton}>
            <Icon name={isFavorite ? "heart" : "heart-outline"} size={24} color={isFavorite ? "red" : theme.couleurs.TEXTE_PRIMAIRE} />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
            <Icon name="share-social-outline" size={24} color={theme.couleurs.TEXTE_PRIMAIRE} />
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosContainer}>
        {jobDetails.photos.map((photo: string, index: number) => (
          <Image key={index} source={{ uri: photo }} style={styles.photo} />
        ))}
      </ScrollView>
      
      <View style={styles.infoContainer}>
        <Text style={[styles.title, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>{jobDetails.titre}</Text>
        
        <View style={styles.companyContainer}>
          <Image source={{ uri: jobDetails.logo }} style={styles.logo} />
          <View>
            <Text style={[styles.company, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>{jobDetails.entreprise}</Text>
            <Text style={styles.location}>{jobDetails.location}</Text>
          </View>
        </View>
        
        <View style={styles.tagsContainer}>
          <View style={[styles.tag, { backgroundColor: '#EDF7ED' }]}>
            <Text style={{ color: '#4CAF50' }}>{jobDetails.typeContrat}</Text>
          </View>
          
          {jobDetails.logement && (
            <View style={[styles.tag, { backgroundColor: '#E3F2FD' }]}>
              <Text style={{ color: '#2196F3' }}>Logement</Text>
            </View>
          )}
          
          {jobDetails.vehicule && (
            <View style={[styles.tag, { backgroundColor: '#FFF3E0' }]}>
              <Text style={{ color: '#FF9800' }}>Véhicule</Text>
            </View>
          )}
        </View>
        
        <View style={styles.salaryContainer}>
          <Icon name="cash-outline" size={20} color="#666" />
          <Text style={styles.salary}>
            {jobDetails.salaire} € {jobDetails.typeSalaire === 'mensuel' ? '/mois' : '/heure'}
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>Description</Text>
          <Text style={[styles.description, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>{jobDetails.description}</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>Avantages</Text>
          
          <View style={styles.benefitsContainer}>
            {jobDetails.logement && (
              <View style={styles.benefitItem}>
                <Icon name="home-outline" size={20} color="#2196F3" />
                <Text style={styles.benefitText}>Logement de fonction</Text>
                
                {jobDetails.logementEnfants && (
                  <View style={styles.subBenefitItem}>
                    <Icon name="people-outline" size={16} color="#666" />
                    <Text style={styles.subBenefitText}>Enfants acceptés</Text>
                  </View>
                )}
                
                {jobDetails.logementAnimaux && (
                  <View style={styles.subBenefitItem}>
                    <Icon name="paw-outline" size={16} color="#666" />
                    <Text style={styles.subBenefitText}>Animaux acceptés</Text>
                  </View>
                )}
                
                {jobDetails.logementAdapte && (
                  <View style={styles.subBenefitItem}>
                    <Icon name="accessibility-outline" size={16} color="#666" />
                    <Text style={styles.subBenefitText}>Adapté PMR</Text>
                  </View>
                )}
              </View>
            )}
            
            {jobDetails.vehicule && (
              <View style={styles.benefitItem}>
                <Icon name="car-outline" size={20} color="#FF9800" />
                <Text style={styles.benefitText}>Véhicule de fonction</Text>
              </View>
            )}
            
            {jobDetails.debutantAccepte && (
              <View style={styles.benefitItem}>
                <Icon name="school-outline" size={20} color="#9C27B0" />
                <Text style={styles.benefitText}>Débutant accepté</Text>
              </View>
            )}
            
            {jobDetails.visaAccepte && (
              <View style={styles.benefitItem}>
                <Icon name="card-outline" size={20} color="#4CAF50" />
                <Text style={styles.benefitText}>Visa de travail accepté</Text>
              </View>
            )}
            
            {jobDetails.etudiantAccepte && (
              <View style={styles.benefitItem}>
                <Icon name="book-outline" size={20} color="#673AB7" />
                <Text style={styles.benefitText}>Visa étudiant accepté</Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>Contact</Text>
          
          <View style={styles.contactContainer}>
            <Text style={[styles.contactName, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>{jobDetails.contactName}</Text>
            <Text style={styles.contactInfo}>Membre depuis {jobDetails.employeur.memberSince}</Text>
            <Text style={styles.contactInfo}>{jobDetails.employeur.jobCount} annonces publiées</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          onPress={handlePostuler} 
          style={{
            ...styles.actionButton,
            backgroundColor: theme.couleurs.PRIMAIRE,
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderRadius: 8,
            flex: 1,
            alignItems: 'center',
            marginRight: 10
          }}
        >
          <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Postuler</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={handleContact} 
          style={{
            ...styles.actionButton,
            backgroundColor: '#2196F3',
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderRadius: 8,
            flex: 1,
            alignItems: 'center'
          }}
        >
          <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Message</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  photosContainer: {
    height: 250,
  },
  photo: {
    width: 300,
    height: 250,
    marginRight: 10,
    borderRadius: 10,
  },
  infoContainer: {
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  companyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  company: {
    fontSize: 18,
    fontWeight: '500',
  },
  location: {
    fontSize: 16,
    color: '#666',
  },
  tagsContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    flexWrap: 'wrap',
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 5,
  },
  salaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  salary: {
    fontSize: 18,
    color: '#666',
    marginLeft: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  benefitsContainer: {
    marginTop: 10,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  benefitText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 10,
    flex: 1,
  },
  subBenefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 30,
    marginTop: 5,
  },
  subBenefitText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  contactContainer: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
  },
  contactName: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 5,
  },
  contactInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  actionsContainer: {
    flexDirection: 'row',
    padding: 15,
    justifyContent: 'space-between',
  },
});