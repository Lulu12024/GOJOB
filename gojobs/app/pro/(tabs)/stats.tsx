import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import Header from '@/components/header'; // Assure-toi que le chemin est correct

const screenWidth = Dimensions.get('window').width;

export default function StatsScreen() {
  // Données du graphique
  const data = {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'], // Labels pour l'axe X
    datasets: [
      {
        data: [10, 20, 25, 35, 30, 40, 45], // Données des vues
        color: (opacity = 1) => `rgba(67, 120, 255, ${opacity})`, // Couleur des vues
        strokeWidth: 2, // Épaisseur de la ligne
      },
      {
        data: [15, 10, 30, 20, 35, 40, 25], // Données des CV
        color: (opacity = 1) => `rgba(240, 192, 74, ${opacity})`, // Couleur des CV
        strokeWidth: 2, // Épaisseur de la ligne
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#888" />
        <Text style={styles.searchInput}>Search Jobs</Text>
      </View>

      <Text style={styles.dashboardTitle}>Statistique de votre annonce</Text>

      <View style={styles.dashboardCard}>
        <View style={styles.cardHeader}>
          
            <Image source={require('@/assets/images/profil.jpg')} style={{ width: 80, height: 80, borderRadius: 10 }} />
          
          <View style={{right:40}}>
            <Text style={styles.jobTitle}>Paysagiste</Text>
            <Text style={styles.companyName}>amazon</Text>
            <Text style={styles.location}>Rennes</Text>
          </View>
          <Text style={styles.daysRemaining}>3m</Text>
        </View>

        <View style={styles.statsAndChartContainer}>
          <LineChart
            data={data}
            width={screenWidth * 0.8} // Ajustement de la taille du graphique
            height={180}
            chartConfig={{
              backgroundColor: '#181A1B',
              backgroundGradientFrom: '#181A1B',
              backgroundGradientTo: '#181A1B',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 10,
              },
              propsForLabels: {
                fontSize: 10, // Réduire la taille des labels pour éviter qu'ils ne soient trop serrés
              },
              propsForDots: {
                r: '4',
                strokeWidth: '2',
                stroke: '#FFF',
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 10,
            }}
          />
        </View>
      </View>

      {/* Légende */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#4378FF' }]} />
          <Text style={styles.legendText}>90 vue</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#F0C04A' }]} />
          <Text style={styles.legendText}>23 cv</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#4CAF50' }]} />
          <Text style={styles.legendText}>25.56 %</Text>
        </View>
      </View>

      <View style={styles.subscriptionInfoContainer}>
  <View style={styles.infoItem}>
    <Ionicons name="arrow-up-outline" size={14} color="#FFFFFF" style={{ marginRight: 5, transform: [{ rotate: '45deg' }] }} />
    <Text style={styles.additionalInfo}>abonnement actuelle</Text>
  </View>
  
  <View style={styles.infoItem}>
    <Ionicons name="arrow-up-outline" size={14} color="#00FFFF" style={{ marginRight: 5, transform: [{ rotate: '45deg' }] }} />
    <Text style={styles.additionalInfo}>Avec mention urgente</Text>
  </View>
</View>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1D222B',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  subscriptionInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10, // Pour espacer un peu la section
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  additionalInfo: {
    color: '#888',
    fontSize: 14,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
  },
  searchInput: {
    color: '#888',
    fontSize: 16,
    marginLeft: 10,
  },
  dashboardTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  dashboardCard: {
    backgroundColor: '#434853',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderColor: '#3A3A3C',
    borderWidth: 1, // Ajout d'une légère bordure pour correspondre à la maquette
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  imageContainer: {
    backgroundColor: '#484848',
    padding: 10,
    borderRadius: 10,
  },
  jobTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  companyName: {
    color: '#888',
    fontSize: 14,
  },
  location: {
    color: '#FFFFFF',
    fontSize: 14,
    top:20
  },
  daysRemaining: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  statsAndChartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Écarter les éléments de la légende
    marginBottom: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  legendColor: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 4,
  },
  legendText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
});
