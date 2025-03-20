import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, ScrollView, Dimensions, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Header from '@/components/header';

const { width } = Dimensions.get('window');

// Données des offres
const offersData = [
  {
    id: 1,
    title: 'Paysagiste',
    company: 'Amazon',
    location: 'Rennes',
    timeAgo: '3m',
    salary: '25,000 € - 30,000 € / an',
    images: [
      require('@/assets/images/offre6.jpg'),
      require('@/assets/images/offre2.jpg'),
      require('@/assets/images/offre3.jpg'),
    ],
    description: `Nous recherchons un paysagiste expérimenté pour rejoindre notre équipe...`,
  },
  {
    id: 2,
    title: 'Assistant de jardinage',
    company: 'GreenTech',
    location: 'Nantes',
    timeAgo: '10m',
    salary: '20,000 € - 25,000 € / an',
    images: [require('@/assets/images/offre3.jpg')],
    description: `Recherchons un assistant de jardinage pour aider à la préparation des sols...`,
  },
  {
    id: 3,
    title: 'Ouvrier agricole',
    company: 'BioNature',
    location: 'Brest',
    timeAgo: '1h',
    salary: '18,000 € - 22,000 € / an',
    images: [
      require('@/assets/images/offre4.jpg'),
      require('@/assets/images/offre5.jpg'),
    ],
    description: `Poste d'ouvrier agricole pour travailler dans une exploitation biologique...`,
  },
  {
    id: 4,
    title: 'Responsable d\'entretien paysager',
    company: 'Ecoland',
    location: 'Vannes',
    timeAgo: '2h',
    salary: '30,000 € - 35,000 € / an',
    images: [require('@/assets/images/offre5.jpg')],
    description: `Nous cherchons un responsable d'entretien paysager pour superviser une équipe de jardiniers...`,
  },
  {
    id: 5,
    title: 'Chargé de projet en aménagement extérieur',
    company: 'Urbania',
    location: 'Quimper',
    timeAgo: '5h',
    salary: '40,000 € - 45,000 € / an',
    images: [require('@/assets/images/offre6.jpg')],
    description: `En tant que chargé de projet en aménagement extérieur, vous serez responsable de la conception...`,
  },
  {
    id: 6,
    title: 'Architecte paysagiste',
    company: 'NatureScape',
    location: 'Lorient',
    timeAgo: '7h',
    salary: '45,000 € - 50,000 € / an',
    images: [require('@/assets/images/offre2.jpg')],
    description: `Nous recherchons un architecte paysagiste pour concevoir des espaces extérieurs esthétiques...`,
  },
  {
    id: 7,
    title: 'Chef de projet environnement',
    company: 'EcoProjets',
    location: 'Saint-Brieuc',
    timeAgo: '1j',
    salary: '50,000 € - 55,000 € / an',
    images: [
      require('@/assets/images/offre2.jpg'),
      require('@/assets/images/offre4.jpg'),
    ],
    description: `Chef de projet pour la gestion de projets environnementaux. Expérience en gestion de projet nécessaire...`,
  },
  {
    id: 8,
    title: 'Botaniste',
    company: 'Bioflora',
    location: 'Rennes',
    timeAgo: '2j',
    salary: '35,000 € - 40,000 € / an',
    images: [require('@/assets/images/offre3.jpg')],
    description: `Nous recherchons un botaniste pour étudier et classer les plantes locales dans notre réserve naturelle...`,
  },
  {
    id: 9,
    title: 'Horticulteur',
    company: 'Floriland',
    location: 'Fougères',
    timeAgo: '3j',
    salary: '25,000 € - 28,000 € / an',
    images: [require('@/assets/images/offre6.jpg')],
    description: `Poste d'horticulteur pour gérer la culture de plantes ornementales. Expérience en horticulture souhaitée...`,
  },
  {
    id: 10,
    title: 'Technicien en espaces verts',
    company: 'GreenLife',
    location: 'Redon',
    timeAgo: '4j',
    salary: '22,000 € - 26,000 € / an',
    images: [require('@/assets/images/offre5.jpg')],
    description: `Nous recherchons un technicien en espaces verts pour entretenir des parcs et jardins urbains...`,
  },
];



export default function result() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const filters = [
    { id: '1', label: 'Favoris', icon: require('@/assets/icons/favoris_icon.png') },
    { id: '2', label: 'Backpaker' },
    { id: '3', label: 'Rennes' },
    { id: '4', label: 'Filtres' },
  ];

   // Définir le type de likedOffers
   const [likedOffers, setLikedOffers] = useState<{ [key: number]: boolean }>({});

   // Fonction pour gérer le clic sur l'icône
   const toggleLike = (offerId: number): void => {
     setLikedOffers((prevState) => ({
       ...prevState,
       [offerId]: !prevState[offerId], // Inverse l'état actuel
     }));
   };

  const handleCardPress = (offer) => {
    router.push({
      pathname: '../../JobDetails',
      params: { 
        id: offer.id,
        title: offer.title,
        company: offer.company,
        location: offer.location,
        timeAgo: offer.timeAgo,
        salary: offer.salary,
        description: offer.description,
        images: JSON.stringify(offer.images), // Convertir les images en chaîne JSON
      }
    });
  };
  

  return (
    <View style={styles.container}>
      <Header />

      <TouchableOpacity style={styles.searchContainer} onPress={() => router.push('../../searchscreen')}>
        <Ionicons name="search-outline" size={20} color="#888" />
        <TextInput
          placeholder="Search Jobs"
          placeholderTextColor="#888"
          style={styles.searchInput}
        />
      </TouchableOpacity>

      <FlatList
      data={filters}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filtersContainer}
      renderItem={({ item }) => (
        <TouchableOpacity
  style={[
    styles.filterButton,
    activeFilter === item.id && styles.activeFilter,
  ]}
  onPress={() => {
    if (item.label === 'Favoris') {
      router.push('/fav'); // Redirection vers fav.tsx
    } else {
      setActiveFilter(item.id); // Définir le filtre actif
    }
  }}
>
  <View style={styles.filterContent}>
    {item.icon && <Image source={item.icon} style={styles.filterIcon} />}
    <Text
      style={activeFilter === item.id ? styles.filterTextActive : styles.filterText}
      numberOfLines={1}
      ellipsizeMode="tail"
    >
      {item.label}
    </Text>
  </View>
</TouchableOpacity>

      )}
    />




      <Text style={styles.sectionTitle}>Backpaker</Text>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {offersData.map((offer) => (
          <TouchableOpacity key={offer.id} style={styles.recommendationCard} onPress={() => handleCardPress(offer)}>
            <Image source={offer.images[0]} style={styles.jobImage} /> 
            <View style={styles.jobDetails}>
              <Text style={styles.jobTitle}>{offer.title}</Text>
              <Text style={styles.companyName}>{offer.company}</Text>
              <View style={{flexDirection:'row'}}>
                <Ionicons name="location" size={20} color="#30B0C7" />
                <Text style={styles.location}>{offer.location}</Text>
              </View>
              
            </View>
            <View style={styles.roww}>
              <Text style={styles.timeAgo}>{offer.timeAgo}</Text>
              <TouchableOpacity onPress={() => toggleLike(offer.id)}>
                <Ionicons
                  name="heart"
                  size={20}
                  color={likedOffers[offer.id] ? 'red' : '#888'} // Rouge si liké, gris sinon
                  style={styles.like}
                />
              </TouchableOpacity>
            </View>

          </TouchableOpacity>
        ))}
      </ScrollView>
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
 roww:{
  flexDirection: 'column',
  },
  filtersContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    paddingHorizontal: 5,
    alignItems: 'center',
    height:45
  },
  filterButton: {
    width: width * 0.25, // 25% de la largeur de l'écran
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: '#2C2C2E',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor:'#FFFFFFFF',
    borderWidth:2
  },
  activeFilter: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
    borderWidth: 1,
  },
  filterText: {
    color: '#E0E0E0',
    fontSize: 14,
    textAlign: 'center',
  },
  filterTextActive: {
    color: '#666666',
    fontSize: 14,
    fontWeight: 'bold',
  },
  
  filterContent: {
    flexDirection: 'row', // Affiche l'icône et le texte côte à côte
    alignItems: 'center', // Aligne verticalement l'icône et le texte
  },
  
  filterIcon: {
    width: 16, // Largeur de l'icône
    height: 16, // Hauteur de l'icône
    marginRight: 8, // Espacement entre l'icône et le texte
  },
  
  
  
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 20,
  },
  searchInput: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  recommendationCard: {
    backgroundColor: '#3A3A3C',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
  },
  jobImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 12,
  },
  jobDetails: {
    flex: 1,
  },
  jobTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    bottom:10
  },
  companyName: {
    color: '#B0B0B0',
    fontSize: 14,
    bottom:10
  },
  location: {
    color: '#CCCCCC',
    fontSize: 14,
    fontWeight: 'bold',
  },
  timeAgo: {
    color: '#FFFFFF',
    fontSize: 12,
    top:28,
    fontWeight: 'bold',

  },

  like:{
    bottom:35
  }
});
