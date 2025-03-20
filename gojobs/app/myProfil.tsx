import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Switch, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const [isProfileVisible, setIsProfileVisible] = React.useState(true);
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      {/* Image de couverture */}
      <View style={styles.coverImageContainer}>
        <Image
          source={require('@/assets/images/offre6.jpg')} // Remplacez par votre URL d'image
          style={styles.coverImage}
        />
        {/* Icônes interactives */}
        <View style={styles.overlayIcons}>
          {/* Retour */}
          <Ionicons name="arrow-back" size={24} color="#fff" onPress={() => router.back()}/>
        </View>
        <View style={styles.overlayIcon}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            {/* Partager */}
            <TouchableOpacity
              onPress={() => console.log('Partager')}
              style={styles.iconButton}
            >
              <Ionicons name="share" size={24} color="#fff" />
            </TouchableOpacity>
            {/* Modifier */}
            <TouchableOpacity
              onPress={() => console.log('Modifier')}
              style={styles.iconButton}
            >
              <Ionicons name="create" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
       
      </View>

      {/* Profil utilisateur */}
      <View style={styles.profileContainer}>
        <Image
          source={require('@/assets/images/offre4.jpg')} // Remplacez par l'image utilisateur
          style={styles.profileImage}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>Marie Cloarec</Text>
          <View style={styles.locationRow}>
            <Image source={require('@/assets/images/locate.png')} style={{ marginTop: 12 }} />
            <Text style={{ marginTop: 12, color: '#fff' }}>Rennes</Text>
          </View>
          <View style={styles.profileVisibility}>
            <Text style={styles.visibilityText}>Profil visible</Text>
            <Switch
              value={isProfileVisible}
              onValueChange={() => setIsProfileVisible(!isProfileVisible)}
            />
          </View>
        </View>
      </View>

      {/* Section des préférences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Préférences de poste</Text>
        <View style={styles.tagsContainer}>
          <TouchableOpacity style={styles.tag}>
            <Text style={styles.tagText}>Mécanicien</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tag}>
            <Text style={styles.tagText}>Commercial</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tag}>
            <Text style={styles.tagText}>Électricien</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tag}>
            <Text style={styles.tagText}>RH</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tag}>
            <Text style={styles.tagText}>Cuisinier</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Section "À propos de moi" */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>À propos de moi</Text>
        <Text style={styles.aboutText}>
          Implantée au cœur d’un jardin arboré, la maison de retraite "L’Océane" est située en milieu
          urbain, à proximité du centre-ville de Saint-Georges de Didonne et des commodités locales.
        </Text>
      </View>

      {/* Boutons en bas */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>CV</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Autre</Text>
        </TouchableOpacity>
      </View>

      {/* Boutons d'action */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity style={styles.callButton}>
          <Text style={styles.callButtonText}>Appeler</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Message</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1D222B',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coverImageContainer: {
    height: 150,
    backgroundColor: '#333',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  overlayIcons: {
    position: 'absolute',
    top: 10,
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  overlayIcon: {
    position: 'absolute',
    top: 10,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconButton: {
    backgroundColor: 'rgba(0, 1, 0, 0.5)',
    padding: 8,
    borderRadius: 15,
    marginRight:5
  },
  iconImage: {
    width: 24,
    height: 24,
    tintColor: '#fff', // Icônes blanches
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
    marginTop: -120,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileVisibility: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  visibilityText: {
    color: '#aaa',
    fontSize: 14,
    marginRight: 8,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#0E365B',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    margin: 4,
  },
  tagText: {
    color: '#fff',
    fontSize: 14,
  },
  aboutText: {
    color: '#aaa',
    fontSize: 14,
    lineHeight: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
  },
  secondaryButton: {
    backgroundColor: '#aaa',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  secondaryButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
  },
  primaryButton: {
    backgroundColor: '#0E365B',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  callButton: {
    backgroundColor: '#aaa',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  callButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
