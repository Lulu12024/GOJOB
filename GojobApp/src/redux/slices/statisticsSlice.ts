import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import statisticsApi from '../../api/statisticsApi'; // Importation correcte

// Définir des types pour les données
interface DashboardData {
  totalApplications: number;
  totalViews: number;
  cvRate: number;
  activeJobs: number;
  viewsData: {
    labels: string[];
    values: number[];
  };
  applicationData: {
    labels: string[];
    values: number[];
  };
  activeJobsData: any[]; // Ou définir un type plus précis
}

interface JobStats {
  // Définir la structure des statistiques d'un emploi
  [key: string]: any;
}

interface StatisticsState {
  dashboardData: DashboardData | null;
  jobStats: JobStats | null;
  loading: boolean;
  error: string | null;
}

const initialState: StatisticsState = {
  dashboardData: null,
  jobStats: null,
  loading: false,
  error: null
};

export const fetchEmployerDashboard = createAsyncThunk<
  DashboardData,
  void,
  { rejectValue: string }
>(
  'statistics/fetchEmployerDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await statisticsApi.getEmployerDashboard();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération des statistiques');
    }
  }
);

export const fetchJobStats = createAsyncThunk<
  JobStats,
  number,
  { rejectValue: string }
>(
  'statistics/fetchJobStats',
  async (jobId: number, { rejectWithValue }) => {
    try {
      const response = await statisticsApi.getJobStats(jobId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération des statistiques du poste');
    }
  }
);

const statisticsSlice = createSlice({
  name: 'statistics',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployerDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployerDashboard.fulfilled, (state, action: PayloadAction<DashboardData>) => {
        state.loading = false;
        state.dashboardData = action.payload;
      })
      .addCase(fetchEmployerDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Une erreur est survenue';
      })
      .addCase(fetchJobStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobStats.fulfilled, (state, action: PayloadAction<JobStats>) => {
        state.loading = false;
        state.jobStats = action.payload;
      })
      .addCase(fetchJobStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Une erreur est survenue';
      });
  }
});

export default statisticsSlice.reducer;
