// src/redux/slices/messagesSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import messagesApi from '../../api/messagesApi';

// Types adaptés au nouvel API
interface Message {
  id: number;
  sender: any; // Utilisateur ou ID
  receiver: any; // Utilisateur ou ID
  content: string;
  is_read: boolean;
  created_at: string;
  job?: any;
}

interface Conversation {
  id: number;
  user: any; // L'autre utilisateur
  last_message: Message;
  unread_count: number;
}

interface ConversationDetails {
  conversation: {
    id: number;
    participants: any[];
  };
  messages: Message[];
}

interface SendMessagePayload {
  receiver_id: number;
  text: string;
  job_id?: number;
}

interface MessagesState {
  conversations: Conversation[];
  messages: Message[];
  currentConversation: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: MessagesState = {
  conversations: [],
  messages: [],
  currentConversation: null,
  loading: false,
  error: null
};

// Thunks adaptés
export const fetchConversations = createAsyncThunk
  <Conversation[],
  number, // User ID
  { rejectValue: string }
>(
  'messages/fetchConversations',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await messagesApi.getConversations(userId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération des conversations');
    }
  }
);

export const fetchMessages = createAsyncThunk
  <ConversationDetails,
  number, // Conversation ID (autre utilisateur ID)
  { rejectValue: string }
>(
  'messages/fetchMessages',
  async (conversationId, { rejectWithValue }) => {
    try {
      const response = await messagesApi.getMessages(conversationId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération des messages');
    }
  }
);

export const sendMessage = createAsyncThunk
  <Message,
  SendMessagePayload,
  { rejectValue: string }
>(
  'messages/sendMessage',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await messagesApi.sendMessage(payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de l\'envoi du message');
    }
  }
);

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action: PayloadAction<Conversation[]>) => {
        state.loading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Une erreur est survenue';
      })
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action: PayloadAction<ConversationDetails>) => {
        state.loading = false;
        state.messages = action.payload.messages;
        state.currentConversation = action.payload.conversation;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Une erreur est survenue';
      })
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action: PayloadAction<Message>) => {
        state.loading = false;
        state.messages = [action.payload, ...state.messages];
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Une erreur est survenue';
      });
  }
});

export default messagesSlice.reducer;