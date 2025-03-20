import React from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router'; // Ajout de `useRouter` pour naviguer
import { Ionicons } from '@expo/vector-icons';

export default function ChatScreen() {
  const { title, avatar, location } = useLocalSearchParams(); // Récupère les paramètres
  const router = useRouter(); // Permet la navigation
  const messages = [
    { id: '1', sender: 'recruiter', text: 'Êtes-vous disponible pour travailler aujourd’hui ?', isMine: false },
    { id: '2', sender: 'user', text: 'Bonjour, oui tout à fait. Avez-vous une adresse ou un contrat à m’envoyer ?', isMine: true },
    { id: '3', sender: 'recruiter', text: 'Oui, pas de souci.', isMine: false },
    { id: '4', sender: 'user', text: 'Merci 😊', isMine: true },
  ];

  return (
    <View style={styles.container}>
      {/* Header avec flèche de retour */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" style={{borderColor:'#fff', borderWidth:3, borderRadius:20}}/>
        </TouchableOpacity>
        <Image source={avatar} style={styles.avatar} />
        <View style={styles.headerInfo}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.location}>{location}</Text>
        </View>
      </View>

      {/* Liste des messages */}
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View style={[styles.messageContainer, item.isMine ? styles.myMessage : styles.theirMessage]}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
        style={styles.chatList}
        contentContainerStyle={{ paddingBottom: 16 }}
      />

      {/* Barre d'entrée pour envoyer un message */}
      <View style={styles.inputContainer}>
      <Ionicons name="camera-outline" size={24} color="#888" style={{justifyContent:'center', alignContent:'center', marginTop:6, marginRight:8}}/>
        <TextInput placeholder="Écrivez un message..." placeholderTextColor="#888" style={styles.input} />
        <TouchableOpacity style={styles.sendButton}>
        <Image  source={require('@/assets/images/send.png')}/>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1F1F1F' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    position: 'relative', // Pour permettre un alignement centré
  },
  backButton: {
    position: 'absolute',
    left: 16,
    top: '50%',
    transform: [{ translateY: -12 }], // Pour aligner verticalement
    zIndex: 10,
  },
  backButtonText: { fontSize: 20, color: '#fff' },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 16, justifyContent:'center' },
  headerInfo: { alignItems: 'center' }, // Centrage du texte
  title: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  location: { fontSize: 14, color: '#B0B0B0' },
  chatList: { flex: 1, paddingHorizontal: 16 },
  messageContainer: { maxWidth: '75%', padding: 12, marginVertical: 8, borderRadius: 16 },
  myMessage: { backgroundColor: '#2B9F5A', alignSelf: 'flex-end' },
  theirMessage: { backgroundColor: '#3B5998', alignSelf: 'flex-start' },
  messageText: { color: '#fff', fontSize: 14 },
  inputContainer: { flexDirection: 'row', padding: 16, borderTopWidth: 1, borderTopColor: '#333' },
  input: { flex: 1, backgroundColor: '#2A2A2A', color: '#fff', borderRadius: 8, padding: 8 },
  sendButton: {  borderRadius: 8, padding: 12, marginLeft: 8 },
  sendButtonText: { color: '#fff', fontWeight: 'bold' },
});
