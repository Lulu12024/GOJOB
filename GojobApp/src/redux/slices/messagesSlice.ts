import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import messagesApi from '../../api/messagesApi'; // Correction de l'import

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

interface MessagesState {
  conversations: Conversation[];
  messages: Message[];
  currentConversation: Conversation | null;
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

export const fetchConversations = createAsyncThunk<
  Conversation[],
  void,
  { rejectValue: string }
>(
  'messages/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await messagesApi.getConversations();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération des conversations');
    }
  }
);

export const fetchMessages = createAsyncThunk<
  ConversationDetails,
  number,
  { rejectValue: string }
>(
  'messages/fetchMessages',
  async (conversationId: number, { rejectWithValue }) => {
    try {
      const response = await messagesApi.getMessages(conversationId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération des messages');
    }
  }
);

export const sendMessage = createAsyncThunk<
  Message,
  MessageData,
  { rejectValue: string }
>(
  'messages/sendMessage',
  async (messageData: MessageData, { rejectWithValue }) => {
    try {
      const response = await messagesApi.sendMessage(messageData);
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