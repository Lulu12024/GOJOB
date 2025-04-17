import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../hooks/useTheme';
import { StatistiqueCard } from '../../components/StatistiqueCard';
import { fetchEmployerDashboard } from '../../redux/slices/statisticsSlice';
import { Dimensions } from 'react-native';
import { AppDispatch } from '../../redux/store';

// Si vous n'avez pas cette bibliothèque, installez-la:
// npm install react-native-chart-kit
// ou 
// yarn add react-native-chart-kit
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export const TableauDeBord: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { dashboardData, loading, error } = useSelector((state: any) => state.statistics);

  useEffect(() => {
    dispatch(fetchEmployerDashboard());
  }, [dispatch]);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.couleurs.FOND_SOMBRE }]}>
        <Text style={{ color: theme.couleurs.TEXTE_PRIMAIRE }}>Chargement du tableau de bord...</Text>
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

  if (!dashboardData) {
    return (
      <View style={[styles.container, { backgroundColor: theme.couleurs.FOND_SOMBRE }]}>
        <Text style={{ color: theme.couleurs.TEXTE_PRIMAIRE }}>Aucune donnée disponible.</Text>
      </View>
    );
  }

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    color: (opacity = 1) => `rgba(0, 102, 204, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.couleurs.FOND_SOMBRE }]}>
      <Text style={[styles.title, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>Tableau de Bord</Text>
      
      <View style={styles.cardsRow}>
        <StatistiqueCard
          titre="Candidatures"
          valeur={dashboardData.totalApplications}
          couleur="#4CAF50"
        />
        
        <StatistiqueCard
          titre="Vues"
          valeur={dashboardData.totalViews}
          couleur="#2196F3"
        />
      </View>
      
      <View style={styles.cardsRow}>
        <StatistiqueCard
          titre="Taux de CV"
          valeur={`${dashboardData.cvRate}%`}
          couleur="#FF9800"
        />
        
        <StatistiqueCard
          titre="Postes actifs"
          valeur={dashboardData.activeJobs}
          couleur="#9C27B0"
        />
      </View>
      
      <View style={[styles.chartContainer, { backgroundColor: theme.couleurs.FOND_SECONDAIRE }]}>
        <Text style={[styles.chartTitle, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>Vues par jour</Text>
        <LineChart
          data={{
            labels: dashboardData.viewsData.labels,
            datasets: [
              {
                data: dashboardData.viewsData.values,
                color: (opacity = 1) => `rgba(0, 102, 204, ${opacity})`,
                strokeWidth: 2,
              },
              {
                data: dashboardData.applicationData.values,
                color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
                strokeWidth: 2,
              },
            ],
            legend: ['Vues', 'Candidatures']
          }}
          width={screenWidth - 30}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View>
      
      <View style={styles.jobContainer}>
        <Text style={[styles.chartTitle, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>Offres d'emploi actives</Text>
        
        {dashboardData.activeJobsData.map((job: any) => (
          <View key={job.id} style={[styles.jobCard, { backgroundColor: theme.couleurs.FOND_SECONDAIRE }]}>
            <Text style={[styles.jobTitle, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>{job.title}</Text>
            <View style={styles.jobStats}>
              <Text style={[styles.jobStat, { color: theme.couleurs.TEXTE_SECONDAIRE }]}>{job.views} vues</Text>
              <Text style={[styles.jobStat, { color: theme.couleurs.TEXTE_SECONDAIRE }]}>{job.cvCount} CV</Text>
              <Text style={[styles.jobStat, { color: theme.couleurs.TEXTE_SECONDAIRE }]}>{job.cvRate}%</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
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
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  chartContainer: {
    marginTop: 20,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  chart: {
    borderRadius: 10,
  },
  jobContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  jobCard: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
  },
  jobStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  jobStat: {
    fontSize: 14,
  }
});