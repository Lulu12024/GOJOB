// src/écrans/messages/Conversation.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../hooks/useTheme';
import { RouteProp } from '@react-navigation/native';
import { fetchMessages, sendMessage } from '../../redux/slices/messagesSlice';
import { AppDispatch } from '../../redux/store';
import { MessagesNavigatorParamList } from '../../types/navigation';

export interface ConversationProps {
  route: RouteProp<MessagesNavigatorParamList, 'Conversation'>;
}

export const Conversation: React.FC<ConversationProps> = ({ route }) => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { conversationId } = route.params || {};
  const [messageText, setMessageText] = useState('');
  
  const { currentConversation, messages = [], loading = false } = useSelector((state: any) => state.messages || {});
  const { utilisateur } = useSelector((state: any) => state.auth || {});

  useEffect(() => {
    if (conversationId) {
      dispatch(fetchMessages(conversationId));
    }
  }, [dispatch, conversationId]);

  const handleSendMessage = () => {
    if (!messageText.trim() || !conversationId || !utilisateur?.id) return;
    
    dispatch(sendMessage({
      receiver_id: conversationId, // L'ID de l'autre utilisateur
      text: messageText
    }));
    setMessageText('');
  };

  const renderMessageItem = ({ item }: { item: any }) => {
    const isUserMessage = item.senderId === utilisateur.id;
    
    return (
      <View style={[
        styles.messageBubble,
        isUserMessage 
          ? [styles.userBubble, { backgroundColor: theme.couleurs.PRIMAIRE }] 
          : [styles.otherBubble, { backgroundColor: theme.couleurs.FOND_TERTIAIRE }]
      ]}>
        <Text style={[
          styles.messageText,
          { color: isUserMessage ? 'white' : theme.couleurs.TEXTE_PRIMAIRE }
        ]}>
          {item.text}
        </Text>
        <Text style={[
          styles.messageTime,
          { color: isUserMessage ? 'rgba(255,255,255,0.7)' : theme.couleurs.TEXTE_TERTIAIRE }
        ]}>
          {item.time}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.couleurs.FOND_SOMBRE }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={{ color: theme.couleurs.TEXTE_PRIMAIRE }}>Chargement des messages...</Text>
        </View>
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMessageItem}
          inverted
          contentContainerStyle={styles.messagesContainer}
        />
      )}
      
      <View style={styles.inputContainer}>
        <TextInput
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Écrivez un message..."
          placeholderTextColor={theme.couleurs.TEXTE_TERTIAIRE}
          style={[
            styles.input,
            { backgroundColor: theme.couleurs.FOND_TERTIAIRE, color: theme.couleurs.TEXTE_PRIMAIRE }
          ]}
          multiline
        />
        <TouchableOpacity
          onPress={handleSendMessage}
          style={[styles.sendButton, { backgroundColor: theme.couleurs.PRIMAIRE }]}
          disabled={!messageText.trim()}
        >
          <Text style={styles.sendButtonText}>Envoyer</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.aiButton}>
          <Text style={styles.aiButtonText}>IA</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 18,
    marginVertical: 4,
    minWidth: 80,
  },
  userBubble: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
  },
  messageTime: {
    fontSize: 11,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  aiButton: {
    marginLeft: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#5C6BC0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  }
});