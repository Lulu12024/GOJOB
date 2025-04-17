import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { applyAiApi } from '../../api/applyAiApi';

// Définir des types pour une meilleure gestion des erreurs et des données
interface AiSuggestion {
  id: number;
  titre: string;
  entreprise: string;
  location: string;
  logo: string;
  createdAt: string;
  isUrgent: boolean;
  isNew: boolean;
  matchPercentage: number;
  matchReasons: string[];
  applied: boolean;
  appliedDate?: string;
  [key: string]: any; // Pour les autres propriétés possibles
}

interface ApplyResponse {
  jobId: number;
  success: boolean;
  [key: string]: any;
}

interface ApplyAiState {
  suggestions: AiSuggestion[];
  config: any | null;
  loading: boolean;
  error: string | null;
}

// État initial typé
const initialState: ApplyAiState = {
  suggestions: [],
  config: null,
  loading: false,
  error: null
};

// Thunks correctement typés
export const fetchAiSuggestions = createAsyncThunk<
  AiSuggestion[],
  void,
  { rejectValue: string }
>(
  'applyAi/fetchSuggestions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await applyAiApi.getSuggestions();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération des suggestions');
    }
  }
);

export const applyToJob = createAsyncThunk<
  ApplyResponse,
  number,
  { rejectValue: string }
>(
  'applyAi/applyToJob',
  async (jobId: number, { rejectWithValue }) => {
    try {
      const response = await applyAiApi.applyToJob(jobId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la candidature automatique');
    }
  }
);

export const updateApplyAiConfig = createAsyncThunk<
  any,
  any,
  { rejectValue: string }
>(
  'applyAi/updateConfig',
  async (configData: any, { rejectWithValue }) => {
    try {
      const response = await applyAiApi.updateConfig(configData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la mise à jour de la configuration');
    }
  }
);

const applyAiSlice = createSlice({
  name: 'applyAi',
  initialState,
  reducers: {
    // Vous pouvez ajouter ici des reducers synchrones si nécessaire
  },
  extraReducers: (builder) => {
    builder
      // Gestion de fetchAiSuggestions
      .addCase(fetchAiSuggestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAiSuggestions.fulfilled, (state, action: PayloadAction<AiSuggestion[]>) => {
        state.loading = false;
        state.suggestions = action.payload;
      })
      .addCase(fetchAiSuggestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Une erreur est survenue';
      })
      
      // Gestion de applyToJob
      .addCase(applyToJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyToJob.fulfilled, (state, action: PayloadAction<ApplyResponse>) => {
        state.loading = false;
        // Mettre à jour le statut "applied" pour le job concerné
        const jobId = action.payload.jobId;
        state.suggestions = state.suggestions.map((job) => 
          job.id === jobId ? { ...job, applied: true, appliedDate: new Date().toLocaleDateString() } : job
        );
      })
      .addCase(applyToJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Une erreur est survenue lors de la candidature';
      })
      
      // Gestion de updateApplyAiConfig
      .addCase(updateApplyAiConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateApplyAiConfig.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.config = action.payload;
      })
      .addCase(updateApplyAiConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Une erreur est survenue lors de la mise à jour de la configuration';
      });
  }
});

export default applyAiSlice.reducer;