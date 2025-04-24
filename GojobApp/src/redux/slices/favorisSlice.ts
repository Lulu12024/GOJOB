// src/redux/slices/favorisSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import favorisApi from '../../api/favorisApi';
import { Emploi } from '../../api/jobsApi';

interface FavorisState {
  favoris: Emploi[];
  loading: boolean;
  error: string | null;
}

const initialState: FavorisState = {
  favoris: [],
  loading: false,
  error: null
};

export const fetchFavorites = createAsyncThunk
  <Emploi[],
  void,
  { rejectValue: string }
>(
  'favoris/fetchFavorites',
  async (_, { rejectWithValue }) => {
    try {
      // The function already returns Emploi[], so don't try to access .data
      return await favorisApi.getFavorites();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération des favoris');
    }
  }
);
export const toggleFavorite = createAsyncThunk
  <{ jobId: number; isFavorite: boolean },
  number,
  { rejectValue: string }
>(
  'favoris/toggleFavorite',
  async (jobId: number, { rejectWithValue }) => {
    try {
      const isFavorite = await favorisApi.toggleFavorite(jobId);
      return { jobId, isFavorite };  // Return object with jobId and boolean result
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la modification des favoris');
    }
  }
);


const favorisSlice = createSlice({
  name: 'favoris',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action: PayloadAction<Emploi[]>) => {
        state.loading = false;
        state.favoris = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Une erreur est survenue';
      })
      .addCase(toggleFavorite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleFavorite.fulfilled, (state, action: PayloadAction<{ jobId: number; isFavorite: boolean }>) => {
        state.loading = false;
        const { jobId, isFavorite } = action.payload;
        
        if (isFavorite) {
          // Vérifier si l'emploi existe déjà dans les favoris
          const exists = state.favoris.some(job => job.id === jobId);
          if (!exists) {
            // Note: Dans un cas réel, vous devriez récupérer les détails de l'emploi
            // soit via une API dédiée, soit en les ayant déjà en cache
            // Ici, pour simplifier, nous ajoutons un objet minimal
            const newFavorite: Emploi = {
              id: jobId,
              employer: 0, // Or appropriate default value
              title: "Emploi favori",
              description: "",
              category: "",
              subcategory: null,
              city: "",
              address: null,
              salary_type: 'hourly',
              salary_amount: null,
              contract_type: 'CDI',
              is_entry_level: false,
              experience_years_required: 0,
              requires_driving_license: false,
              accepts_working_visa: false,
              accepts_holiday_visa: false,
              accepts_student_visa: false,
              has_accommodation: false,
              accommodation_accepts_children: false,
              accommodation_accepts_dogs: false,
              accommodation_is_accessible: false,
              job_accepts_handicapped: false,
              has_company_car: false,
              contact_name: null,
              contact_phone: null,
              contact_methods: [],
              website_url: null,
              is_urgent: false,
              is_new: false,
              is_top: false,
              status: 'active',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              expires_at: null,
              views_count: 0,
              applications_count: 0,
              conversion_rate: 0,
              photos: [],
              
              // The following are for internal use, not part of the API model
              titre: "Emploi favori",
              entreprise: "",
              location: ""
            };
            state.favoris.push(newFavorite);
          }
        } else {
          // Retirer des favoris
          state.favoris = state.favoris.filter(job => job.id !== jobId);
        }
      })
      .addCase(toggleFavorite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Une erreur est survenue';
      });
  }
});

export default favorisSlice.reducer;