import { Ionicons } from '@expo/vector-icons'; 
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';

export default function ResultatApplyAI() {
  const params = useLocalSearchParams();
  const router = useRouter();

  const offers = [
    {
      id: '1',
      title: 'Cuisinier',
      company: 'Le Grill',
      location: 'Rennes',
      time: '1h',
      image: require('@/assets/images/offre4.jpg'), // Remplacez par l'URL réelle de l'image
    },
    {
      id: '2',
      title: 'Infirmière',
      company: 'CHU',
      location: 'Rennes',
      time: '1h',
      image: require('@/assets/images/offre6.jpg'),
    },
    {
      id: '3',
      title: 'Électricien',
      company: 'EDF',
      location: 'Rennes',
      time: '1h',
      image: require('@/assets/images/offre5.jpg'),
    },
    {
      id: '4',
      title: 'Cuisinier',
      company: 'EDF',
      location: 'Rennes',
      time: '1h',
      image: require('@/assets/images/offre2.jpg'),
    },
  ];

  const renderOffer = ({ item }) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <TouchableOpacity style={styles.deleteButton}>
            <Ionicons name="trash" size={24} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
        <Text style={styles.cardSubtitle}>{item.company}</Text>
        <View style={styles.locationRow}>
            <Image source={require('@/assets/images/locate.png')} style={{marginTop:12}}/>
            <Text style={styles.cardLocation}>{item.location}</Text>
        </View>
        <Text style={styles.cardTime}>{item.time}</Text>
      </View>
    </View>
  );
  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>ApplyAI</Text>
      </View>

      {/* <Text style={styles.info}>Catégorie : {params.category}</Text>
      <Text style={styles.info}>Filtre : {params.filter}</Text>
      <Text style={styles.info}>Société non désirée : {params.excludedCompany}</Text>
      <Text style={styles.info}>Salaire souhaité : {params.salaryRange}</Text>
      <Text style={styles.info}>Heure de la notification : {params.notificationTime}</Text> */}

      <FlatList
        data={offers}
        renderItem={renderOffer}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />

      {/* Bouton de confirmation */}
      <TouchableOpacity style={styles.confirmButton}>
        <Text style={styles.confirmButtonText}>Confirmer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1D222B',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0, // Place la flèche à gauche
  },
  title: {
    flex: 1,
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center', // Centre le titre
  },
  info: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
  },
  list: {
    flex: 1,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#2C2C2C',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  cardImage: {
    width: 92,
    height: 88,
    borderRadius: 8,
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between', // Répartit les éléments dans l'espace disponible
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Sépare le titre et l'icône
    alignItems: 'center',
  },
  cardTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1, // Permet au titre de prendre l'espace restant
  },
  deleteButton: {
    marginLeft: 8,
  },
  cardSubtitle: {
    color: '#aaa',
    fontSize: 14,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
},
  cardLocation: {
    color: '#aaa',
    fontSize: 12,
    marginBottom: 8, // Ajoute un espacement avant le temps
    marginTop:22
  },
  cardTime: {
    color: '#aaa',
    fontSize: 12,
    alignSelf: 'flex-end', // Place le temps en bas à droite
  },
  confirmButton: {
    backgroundColor: '#0E365BBF',
    paddingVertical: 10, // Ajuste le padding vertical pour une meilleure apparence
    paddingHorizontal: 20, // Ajuste le padding horizontal
    borderRadius: 19,
    alignItems: 'center',
    alignSelf: 'center', // Centre le bouton horizontalement
    marginTop: 10,
  },
  
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
