import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import Header from '@/components/header';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function MessagesScreen() {
  const router = useRouter();

  // Données des messages (exemple)
  const [messages, setMessages] = useState([
    {
      id: '1',
      senderName: 'Mathieu Cordion',
      messageText: 'Bonjour, je vous contacte concernant votre offre d\'emploi.',
      profileImage: require('@/assets/images/profil.jpg'),
      time: '3m',
      isRead: false,
    },
    {
      id: '2',
      senderName: 'Alice Dupont',
      messageText: 'Votre portfolio est impressionnant !',
      profileImage: require('@/assets/images/profil.jpg'),
      time: '10m',
      isRead: true,
    },
    {
      id: '3',
      senderName: 'Jean Martin',
      messageText: 'Pouvez-vous me rappeler ?',
      profileImage: require('@/assets/images/profil.jpg'),
      time: '1h',
      isRead: false,
    },
  ]);

  // Fonction pour marquer un message comme lu et rediriger
  const handlePressMessage = (item) => {
    setMessages((prevMessages) =>
      prevMessages.map((message) =>
        message.id === item.id ? { ...message, isRead: true } : message
      )
    );

    router.push({
      pathname: `../../chat/${item.id}`,
      params: { title: item.senderName },
    });
  };

  // Rendu d'un élément de message
  const renderMessage = ({ item }) => (
    <TouchableOpacity style={styles.messageCard} onPress={() => handlePressMessage(item)}>
      <Image source={item.profileImage} style={styles.profileImage} />
      <View style={styles.messageContent}>
        <Text style={styles.senderName}>{item.senderName}</Text>
        <Text style={styles.messageText}>{item.messageText}</Text>
      </View>
      <Text style={styles.messageTime}>{item.time}</Text>
      {!item.isRead && <View style={styles.newMessageIndicator} />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Appel du Header existant */}
      <Header />

      {/* Titre */}
      <View style={styles.headerOptions}>
        <Text style={styles.sectionTitle}>Messages</Text>
      </View>

      {/* Liste des messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={{ paddingBottom: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1D222B',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  headerOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  messageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#434853',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    position: 'relative',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 15,
    marginRight: 12,
  },
  messageContent: {
    flex: 1,
  },
  senderName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  messageText: {
    color: '#CCCCCC',
    fontSize: 14,
    marginTop: 4,
  },
  messageTime: {
    color: 'white',
    fontSize: 12,
    marginRight: 8,
  },
  newMessageIndicator: {
    position: 'absolute',
    top: 1,
    right: 2,
    backgroundColor: 'red',
    borderRadius: 50,
    width: 10,
    height: 10,
  },
});
