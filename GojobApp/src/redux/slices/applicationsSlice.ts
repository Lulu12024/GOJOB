import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import applicationsApi, { Candidature } from '../../api/applicationsApi';

// Utiliser Candidature à la place de Application
interface ApplicationState {
  applications: Candidature[];
  loading: boolean;
  error: string | null;
}

const initialState: ApplicationState = {
  applications: [],
  loading: false,
  error: null
};

// Thunks
export const fetchApplications = createAsyncThunk
  <Candidature[],
  void,
  { rejectValue: string }
>(
  'applications/fetchApplications',
  async (_, { rejectWithValue }) => {
    try {
      // Corriger l'appel API - getCandidatures au lieu de getApplications
      const response = await applicationsApi.getCandidatures();
      return response; // Votre API renvoie déjà les données, pas response.data.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération des candidatures');
    }
  }
);

export const createApplication = createAsyncThunk
  <boolean, // Votre API renvoie un boolean, pas une Candidature
  any,
  { rejectValue: string }
>(
  'applications/createApplication',
  async (applicationData, { rejectWithValue }) => {
    try {
      const response = await applicationsApi.createApplication(applicationData);
      return response; // Votre API renvoie déjà un boolean
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la création de la candidature');
    }
  }
);

export const updateApplicationStatus = createAsyncThunk
  <boolean, // Votre API renvoie un boolean, pas une Candidature
  { id: number; status: string },
  { rejectValue: string }
>(
  'applications/updateApplicationStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await applicationsApi.updateApplicationStatus(id, status);
      return response; // Votre API renvoie déjà un boolean
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la mise à jour de la candidature');
    }
  }
);

const applicationsSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplications.fulfilled, (state, action: PayloadAction<Candidature[]>) => {
        state.loading = false;
        state.applications = action.payload;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Une erreur est survenue';
      })
      // Les cas createApplication et updateApplicationStatus doivent être modifiés
      // car ils retournent un boolean, pas une Candidature
      .addCase(createApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createApplication.fulfilled, (state) => {
        state.loading = false;
        // Nous ne pouvons pas ajouter une candidature ici car l'API retourne un boolean
        // Vous pourriez recharger les candidatures après l'ajout si besoin
      })
      .addCase(createApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Une erreur est survenue';
      })
      .addCase(updateApplicationStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action: PayloadAction<boolean>) => {
        state.loading = false;
        // Nous ne pouvons pas mettre à jour une candidature ici car l'API retourne un boolean
        // Vous pourriez recharger les candidatures après la mise à jour
      })
      .addCase(updateApplicationStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Une erreur est survenue';
      });
  }
});

export default applicationsSlice.reducer;