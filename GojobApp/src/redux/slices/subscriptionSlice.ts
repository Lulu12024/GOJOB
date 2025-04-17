import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { subscriptionApi } from '../../api/subscriptionsApi';

// Définir les types pour les abonnements
interface Subscription {
  id: number;
  name: string;
  price: number;
  description?: string;
  features?: string[];
}

// Type pour l'état du slice
interface SubscriptionState {
  subscriptions: Subscription[];
  activeSubscriptions: Subscription[];
  loading: boolean;
  error: string | null;
}

// Type pour la réponse de l'API
interface SubscriptionsResponse {
  availableSubscriptions: Subscription[];
  activeSubscriptions: Subscription[];
}

// Thunks avec typage
export const fetchSubscriptions = createAsyncThunk<
  SubscriptionsResponse, 
  void, 
  { rejectValue: string }
>(
  'subscription/fetchSubscriptions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await subscriptionApi.getSubscriptions();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la récupération des abonnements'
      );
    }
  }
);

export const subscribeToPackage = createAsyncThunk<
  Subscription, 
  string, 
  { rejectValue: string }
>(
  'subscription/subscribeToPackage',
  async (packageId, { rejectWithValue }) => {
    try {
      const response = await subscriptionApi.subscribe(packageId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la souscription à l\'abonnement'
      );
    }
  }
);

export const cancelSubscription = createAsyncThunk<
  Subscription, 
  number, 
  { rejectValue: string }
>(
  'subscription/cancelSubscription',
  async (subscriptionId, { rejectWithValue }) => {
    try {
      const response = await subscriptionApi.cancelSubscription(subscriptionId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de l\'annulation de l\'abonnement'
      );
    }
  }
);

// État initial avec typage
const initialState: SubscriptionState = {
  subscriptions: [],
  activeSubscriptions: [],
  loading: false,
  error: null
};

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Subscriptions
      .addCase(fetchSubscriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriptions = action.payload.availableSubscriptions;
        state.activeSubscriptions = action.payload.activeSubscriptions;
      })
      .addCase(fetchSubscriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Une erreur est survenue';
      })
      
      // Subscribe to Package
      .addCase(subscribeToPackage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(subscribeToPackage.fulfilled, (state, action) => {
        state.loading = false;
        state.activeSubscriptions.push(action.payload);
      })
      .addCase(subscribeToPackage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Une erreur est survenue';
      })
      
      // Cancel Subscription
      .addCase(cancelSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.activeSubscriptions = state.activeSubscriptions.filter(
          (subscription) => subscription.id !== action.payload.id
        );
      })
      .addCase(cancelSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Une erreur est survenue';
      });
  }
});

export default subscriptionSlice.reducer;