// src/api/messagesApi.ts
import apiClient from './apiClient';

// Types
interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  text: string;
  time: string;
  read: boolean;
}

interface Conversation {
  id: number;
  participants: {
    id: number;
    name: string;
    avatar?: string;
  }[];
  lastMessage?: {
    text: string;
    time: string;
    senderId: number;
  };
  unreadCount: number;
}

interface ConversationDetails {
  conversation: Conversation;
  messages: Message[];
}

interface MessageData {
  conversationId: number;
  text: string;
  senderId: number;
}

interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// API pour les messages
export const messagesApi = {
  // Récupérer toutes les conversations
  getConversations: async () => {
    const response = await apiClient.get<ApiResponse<Conversation[]>>('/messages/conversations');
    return response.data;
  },
  
  // Récupérer les messages d'une conversation
  getMessages: async (conversationId: number) => {
    const response = await apiClient.get<ApiResponse<ConversationDetails>>(`/messages/${conversationId}`);
    return response.data;
  },
  
  // Envoyer un message
  sendMessage: async (messageData: MessageData) => {
    const response = await apiClient.post<ApiResponse<Message>>('/messages', messageData);
    return response.data;
  }
};

export default messagesApi;