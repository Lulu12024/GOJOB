import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../hooks/useTheme';
import { StackNavigationProp } from '@react-navigation/stack';
import { fetchAiSuggestions, applyToJob } from '../../redux/slices/applyAiSlice';
import { CarteOffre } from '../../components/CarteOffre';
import Icon from 'react-native-vector-icons/Ionicons';
import { AppDispatch } from '../../redux/store'; // Importez AppDispatch

type ApplyAIProps = {
  navigation: StackNavigationProp<any>;
};

export const ApplyAI: React.FC<ApplyAIProps> = ({ navigation }) => {
  const theme = useTheme(); // Utilisez le thème sans déstructuration
  const dispatch = useDispatch<AppDispatch>(); // Typez correctement le dispatch
  const { suggestions, loading, error } = useSelector((state: any) => state.applyAi);
  const { user } = useSelector((state: any) => state.auth);
  
  const [activeTab, setActiveTab] = useState('suggestions');
  
  useEffect(() => {
    if (!user.hasSubscription('apply_ai') && !user.hasSubscription('apply_ai_pro')) {
      Alert.alert(
        'Abonnement requis', 
        'ApplyAI nécessite un abonnement. Souhaitez-vous vous abonner?',
        [
          { text: 'Plus tard', style: 'cancel' },
          { text: 'Voir les abonnements', onPress: () => navigation.navigate('Abonnements', { highlight: 'applyai' }) }
        ]
      );
      return;
    }
    
    dispatch(fetchAiSuggestions());
  }, [dispatch, user, navigation]);
  
  const handleApplyToJob = (jobId: number) => {
    Alert.alert(
      'Confirmer la candidature', 
      'ApplyAI va postuler automatiquement à cette offre en utilisant votre CV et en créant une lettre de motivation personnalisée. Continuer?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Postuler', 
          onPress: () => {
            dispatch(applyToJob(jobId));
            Alert.alert('Succès', 'ApplyAI a postulé à cette offre pour vous!');
          }
        }
      ]
    );
  };
  
  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.couleurs.FOND_SOMBRE }]}>
        <Text style={{ color: theme.couleurs.TEXTE_PRIMAIRE }}>Chargement des suggestions...</Text>
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
        <Text style={[styles.title, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>ApplyAI</Text>
        
        <TouchableOpacity 
          onPress={() => navigation.navigate('ApplyAIConfig')}
          style={styles.configButton}
        >
          <Icon name="settings-outline" size={24} color={theme.couleurs.TEXTE_PRIMAIRE} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[
            styles.tab, 
            activeTab === 'suggestions' && [styles.activeTab, { backgroundColor: theme.couleurs.PRIMAIRE }]
          ]} 
          onPress={() => setActiveTab('suggestions')}
        >
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'suggestions' ? styles.activeTabText : { color: theme.couleurs.TEXTE_PRIMAIRE }
            ]}
          >
            Suggestions
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.tab, 
            activeTab === 'applied' && [styles.activeTab, { backgroundColor: theme.couleurs.PRIMAIRE }]
          ]} 
          onPress={() => setActiveTab('applied')}
        >
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'applied' ? styles.activeTabText : { color: theme.couleurs.TEXTE_PRIMAIRE }
            ]}
          >
            Postulés
          </Text>
        </TouchableOpacity>
      </View>
      
      {activeTab === 'suggestions' ? (
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.jobContainer}>
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
              
              <View style={styles.matchContainer}>
                <Text style={styles.matchText}>Match: {item.matchPercentage}%</Text>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { 
                        width: `${item.matchPercentage}%`,
                        backgroundColor: item.matchPercentage > 80 
                          ? '#4CAF50' 
                          : item.matchPercentage > 60 
                            ? '#FFC107' 
                            : '#F44336'
                      }
                    ]}
                  />
                </View>
              </View>
              
              <View style={styles.reasonsContainer}>
                <Text style={[styles.reasonsTitle, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>Raisons du match:</Text>
                {item.matchReasons.map((reason: string, index: number) => (
                  <View key={index} style={styles.reasonItem}>
                    <Icon name="checkmark-circle" size={16} color="#4CAF50" />
                    <Text style={styles.reasonText}>{reason}</Text>
                  </View>
                ))}
              </View>
              
              <TouchableOpacity 
                style={[styles.applyButton, { backgroundColor: theme.couleurs.PRIMAIRE }]}
                onPress={() => handleApplyToJob(item.id)}
              >
                <Icon name="flash" size={20} color="white" />
                <Text style={styles.applyButtonText}>Postuler avec ApplyAI</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={{ color: theme.couleurs.TEXTE_PRIMAIRE, textAlign: 'center' }}>
                Aucune suggestion pour le moment. Configurez vos préférences pour obtenir des recommandations.
              </Text>
            </View>
          }
        />
      ) : (
        <FlatList
          data={suggestions.filter((item: any) => item.applied)}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.jobContainer}>
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
              
              <View style={styles.appliedInfo}>
                <Icon name="checkmark-circle" size={20} color="#4CAF50" />
                <Text style={styles.appliedText}>Postulé le {item.appliedDate}</Text>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={{ color: theme.couleurs.TEXTE_PRIMAIRE, textAlign: 'center' }}>
                Vous n'avez pas encore postulé à des offres avec ApplyAI.
              </Text>
            </View>
          }
        />
      )}
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
  configButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#e0e0e0',
  },
  activeTab: {
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 16,
  },
  activeTabText: {
    color: 'white',
    fontWeight: '500',
  },
  jobContainer: {
    marginBottom: 20,
  },
  matchContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  matchText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  reasonsContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 10,
    marginBottom: 10,
  },
  reasonsTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  reasonText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  appliedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  appliedText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  emptyState: {
    padding: 30,
    alignItems: 'center',
  }
});