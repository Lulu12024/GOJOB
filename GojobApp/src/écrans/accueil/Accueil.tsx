import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';
import { MainNavigationProp } from '../../types/navigation';

// Composants
import Bouton from '../../components/communs/Bouton';

interface JobOffer {
  id: string;
  title: string;
  company: string;
  location: string;
  time: string;
  image: any;
}

const AccueilScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<MainNavigationProp<'Tabs'>>();

  // États pour gérer les différentes sections
  const [searchQuery, setSearchQuery] = useState('');

  // Exemples de données (à remplacer par des données dynamiques)
  const recommendedJobs: JobOffer[] = [
    {
      id: '1',
      title: 'Paysagiste',
      company: 'Amazon',
      location: 'Rennes',
      time: '3m',
      image: require('../../assets/images/paysagiste.jpg')
    },
  ];

  const flashJobs: JobOffer[] = [
    {
      id: '2',
      title: 'Remplacement urgent - Paysagiste',
      company: 'Amazon',
      location: 'Rennes',
      time: '3m',
      image: require('../../assets/images/paysagiste.jpg')
    },
  ];

//   const navigateToDetailEmploi = (jobId: string) => {
//     navigation.navigate('DetailEmploi', { jobId });
//   };

//   const navigateToDetailFlashJob = (jobId: string) => {
//     navigation.navigate('DetailFlashJob', { jobId });
//   };

//   const navigateToFiltrageRecherche = () => {
//     navigation.navigate('FiltrageRecherche', { 
//       fromScreen: 'Tabs',
//       onApply: (filtres) => {
//         // Logique de traitement des filtres
//         console.log('Filtres appliqués:', filtres);
//       }
//     });
//   };

  return (
    <ScrollView 
      style={[
        styles.container, 
        { backgroundColor: theme.couleurs.FOND_SOMBRE }
      ]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Barre de recherche */}
      <View style={styles.searchContainer}>
        <TextInput
          style={[
            styles.searchInput, 
            { 
              backgroundColor: theme.couleurs.FOND_SECONDAIRE,
              color: theme.couleurs.TEXTE_PRIMAIRE 
            }
          ]}
          placeholder="Search Jobs"
          placeholderTextColor={theme.couleurs.TEXTE_SECONDAIRE}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity 
          style={[
            styles.filterButton, 
            { backgroundColor: theme.couleurs.PRIMAIRE }
          ]}
        //   onPress={navigateToFiltrageRecherche}
        >
          <Text style={{ color: 'white' }}>Filtres</Text>
        </TouchableOpacity>
      </View>

      {/* Section Recommandations */}
      <View style={styles.sectionContainer}>
        <Text 
          style={[
            styles.sectionTitle, 
            { color: theme.couleurs.TEXTE_PRIMAIRE }
          ]}
        >
          Recommandation pour vous
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {recommendedJobs.map(job => (
            <TouchableOpacity 
              key={job.id} 
              style={styles.jobCard}
            //   onPress={() => navigateToDetailEmploi(job.id)}
            >
              <View style={styles.jobCardContent}>
                <Text style={{ color: theme.couleurs.TEXTE_PRIMAIRE }}>{job.title}</Text>
                <Text style={{ color: theme.couleurs.TEXTE_SECONDAIRE }}>{job.company}</Text>
                <Text style={{ color: theme.couleurs.TEXTE_SECONDAIRE }}>{job.location}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Section Flash Jobs */}
      <View style={styles.sectionContainer}>
        <Text 
          style={[
            styles.sectionTitle, 
            { color: theme.couleurs.TEXTE_PRIMAIRE }
          ]}
        >
          Flash Jobs
        </Text>
        {flashJobs.map(job => (
          <TouchableOpacity 
            key={job.id} 
            style={styles.flashJobCard}
            // onPress={() => navigateToDetailFlashJob(job.id)}
          >
            <View style={styles.flashJobCardContent}>
              <Text style={{ color: theme.couleurs.TEXTE_PRIMAIRE }}>{job.title}</Text>
              <Text style={{ color: theme.couleurs.TEXTE_SECONDAIRE }}>{job.company}</Text>
              <Text style={{ color: theme.couleurs.TEXTE_SECONDAIRE }}>{job.location}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bouton Publier une offre */}
      <Bouton 
        titre="Publier une offre" 
        onPress={() => navigation.navigate('PublierEmploi')}
        variante="primaire"
        style={styles.publishButton}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  filterButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  sectionContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  jobCard: {
    marginRight: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  jobCardContent: {
    width: 150,
  },
  flashJobCard: {
    marginBottom: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  flashJobCardContent: {
    // Styles spécifiques si nécessaire
  },
  publishButton: {
    marginTop: 16,
  },
});

export default AccueilScreen;