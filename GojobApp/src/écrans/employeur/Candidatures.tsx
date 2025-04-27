import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../hooks/useTheme';
import { CarteCandidature } from '../../components/CarteCandidature';
import { fetchApplications, updateApplicationStatus } from '../../redux/slices/applicationsSlice';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppDispatch } from '../../redux/store';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
// Définir des types pour les statuts
type ApplicationStatus = 'pending' | 'accepted' | 'rejected' | 'interview';
type UITabStatus = 'new' | 'accepted' | 'rejected' | 'pending';

// Fonction utilitaire pour mapper les statuts UI vers les statuts API
const mapUIStatusToAPIStatus = (uiStatus: UITabStatus): ApplicationStatus => {
  switch(uiStatus) {
    case 'new': return 'pending'; // Dans votre API, 'new' est probablement 'pending'
    case 'accepted': return 'accepted';
    case 'rejected': return 'rejected';
    case 'pending': return 'interview'; // Si nécessaire, ajustez selon votre logique métier
    default: return 'pending';
  }
};

// Fonction inverse pour mapper les statuts API vers les statuts UI
const mapAPIStatusToUIStatus = (apiStatus: ApplicationStatus): UITabStatus => {
  switch(apiStatus) {
    case 'pending': return 'new'; 
    case 'accepted': return 'accepted';
    case 'rejected': return 'rejected';
    case 'interview': return 'pending';
    default: return 'new';
  }
};

type CandidaturesProps = {
  navigation: StackNavigationProp<any>;
};

export const Candidatures: React.FC<CandidaturesProps> = ({ navigation }) => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { applications = [], loading = false, error = null } = useSelector((state: any) => state.applications || {});
  const { utilisateur } = useAppSelector(state => state.auth);
  // const { applications, loading, error } = useSelector((state: any) => state.applications);
  const [activeTab, setActiveTab] = useState<UITabStatus>('new');

  useEffect(() => {
    // Vérifier si l'utilisateur existe et a un ID avant d'appeler fetchApplications
    if (utilisateur && utilisateur.id) {
      // Passer un objet avec la propriété employerId à fetchApplications
      dispatch(fetchApplications({ employerId: utilisateur.id }));
    }
  }, [dispatch, utilisateur]);

  const filteredApplications = applications ? applications.filter((app: any) => {
    if (!app || !app.status) return false;
    // Mapper le statut API vers le statut UI pour la comparaison
    const uiStatus = mapAPIStatusToUIStatus(app.status as ApplicationStatus);
    return uiStatus === activeTab;
  }) : [];

  const handleStatusUpdate = (id: number, newStatus: UITabStatus) => {
    // Convertir le statut UI en statut API avant de l'envoyer
    const apiStatus = mapUIStatusToAPIStatus(newStatus);
    dispatch(updateApplicationStatus({ id, status: apiStatus }));
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.couleurs.FOND_SOMBRE }]}>
        <Text style={{ color: theme.couleurs.TEXTE_PRIMAIRE }}>Chargement des candidatures...</Text>
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
      <Text style={[styles.title, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>Candidatures</Text>
      
      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[
            styles.tab, 
            activeTab === 'new' && [styles.activeTab, { backgroundColor: theme.couleurs.PRIMAIRE }]
          ]} 
          onPress={() => setActiveTab('new')}
        >
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'new' ? styles.activeTabText : { color: theme.couleurs.TEXTE_PRIMAIRE }
            ]}
          >
            Nouvelles
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.tab, 
            activeTab === 'accepted' && [styles.activeTab, { backgroundColor: theme.couleurs.SUCCES }]
          ]} 
          onPress={() => setActiveTab('accepted')}
        >
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'accepted' ? styles.activeTabText : { color: theme.couleurs.TEXTE_PRIMAIRE }
            ]}
          >
            Acceptées
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.tab, 
            activeTab === 'pending' && [styles.activeTab, { backgroundColor: theme.couleurs.ALERTE }]
          ]} 
          onPress={() => setActiveTab('pending')}
        >
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'pending' ? styles.activeTabText : { color: theme.couleurs.TEXTE_PRIMAIRE }
            ]}
          >
            En attente
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.tab, 
            activeTab === 'rejected' && [styles.activeTab, { backgroundColor: theme.couleurs.ERREUR }]
          ]} 
          onPress={() => setActiveTab('rejected')}
        >
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'rejected' ? styles.activeTabText : { color: theme.couleurs.TEXTE_PRIMAIRE }
            ]}
          >
            Refusées
          </Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={filteredApplications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CarteCandidature
            nom={item.candidat.nom}
            photo={item.candidat.photo}
            dateCandidature={item.date}
            status={mapAPIStatusToUIStatus(item.status as ApplicationStatus)}
            onAccept={() => handleStatusUpdate(item.id, 'accepted')}
            onReject={() => handleStatusUpdate(item.id, 'rejected')}
            onViewCV={() => navigation.navigate('DocumentViewer', { uri: item.cv })}
            onViewResume={() => navigation.navigate('DocumentViewer', { uri: item.resume })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={{ color: theme.couleurs.TEXTE_PRIMAIRE, textAlign: 'center' }}>
              Aucune candidature {activeTab === 'new' ? 'nouvelle' : activeTab === 'accepted' ? 'acceptée' : activeTab === 'rejected' ? 'refusée' : 'en attente'}.
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  activeTab: {
    borderColor: 'transparent',
  },
  tabText: {
    fontSize: 14,
  },
  activeTabText: {
    color: 'white',
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  }
});