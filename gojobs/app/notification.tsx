import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router'; // Importez useRouter

const notifications = [
  {
    id: '1',
    icon: require('@/assets/images/offre2.jpg'),
    text: 'Nouveau poste disponible',
  },
  {
    id: '2',
    icon: require('@/assets/images/offre3.jpg'),
    text: 'ApplyAI a trouvé vos opportunités du jour, veuillez consulter et confirmer les offres',
  },
  {
    id: '3',
    icon: require('@/assets/images/offre4.jpg'),
    text: 'Félicitation, votre candidature a été présélectionnée',
  },
  {
    id: '4',
    icon: require('@/assets/images/offre5.jpg'),
    text: "Votre candidature a été rejetée, n'abandonnez pas, il y a plein d'autres postes disponibles",
  },
];

export default function NotificationScreen() {
  const router = useRouter(); // Hook de navigation

  return (
    <View style={styles.container}>
      {/* En-tête */}
      <View style={styles.header}>
        {/* Flèche de retour */}
        <TouchableOpacity
  onPress={() => router.back()} // Redirige explicitement vers la page "home"

>
  <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
</TouchableOpacity>
        {/* Titre */}
        <Text style={styles.headerTitle}>Notifications</Text>

        {/* Bouton "clear all" */}
        <TouchableOpacity>
          <Text style={styles.clearText}>clear all</Text>
        </TouchableOpacity>
      </View>

      {/* Liste des notifications */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.notificationItem}>
            <Image source={item.icon} style={styles.icon} />
            <Text style={styles.notificationText}>{item.text}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1D222B',
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
    marginLeft: -24,
  },
  clearText: {
    fontSize: 14,
    color: '#888',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E2E33',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
  },
  notificationText: {
    fontSize: 14,
    color: '#FFFFFF',
    flex: 1,
  },
});
