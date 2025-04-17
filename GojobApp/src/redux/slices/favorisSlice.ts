// src/redux/slices/favorisSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import favorisApi, { Emploi } from '../../api/favorisApi';

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

export const fetchFavorites = createAsyncThunk<
  Emploi[],
  void,
  { rejectValue: string }
>(
  'favoris/fetchFavorites',
  async (_, { rejectWithValue }) => {
    try {
      const response = await favorisApi.getFavorites();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération des favoris');
    }
  }
);

export const toggleFavorite = createAsyncThunk<
  { jobId: number; isFavorite: boolean },
  number,
  { rejectValue: string }
>(
  'favoris/toggleFavorite',
  async (jobId: number, { rejectWithValue }) => {
    try {
      const response = await favorisApi.toggleFavorite(jobId);
      return { jobId, isFavorite: response.data.isFavorite };
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
              titre: "Emploi favori",
              entreprise: "",
              location: "",
              createdAt: new Date().toISOString(),
              isFavorite: true
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