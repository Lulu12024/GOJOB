import React, { useEffect } from 'react';
import { FlatList, StyleSheet, View, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ConversationItem } from '../../components/ConversationItem';
import { useTheme } from '../../hooks/useTheme';
import { StackNavigationProp } from '@react-navigation/stack';
import { fetchConversations } from '../../redux/slices/messagesSlice';
import { AppDispatch } from '../../redux/store';

type ListeConversationsProps = {
  navigation: StackNavigationProp<any>;
};

export const ListeConversations: React.FC<ListeConversationsProps> = ({ navigation }) => {
  const theme = useTheme(); // Correction ici
  const dispatch = useDispatch<AppDispatch>(); // Typage du dispatch
  const { conversations, loading, error } = useSelector((state: any) => state.messages);

  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.couleurs.FOND_SOMBRE }]}>
        <Text style={{ color: theme.couleurs.TEXTE_PRIMAIRE }}>Chargement des conversations...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: theme.couleurs.FOND_SOMBRE }]}>
        <Text style={{ color: theme.couleurs.ERREUR }}>Erreur: {error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.couleurs.FOND_SOMBRE }]}>
      <Text style={[styles.title, { color: theme.couleurs.TEXTE_PRIMAIRE }]}>Messages</Text>
      
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ConversationItem
            nom={item.contact.nom}
            photo={item.contact.photo}
            dernierMessage={item.dernierMessage.texte}
            timeAgo={item.dernierMessage.date}
            hasUnread={!item.dernierMessage.lu}
            onPress={() => navigation.navigate('Conversation', { conversationId: item.id })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={{ color: theme.couleurs.TEXTE_PRIMAIRE, textAlign: 'center' }}>
              Aucune conversation pour le moment.
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  }
});