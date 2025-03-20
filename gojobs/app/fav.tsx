import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Switch,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Pour les icônes

export default function FavScreen() {
  const [appNotifications, setAppNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [searchTitle, setSearchTitle] = useState('Électricien , Paris');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>recherche favoris</Text>
        <TouchableOpacity>
          <Text style={styles.clearAll}>clear all</Text>
        </TouchableOpacity>
      </View>

      {/* Input Field */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Titre</Text>
        <TextInput
          style={styles.input}
          value={searchTitle}
          onChangeText={setSearchTitle}
          placeholder="Entrez un titre"
          placeholderTextColor="#B0B0B0"
        />
      </View>

      {/* Notifications */}
      <View style={styles.notificationsContainer}>
        <View style={styles.notificationsHeader}>
          <Image
            source={require('@/assets/icons/not2.png')} // Mettez ici le chemin correct vers votre image
            style={styles.notificationIcon}
          />
          <Text style={styles.notificationsTitle}>NOTIFICATIONS</Text>
        </View>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>APP</Text>
          <Switch
            value={appNotifications}
            onValueChange={setAppNotifications}
            thumbColor="#FFFFFF"
            trackColor={{ false: '#767577', true: '#44D362' }}
          />
        </View>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Email</Text>
          <Switch
            value={emailNotifications}
            onValueChange={setEmailNotifications}
            thumbColor="#FFFFFF"
            trackColor={{ false: '#767577', true: '#44D362' }}
          />
        </View>
      </View>

      {/* Go Button */}
      <TouchableOpacity style={styles.goButton}>
        <Text style={styles.goButtonText}>GO</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1D222B',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textTransform: 'capitalize',
  },
  clearAll: {
    fontSize: 14,
    color: '#AAAAAA',
  },
  inputContainer: {
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#2C2C2E',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 16,
  },
  notificationsContainer: {
    marginBottom: 30,
  },
  notificationsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  notificationIcon: {
    width: 20, // Taille de l'icône
    height: 20,
    marginRight: 10,
  },
  notificationsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  switchLabel: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  goButton: {
    backgroundColor: '#002B5B',
    paddingVertical: 12,
    paddingHorizontal: 45, // Ajout de padding horizontal pour un bouton moins large
    borderRadius: 28,
    alignSelf: 'center', // Centre le bouton horizontalement
  },
  
  goButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
