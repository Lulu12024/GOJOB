// src/api/messagesApi.ts
import apiClient from './apiClient';
import { Utilisateur } from './authApi';

// Types
interface Message {
  id: number;
  sender: number | Utilisateur;
  receiver: number | Utilisateur;
  content: string;
  is_read: boolean;
  created_at: string;
  job?: number;
}

interface Conversation {
  id: number;
  user: Utilisateur;  // L'autre utilisateur dans la conversation
  last_message: Message;
  unread_count: number;
}

interface ConversationDetails {
  conversation: {
    id: number;
    participants: Utilisateur[];
  };
  messages: Message[];
}

interface SendMessagePayload {
  receiver_id: number;
  text: string;
  job_id?: number;
}

interface ApiResponse<T> {
  status: string;
  data: T;
  message?: string;
}

// API pour les messages
const messagesApi = {
  // Récupérer toutes les conversations d'un utilisateur
  getConversations: async (userId: number) => {
    try {
      const response = await apiClient.get<ApiResponse<Conversation[]>>(`/messages/user/${userId}/conversations/`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des conversations:', error);
      throw error;
    }
  },
  
  // Récupérer les messages d'une conversation
  getMessages: async (conversationId: number) => {
    try {
      const response = await apiClient.get<ApiResponse<ConversationDetails>>(`/messages/conversation/${conversationId}/`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des messages:', error);
      throw error;
    }
  },
  
  // Envoyer un message
  sendMessage: async (payload: SendMessagePayload) => {
    try {
      const response = await apiClient.post<ApiResponse<Message>>('/messages/send/', payload);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      throw error;
    }
  }
};

export default messagesApi;