// src/écrans/flashJobs/DetailFlashJob.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../hooks/useTheme';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TextStyle } from 'react-native';
import Bouton from '../../components/communs/Bouton';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppDispatch, RootState } from '../../redux/store';

type DetailFlashJobProps = {
  route: RouteProp<{ params: { flashJobId: number } }, 'params'>;
  navigation: StackNavigationProp<any>;
};

const DetailFlashJob: React.FC<DetailFlashJobProps> = ({ route, navigation }) => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { flashJobId } = route.params;
  
  const [flashJob, setFlashJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simuler le chargement des données de l'emploi flash
    const chargerDetails = async () => {
      try {
        // Remplacer par l'appel API réel
        setTimeout(() => {
          // Données fictives pour l'exemple
          setFlashJob({
            id: flashJobId,
            titre: "Serveur en restaurant",
            description: "Nous recherchons un serveur pour la soirée du 15 juin...",
            location: "Paris, 75001",
            dateDébut: "2025-06-15T18:00:00",
            dateFin: "2025-06-15T23:00:00",
            salaire: 80,
            entreprise: "Le Bistrot Parisien",
            contact: {
              nom: "Martine Dupont",
              téléphone: "06 12 34 56 78",
              email: "martine@lebistrotparisien.fr"
            },
            photo: "https://example.com/job-photo.jpg"
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Erreur lors du chargement des détails:", error);
        setLoading(false);
      }
    };
    
    chargerDetails();
  }, [flashJobId]);

  const handlePostuler = () => {
    Alert.alert(
      "Postuler",
      "Êtes-vous sûr de vouloir postuler à cet emploi flash ?",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        {
          text: "Postuler",
          onPress: () => {
            // Remplacer par l'action de candidature réelle
            Alert.alert("Succès", "Votre candidature a été envoyée avec succès !");
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.couleurs.FOND_SOMBRE }]}>
        <Text style={{ color: theme.couleurs.TEXTE_PRIMAIRE }}>Chargement des détails...</Text>
      </View>
    );
  }

  if (!flashJob) {
    return (
      <View style={[styles.container, { backgroundColor: theme.couleurs.FOND_SOMBRE }]}>
        <Text style={{ color: theme.couleurs.TEXTE_PRIMAIRE }}>Emploi flash non trouvé</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.couleurs.FOND_SOMBRE }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color={theme.couleurs.TEXTE_PRIMAIRE} />
        </TouchableOpacity>
      </View>

      {flashJob.photo && (
        <Image 
          source={{ uri: flashJob.photo }} 
          style={styles.image}
          resizeMode="cover"
        />
      )}

      <View style={styles.content}>
        <Text style={[styles.titre, { color: theme.couleurs.TEXTE_PRIMAIRE, fontWeight: theme.typographie.POIDS.GRAS as TextStyle['fontWeight'] }]}>
          {flashJob.titre}
        </Text>
        
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Icon name="map-marker" size={20} color={theme.couleurs.PRIMAIRE} />
            <Text style={[styles.infoText, { color: theme.couleurs.TEXTE_SECONDAIRE }]}>
              {flashJob.location}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Icon name="calendar-clock" size={20} color={theme.couleurs.PRIMAIRE} />
            <Text style={[styles.infoText, { color: theme.couleurs.TEXTE_SECONDAIRE }]}>
              {new Date(flashJob.dateDébut).toLocaleString()} - {new Date(flashJob.dateFin).toLocaleTimeString()}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Icon name="currency-eur" size={20} color={theme.couleurs.PRIMAIRE} />
            <Text style={[styles.infoText, { color: theme.couleurs.TEXTE_SECONDAIRE }]}>
              {flashJob.salaire} € pour la mission
            </Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>
            Description
          </Text>
          <Text style={[styles.description, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>
            {flashJob.description}
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>
            Entreprise
          </Text>
          <Text style={[styles.entreprise, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>
            {flashJob.entreprise}
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>
            Contact
          </Text>
          <Text style={[styles.contactName, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>
            {flashJob.contact.nom}
          </Text>
          <Text style={[styles.contactInfo, { color: theme.couleurs.TEXTE_SECONDAIRE }]}>
            Téléphone: {flashJob.contact.téléphone}
          </Text>
          <Text style={[styles.contactInfo, { color: theme.couleurs.TEXTE_SECONDAIRE }]}>
            Email: {flashJob.contact.email}
          </Text>
        </View>
        
        <Bouton 
          titre="Postuler maintenant" 
          onPress={handlePostuler}
          variante="primaire"
          taille="grand"
          style={styles.boutonPostuler}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  image: {
    width: '100%',
    height: 200,
  },
  content: {
    padding: 16,
  },
  titre: {
    fontSize: 24,
    marginBottom: 16,
  },
  infoSection: {
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  entreprise: {
    fontSize: 16,
  },
  contactName: {
    fontSize: 16,
    marginBottom: 4,
  },
  contactInfo: {
    fontSize: 14,
    marginBottom: 4,
  },
  boutonPostuler: {
    marginTop: 16,
    marginBottom: 32,
  },
});

export default DetailFlashJob;