import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import applicationsApi from '../../api/applicationsApi';
import { Application } from '../../api/applicationsApi'; // Importez également le type Application

interface ApplicationState {
  applications: Application[];
  loading: boolean;
  error: string | null;
}

const initialState: ApplicationState = {
  applications: [],
  loading: false,
  error: null
};

// Thunks
export const fetchApplications = createAsyncThunk<
  Application[],
  void,
  { rejectValue: string }
>(
  'applications/fetchApplications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await applicationsApi.getApplications();
      return response.data.data; // Accéder aux données dans response.data.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération des candidatures');
    }
  }
);

export const createApplication = createAsyncThunk<
  Application,
  FormData | any,
  { rejectValue: string }
>(
  'applications/createApplication',
  async (applicationData, { rejectWithValue }) => {
    try {
      const response = await applicationsApi.createApplication(applicationData);
      return response.data.data; // Accéder aux données dans response.data.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la création de la candidature');
    }
  }
);

export const updateApplicationStatus = createAsyncThunk<
  Application,
  { id: number; status: string },
  { rejectValue: string }
>(
  'applications/updateApplicationStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await applicationsApi.updateApplicationStatus(id, status);
      return response.data.data; // Accéder aux données dans response.data.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la mise à jour de la candidature');
    }
  }
);

// Le reste du code reste inchangé
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
      .addCase(fetchApplications.fulfilled, (state, action: PayloadAction<Application[]>) => {
        state.loading = false;
        state.applications = action.payload;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Une erreur est survenue'; // Utilisez ?? au lieu de ||
      })
      .addCase(createApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createApplication.fulfilled, (state, action: PayloadAction<Application>) => {
        state.loading = false;
        state.applications.push(action.payload);
      })
      .addCase(createApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Une erreur est survenue';
      })
      .addCase(updateApplicationStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action: PayloadAction<Application>) => {
        state.loading = false;
        const index = state.applications.findIndex(app => app.id === action.payload.id);
        if (index !== -1) {
          state.applications[index] = action.payload;
        }
      })
      .addCase(updateApplicationStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Une erreur est survenue';
      });
  }
});

export default applicationsSlice.reducer;