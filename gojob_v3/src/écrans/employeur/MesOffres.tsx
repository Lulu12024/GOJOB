import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../hooks/useTheme';
import { CarteOffre } from '../../components/CarteOffre';
import { setChargement, setErreur } from '../../redux/slices/emploisSlice';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { Alert } from 'react-native';
import jobsApi from '../../api/jobsApi';
import { AppDispatch } from '../../redux/store';

type MesOffresProps = {
  navigation: StackNavigationProp<any>;
};

export const MesOffres: React.FC<MesOffresProps> = ({ navigation }) => {
  const theme = useTheme(); // Utilisez le thème correctement
  const dispatch = useDispatch<AppDispatch>(); // Typez le dispatch
  const { employerJobs = [], loading, error } = useSelector((state: any) => state.emplois);

  // Fonction pour charger les offres d'emploi de l'employeur
  const fetchEmployerJobs = async () => {
    try {
      dispatch(setChargement(true));
      const jobs = await jobsApi.getEmployerJobs();
      // Ajoutez cette propriété à votre state ou modifiez le sélecteur
      // Dans un cas réel, vous pourriez vouloir ajouter cette action dans votre slice
      dispatch({ type: 'emplois/setEmployerJobs', payload: jobs });
      dispatch(setChargement(false));
    } catch (err: any) {
      dispatch(setErreur(err.message || 'Impossible de charger vos offres'));
      dispatch(setChargement(false));
    }
  };

  // Fonction pour supprimer une offre d'emploi
  const deleteJob = async (jobId: number) => {
    try {
      dispatch(setChargement(true));
      await jobsApi.deleteJob(jobId);
      // Rechargez la liste après suppression
      fetchEmployerJobs();
    } catch (err: any) {
      dispatch(setErreur(err.message || 'Impossible de supprimer l\'offre'));
      dispatch(setChargement(false));
    }
  };

  useEffect(() => {
    fetchEmployerJobs();
  }, [dispatch]);

  const handlePublishJob = () => {
    navigation.navigate('PublierEmploi');
  };

  const handleEditJob = (jobId: number) => {
    navigation.navigate('PublierEmploi', { jobId, mode: 'edit' });
  };

  const handleDeleteJob = (jobId: number) => {
    Alert.alert(
      'Confirmation',
      'Êtes-vous sûr de vouloir supprimer cette offre d\'emploi?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Supprimer', 
          style: 'destructive',
          onPress: () => {
            deleteJob(jobId);
          }
        }
      ]
    );
  };

  const handleViewJobStats = (jobId: number) => {
    navigation.navigate('JobStats', { jobId });
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.couleurs.FOND_SOMBRE }]}>
        <Text style={{ color: theme.couleurs.TEXTE_PRIMAIRE }}>Chargement de vos offres...</Text>
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

  return (
    <View style={[styles.container, { backgroundColor: theme.couleurs.FOND_SOMBRE }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>Mes offres d'emploi</Text>
        
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: theme.couleurs.PRIMAIRE }]}
          onPress={handlePublishJob}
        >
          <Icon name="add" size={24} color="white" />
          <Text style={styles.addButtonText}>Nouvelle offre</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={employerJobs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <CarteOffre
              titre={item.titre}
              entreprise={item.entreprise}
              location={item.location}
              logo={item.logo}
              timeAgo={item.createdAt}
              isUrgent={item.isUrgent}
              isNew={item.isNew}
              onPress={() => navigation.navigate('DetailEmploi', { jobId: item.id })}
              onFavoriteToggle={() => {}}
            />
            
            <View style={styles.jobActions}>
              <Text style={[styles.statsText, { color: theme.couleurs.TEXTE_SECONDAIRE }]}>
                {item.views} vues · {item.applications} candidatures
              </Text>
              
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: `${theme.couleurs.FOND_TERTIAIRE}` }]}
                  onPress={() => handleViewJobStats(item.id)}
                >
                  <Icon name="bar-chart" size={20} color={theme.couleurs.PRIMAIRE} />
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: `${theme.couleurs.FOND_TERTIAIRE}` }]}
                  onPress={() => handleEditJob(item.id)}
                >
                  <Icon name="create" size={20} color={theme.couleurs.PRIMAIRE} />
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: `${theme.couleurs.FOND_TERTIAIRE}` }]}
                  onPress={() => handleDeleteJob(item.id)}
                >
                  <Icon name="trash" size={20} color={theme.couleurs.ERREUR} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name="briefcase-outline" size={60} color="#ccc" />
            <Text style={[styles.emptyText, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>
              Vous n'avez pas encore publié d'offre d'emploi.
            </Text>
            <Text style={[styles.emptySubtext, { color: theme.couleurs.TEXTE_SECONDAIRE }]}>
              Publiez votre première offre en cliquant sur le bouton ci-dessus.
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '500',
    marginLeft: 5,
  },
  jobActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 5,
    marginBottom: 15,
  },
  statsText: {
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  }
});