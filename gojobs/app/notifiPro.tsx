import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  StyleSheet,
  Dimensions,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function NotificationSettings() {
  const [messagesEnabled, setMessagesEnabled] = useState(true);
  const [newCandidateEnabled, setNewCandidateEnabled] = useState(true);
  const [newCVEnabled, setNewCVEnabled] = useState(true);

  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={{flexDirection:'row'}}>
<Image source={require('@/assets/images/notifi.png')} />

        <Text style={styles.sectionTitle}>NOTIFICATIONS</Text>
        </View>
      

        {/* Notification Options */}
        <View style={styles.notificationOption}>
          <Text style={styles.optionText}>Messages</Text>
          <Switch
            value={messagesEnabled}
            onValueChange={setMessagesEnabled}
            trackColor={{ false: '#767577', true: '#4CAF50' }}
            thumbColor={messagesEnabled ? '#FFFFFF' : '#f4f3f4'}
          />
        </View>

        <View style={styles.notificationOption}>
          <Text style={styles.optionText}>Nouveau candidat</Text>
          <Switch
            value={newCandidateEnabled}
            onValueChange={setNewCandidateEnabled}
            trackColor={{ false: '#767577', true: '#4CAF50' }}
            thumbColor={newCandidateEnabled ? '#FFFFFF' : '#f4f3f4'}
          />
        </View>

        <View style={styles.notificationOption}>
          <Text style={styles.optionText}>Nouveau CV</Text>
          <Switch
            value={newCVEnabled}
            onValueChange={setNewCVEnabled}
            trackColor={{ false: '#767577', true: '#4CAF50' }}
            thumbColor={newCVEnabled ? '#FFFFFF' : '#f4f3f4'}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1D222B', // Couleur sombre pour le fond
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
    paddingVertical: 10,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
    left:5
  },
  notificationOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  optionText: {
    color: 'white',
    fontSize: 16,
  },
});
