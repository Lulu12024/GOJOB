import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { subscriptionApi } from '../../api/subscriptionsApi';


export const fetchSubscriptions = createAsyncThunk(
  'subscription/fetchSubscriptions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await subscriptionApi.getSubscriptions();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération des abonnements');
    }
  }
);

export const subscribeToPackage = createAsyncThunk(
  'subscription/subscribeToPackage',
  async (packageId: string, { rejectWithValue }) => {
    try {
      const response = await subscriptionApi.subscribe(packageId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la souscription à l\'abonnement');
    }
  }
);

export const cancelSubscription = createAsyncThunk(
  'subscription/cancelSubscription',
  async (subscriptionId: number, { rejectWithValue }) => {
    try {
      const response = await subscriptionApi.cancelSubscription(subscriptionId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de l\'annulation de l\'abonnement');
    }
  }
);

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState: {
    subscriptions: [],
    activeSubscriptions: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
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
        state.error = action.payload;
      })
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
        state.error = action.payload;
      })
      .addCase(cancelSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.activeSubscriptions = state.activeSubscriptions.filter(
          (subscription: any) => subscription.id !== action.payload.id
        );
      })
      .addCase(cancelSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default subscriptionSlice.reducer;