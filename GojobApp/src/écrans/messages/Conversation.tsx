import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { useTheme } from '../../hooks/useTheme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MessagesNavigatorParamList } from '../../types/navigation';
import messagesApi from '../../api/messagesApi';

interface MessageItem {
  id: number;
  senderId: number;
  text: string;
  time: string;
  isRead: boolean;
}

// Updated route params interface to match what's actually provided
type ConversationRouteProp = RouteProp<
  MessagesNavigatorParamList,
  'Conversation'
>;

const Conversation: React.FC = () => {
  const theme = useTheme();
  const route = useRoute<ConversationRouteProp>();
  const navigation = useNavigation();
  const { utilisateur } = useAppSelector((state) => state.auth);

  // Extract parameters from route - using the correct property names
  const { conversationId, receiver, newConversation = false } = route.params || {};
  
  // Use the correct properties from the receiver object
  const contactId = conversationId || (receiver?.id);
  const contactName = receiver?.nom || 'Conversation';

  // Local state
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // References
  const flatListRef = useRef<FlatList>(null);

  // Set navigation title
  useEffect(() => {
    navigation.setOptions({
      title: contactName,
    });
  }, [navigation, contactName]);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (!contactId || !utilisateur) return;

      try {
        setLoading(true);
        const response = await messagesApi.getMessages(contactId);
        
        // Transform API response to our MessageItem format
        const formattedMessages = response.data.messages.map(msg => ({
          id: msg.id,
          senderId: typeof msg.sender === 'object' ? msg.sender.id : msg.sender,
          text: msg.content,
          time: new Date(msg.created_at).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          isRead: msg.is_read
        }));
        
        setMessages(formattedMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!newConversation) {
      fetchMessages();
    } else {
      setLoading(false);
    }
  }, [contactId, utilisateur, newConversation]);

  // Send message
  const handleSendMessage = async () => {
    if (!messageText.trim() || !utilisateur || !contactId) return;

    try {
      setSending(true);
      
      // Create a temporary message for UI feedback
      const tempMessage: MessageItem = {
        id: Date.now(), // Temporary ID
        senderId: utilisateur.id,
        text: messageText,
        time: new Date().toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        isRead: false
      };
      
      setMessages(prevMessages => [tempMessage, ...prevMessages]);
      setMessageText('');
      
      // Send to API
      const payload = {
        receiver_id: contactId,
        text: messageText
      };
      
      await messagesApi.sendMessage(payload);
      
      // Scroll to the new message
      if (flatListRef.current) {
        flatListRef.current.scrollToOffset({ offset: 0, animated: true });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove the temporary message if there was an error
      setMessages(prevMessages => 
        prevMessages.filter(msg => typeof msg.id === 'number' && msg.id !== Date.now())
      );
    } finally {
      setSending(false);
    }
  };

  // Message bubble component
  const renderMessageItem = ({ item }: { item: MessageItem }) => {
    const isUserMessage = item.senderId === utilisateur?.id;
    
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
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.couleurs.FOND_SOMBRE }}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.couleurs.PRIMAIRE} />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderMessageItem}
            inverted
            contentContainerStyle={styles.messagesContainer}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={{ color: theme.couleurs.TEXTE_SECONDAIRE, textAlign: 'center' }}>
                  {newConversation 
                    ? 'Envoyez votre premier message' 
                    : 'Aucun message dans cette conversation'}
                </Text>
              </View>
            }
          />
        )}
        
        <View style={[
          styles.inputContainer, 
          { backgroundColor: theme.couleurs.FOND_SECONDAIRE, borderTopColor: theme.couleurs.DIVIDER }
        ]}>
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
            maxLength={500}
          />
          <TouchableOpacity
            onPress={handleSendMessage}
            style={[styles.sendButton, { backgroundColor: theme.couleurs.PRIMAIRE }]}
            disabled={!messageText.trim() || sending}
          >
            {sending ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Icon name="send" size={20} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Conversation;