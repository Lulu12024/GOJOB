import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // Pour la navigation
import Header from '@/components/header';

const CANDIDATES_DATA = [
  {
    id: '1',
    job: 'Cuisinier',
    company: 'Le Grill',
    location: 'Rennes',
    timePosted: '1h',
    image: require('@/assets/images/profil.jpg'),
  },
];

const FAVORITES_DATA = [
  {
    id: '1',
    name: 'Marie Cloarec',
    company: 'Jardin Vert',
    location: 'Nantes',
    timePosted: '3h',
    image: require('@/assets/images/profil.jpg'),
    description:'Bonjour, je m’appelle {item.title}. Je suis qualifié(e) dans mon domaine et déterminé(e) à réussir !'
  },
   {
    id: '2',
    name: 'Louis Dabadi',
    company: 'Jardin Vert',
    location: 'Nantes',
    timePosted: '3h',
    image: require('@/assets/images/profil.jpg'),
    description:'Bonjour, je m’appelle {item.title}. Je suis qualifié(e) dans mon domaine et déterminé(e) à réussir !'
  },

];



export default function CandidatesScreen() {
  const [activeTab, setActiveTab] = useState('Candidats'); // "Candidats" ou "Favoris"
  const router = useRouter();

  const renderJobCard = (item) => (
    <TouchableOpacity key={item.id} onPress={() => router.push('/candidateList')}>
      <View style={styles.jobCard}>
        {/* Image avec icône de cœur */}
        <View style={styles.imageContainer}>
          <Image source={item.image} style={styles.jobImage} />
          {activeTab === 'Favoris' && (
            <View style={styles.heartContainer}>
              <Ionicons name="heart" size={16} color="red" />
            </View>
          )}
        </View>
        
        {/* Détails */}
        <View style={styles.detailsContainer}>
          <View style={styles.header}>
            <Text style={styles.name}>{activeTab === 'Candidats' ? item.job : item.name}</Text>
            <View style={styles.badgeContainer}>
              <Text style={styles.badge}>DS</Text>
            </View>
            <Text style={styles.interactions}>+2</Text>
          </View>
          <View style={styles.locationContainer}>
                      <Image source={require('@/assets/images/locate.png')} />
                      <Text style={styles.location}> {item.location}</Text>
                    </View>
          <Text style={styles.description}>
          {item.description}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  
  

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header />

      {/* Barre de recherche */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#888" />
        <TextInput
          placeholder="Search Jobs"
          placeholderTextColor="#888"
          style={styles.searchInput}
          editable={false} // Non fonctionnel ici
        />
      </View>

      {/* Onglets */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Candidats' && styles.activeTab]}
          onPress={() => setActiveTab('Candidats')}
        >
          <Text style={[styles.tabText, activeTab === 'Candidats' && styles.activeTabText]}>Candidats</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Favoris' && styles.activeTab]}
          onPress={() => setActiveTab('Favoris')}
        >
          <Text style={[styles.tabText, activeTab === 'Favoris' && styles.activeTabText]}>Favoris</Text>
        </TouchableOpacity>
      </View>

      {/* Contenu de l'onglet */}
      <FlatList
        data={activeTab === 'Candidats' ? CANDIDATES_DATA : FAVORITES_DATA}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => renderJobCard(item)}
        contentContainerStyle={styles.listContainer}
      />
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 16,
  },
  imageContainer: {
    position: 'relative',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  heartIcon: {
    position: 'absolute',
    top: 1,
    left: 2,
    borderRadius: 12,
    padding: 4,
  },
  
  searchInput: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    backgroundColor: '#FFFFFF',
    borderRadius:15
  },
  tabText: {
    color: '#888',
    fontSize: 16,
  },
  activeTabText: {
    color: '#000000FF',
    fontWeight: 'bold',
  },
  listContainer: {
    paddingBottom: 16,
  },
  jobCard: {
    flexDirection: 'row',
    backgroundColor: '#434853',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  jobImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
  },
  heartContainer: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: '#444',
    padding: 4,
    borderRadius: 12,
  },

  // Details
  detailsContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  badgeContainer: {
    backgroundColor: '#0E365BBF',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  badge: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  interactions: {
    color: '#FFF',
    fontSize: 14,
    marginLeft: 8,
  },
  location: {
    color: '#A4A6A6',
    fontSize: 14,
    marginBottom: 4,

  },
  description: {
    color: '#AAA',
    fontSize: 12,
    marginTop: 4,
  },
});
