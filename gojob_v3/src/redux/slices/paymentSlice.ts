import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { paymentApi } from '../../api/paymentApi';

// Types pour les paiements
interface PaymentDetails {
  number?: string;
  name?: string;
  expiry?: string;
  cvc?: string;
  [key: string]: any;
}

interface PaymentPayload {
  packageId: string;
  paymentMethod: string;
  paymentDetails: PaymentDetails;
}

// Type pour une transaction
interface Transaction {
  id: string;
  packageId: string;
  paymentMethod: string;
  amount: string;
  date: string;
  status: 'pending' | 'completed' | 'failed';
}

// Définition de l'état initial
interface PaymentState {
  paymentHistory: Transaction[];
  currentPayment: Transaction | null;
  loading: boolean;
  error: string | null;
}

const initialState: PaymentState = {
  paymentHistory: [],
  currentPayment: null,
  loading: false,
  error: null
};

export const processPayment = createAsyncThunk<
  Transaction, // Type de retour
  PaymentPayload, // Type du paramètre
  { rejectValue: string } // Type de rejectValue
>(
  'payment/processPayment',
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await paymentApi.processPayment(paymentData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors du traitement du paiement');
    }
  }
);

export const fetchPaymentHistory = createAsyncThunk<
  Transaction[], // Type de retour
  void, // Type du paramètre
  { rejectValue: string } // Type de rejectValue
>(
  'payment/fetchPaymentHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await paymentApi.getPaymentHistory();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération de l\'historique des paiements');
    }
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(processPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(processPayment.fulfilled, (state, action: PayloadAction<Transaction>) => {
        state.loading = false;
        state.currentPayment = action.payload;
        state.paymentHistory.push(action.payload);
      })
      .addCase(processPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Une erreur inconnue est survenue';
      })
      .addCase(fetchPaymentHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentHistory.fulfilled, (state, action: PayloadAction<Transaction[]>) => {
        state.loading = false;
        state.paymentHistory = action.payload;
      })
      .addCase(fetchPaymentHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Une erreur inconnue est survenue';
      });
  }
});

export default paymentSlice.reducer;