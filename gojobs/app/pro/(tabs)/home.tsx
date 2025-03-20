
import React from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router'; // Utilisation d'Expo Router
import { FontAwesome } from '@expo/vector-icons'; // Pour les icônes
import Header from '@/components/header'; // Assure-toi que le chemin est correct

const offers = [
  {
    id: '1',
    name: 'Claire Lemoine',
    title: 'DG',
    description: "Bonjour, je m'appelle Claire Lemoine, je suis qualifiée pour être déterminée et très organisée.",
    location: 'Rennes',
    time: '2d',
    image: require('@/assets/images/profil.jpg'),
    nombrePoste:+2
  },
  {
    id: '2',
    name: 'Louis Dabadi',
    title: 'Commercial',
    description: "Bonjour, je m'appelle Louis Dabadi, je suis qualifié pour être déterminé et très organisé.",
    location: 'Paris',
    time: '1h',
    image: require('@/assets/images/profil.jpg'),
    nombrePoste:+2

  },
  {
    id: '3',
    name: 'Marie Cloarec',
    title: 'RH',
    description: "Bonjour, je m'appelle Marie Cloarec, je suis qualifiée pour être déterminée et très organisée.",
    location: 'Pacé',
    time: '1h',
    image: require('@/assets/images/profil.jpg'),
    nombrePoste:+2

  },
];

export default function Home() {
  const router = useRouter();

  const renderOffer = ({ item }) => (
    <TouchableOpacity style={styles.offerContainer} onPress={() => {
      router.push({
        pathname: '/ProfilCand',
        params: { id: item.id},
      });
    }}>
      <Image source={item.image} style={styles.profileImage} />
      <View style={styles.offerDetails}>
        <View style={styles.headerRow}>
        <View>
        <Text style={styles.name}>{item.name}</Text>
          <View style={styles.locationContainer}>
            <Image source={require('@/assets/images/locate.png')} style={{width:18, height:15}}/>
            <Text style={styles.location}>{item.location}</Text>
          </View>
        </View>
          
          <Text style={[styles.title, { backgroundColor: '#0E365BBF' }]}>{item.title}</Text>
          <Text style={[styles.title, { }]}>+ {item.nombrePoste}</Text>

        </View>
        <Text style={styles.description}>{item.description}</Text>
         
          <Text style={styles.time}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header />

      <TouchableOpacity onPress={() => router.push('../../searchscreenPro')}>
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Search Jobs"
            placeholderTextColor="#888"
            style={styles.searchInput}
            editable={false}
          />
        </View>
      </TouchableOpacity>

      <View style={styles.recommendedContainer}>
        <Text style={styles.recommendedText}>Profils recommandés</Text>
      </View>

      <FlatList
        data={offers}
        renderItem={renderOffer}
        keyExtractor={(item) => item.id}
        style={styles.list}
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
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
  },
  searchInput: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  recommendedContainer: {
    marginBottom: 16,
  },
  recommendedText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
  },
  offerContainer: {
    flexDirection: 'row',
    backgroundColor: '#2C2C2E',
    borderRadius: 15,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  profileImage: {
    width: 92,
    height: 88,
    borderRadius: 15,
    marginRight: 12,
    marginTop:-45
  },
  offerDetails: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 12,
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    overflow: 'hidden',
  },
  description: {
    color: '#CCCCCC',
    marginBottom: 8,
    fontSize: 14,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 4,
  },
  location: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight:'600'
  },
  time: {
    color: '#FFFFFF',
    fontSize: 12,
    textAlign:'right'
  },
});
