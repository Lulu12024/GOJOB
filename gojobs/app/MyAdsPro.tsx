import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function MyAdsScreen() {
  const router = useRouter();

  const [ads, setAds] = useState([
    {
      id: '1',
      title: 'Cuisinier',
      company: 'Le Grill',
      location: 'Rennes',
      image: require('@/assets/images/profil.jpg'), // Remplacez par vos URLs d'images
    },
    {
      id: '2',
      title: 'Infirmière',
      company: 'CHU',
      location: 'Rennes',
      image: require('@/assets/images/profil.jpg'),
    },
    {
      id: '3',
      title: 'Électricien',
      company: 'EDF',
      location: 'Rennes',
      image: require('@/assets/images/profil.jpg'),
    },
    {
      id: '4',
      title: 'Cuisinier',
      company: 'EDF',
      location: 'Rennes',
      image: require('@/assets/images/profil.jpg'),
    },
  ]);

  const handleDelete = (id) => {
    Alert.alert(
      'Supprimer',
      'Êtes-vous sûr de vouloir supprimer cette annonce ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          onPress: () => {
            setAds((prevAds) => prevAds.filter((ad) => ad.id !== id));
          },
          style: 'destructive',
        },
      ]
    );
  };

  const renderAdItem = ({ item }) => (
    <View style={styles.adItem}>
      <Image source={item.image} style={styles.adImage} />
      <View style={styles.adDetails}>
        <Text style={styles.adTitle}>{item.title}</Text>
        <Text style={styles.adCompany}>{item.company}</Text>
        <View style={styles.adLocationContainer}>
            <Image source={require('@/assets/images/locate.png')} />
          <Text style={styles.adLocation}>{item.location}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => handleDelete(item.id)}>
        <Ionicons name="trash-outline" size={24} color="#FF3B30" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes annonces</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Gerer les annonces</Text>
        <FlatList
          data={ads}
          keyExtractor={(item) => item.id}
          renderItem={renderAdItem}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1D222B', // Fond sombre
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1D222B', // Fond du header
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  adItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  adImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  adDetails: {
    flex: 1,
  },
  adTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  adCompany: {
    color: '#A0A0A0',
    fontSize: 14,
    marginVertical: 5,
  },
  adLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adLocation: {
    color: '#A0A0A0',
    fontSize: 14,
    marginLeft: 5,
  },
});
