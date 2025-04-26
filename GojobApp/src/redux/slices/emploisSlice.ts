import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Emploi } from '../../api/jobsApi';
import jobsApi from '../../api/jobsApi';
// import { useAppSelector } from '../../redux/hooks';
interface EtatEmplois {
  emplois: Emploi[];
  employerJobs: Emploi[]; // Ajouté pour stocker les offres de l'employeur
  emploisRecommandes: Emploi[];
  favoris: number[]; // IDs des emplois favoris
  filtres: any;
  chargement: boolean;
  erreur: string | null;
  page: number;
  totalPages: number;
  recherche: {
    termeRecherche: string;
    location: string;
    resultats: Emploi[];
    chargement: boolean;
  };
}

const initialState: EtatEmplois = {
  emplois: [],
  employerJobs: [], // Initialisé comme un tableau vide
  emploisRecommandes: [],
  favoris: [],
  filtres: {},
  chargement: false,
  erreur: null,
  page: 1,
  totalPages: 1,
  recherche: {
    termeRecherche: '',
    location: '',
    resultats: [],
    chargement: false,
  },
};
// export const ajouterFavori = createAction<number>('emplois/ajouterFavori');
// export const retirerFavori = createAction<number>('emplois/retirerFavori');
// const { utilisateur } = useAppSelector((state: any)  => state.auth);
// Action asynchrone pour récupérer les offres d'emploi de l'employeur
export const fetchEmployerJobs = createAsyncThunk(
  'emplois/fetchEmployerJobs',
  async (_, { rejectWithValue }) => {
    try {
      const jobs = await jobsApi.getEmployerJobs(utilisateur.id);
      return jobs;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Impossible de charger vos offres');
    }
  }
);

// Action asynchrone pour supprimer une offre d'emploi
export const deleteJob = createAsyncThunk(
  'emplois/deleteJob',
  async (jobId: number, { dispatch, rejectWithValue }) => {
    try {
      await jobsApi.deleteJob(jobId);
      // Recharger les offres après suppression
      dispatch(fetchEmployerJobs());
      return jobId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Impossible de supprimer l\'offre');
    }
  }
);

// Dans emploisSlice.ts, ajoutez :
export const fetchJobDetails = createAsyncThunk(
  'emplois/fetchJobDetails',
  async (jobId: number, { rejectWithValue }) => {
    try {
      const jobDetails = await jobsApi.getEmploi(jobId);
      return jobDetails;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Impossible de charger les détails de l\'offre');
    }
  }
);


const emploisSlice = createSlice({
  name: 'emplois',
  initialState,
  reducers: {
    setEmplois: (state, action: PayloadAction<Emploi[]>) => {
      state.emplois = action.payload;
    },
    setEmployerJobs: (state, action: PayloadAction<Emploi[]>) => {
      state.employerJobs = action.payload;
    },
    ajouterEmplois: (state, action: PayloadAction<Emploi[]>) => {
      // Fusion des emplois existants avec les nouveaux
      const emploisExistants = new Set(state.emplois.map(e => e.id));
      const nouveauxEmplois = action.payload.filter(e => !emploisExistants.has(e.id));
      state.emplois = [...state.emplois, ...nouveauxEmplois];
    },
    setEmploisRecommandes: (state, action: PayloadAction<Emploi[]>) => {
      state.emploisRecommandes = action.payload;
    },
    setFavoris: (state, action: PayloadAction<number[]>) => {
      state.favoris = action.payload;
    },
    ajouterFavori: (state, action: PayloadAction<number>) => {
      if (!state.favoris.includes(action.payload)) {
        state.favoris.push(action.payload);
      }
    },
    retirerFavori: (state, action: PayloadAction<number>) => {
      state.favoris = state.favoris.filter(id => id !== action.payload);
    },
    
    setFiltres: (state, action: PayloadAction<any>) => {
      state.filtres = action.payload;
    },
    setChargement: (state, action: PayloadAction<boolean>) => {
      state.chargement = action.payload;
    },
    setErreur: (state, action: PayloadAction<string | null>) => {
      state.erreur = action.payload;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setTotalPages: (state, action: PayloadAction<number>) => {
      state.totalPages = action.payload;
    },
    setTermeRecherche: (state, action: PayloadAction<string>) => {
      state.recherche.termeRecherche = action.payload;
    },
    setLocation: (state, action: PayloadAction<string>) => {
      state.recherche.location = action.payload;
    },
    setResultatsRecherche: (state, action: PayloadAction<Emploi[]>) => {
      state.recherche.resultats = action.payload;
    },
    setChargementRecherche: (state, action: PayloadAction<boolean>) => {
      state.recherche.chargement = action.payload;
    },
    reinitialiserRecherche: (state) => {
      state.recherche = initialState.recherche;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployerJobs.pending, (state) => {
        state.chargement = true;
        state.erreur = null;
      })
      .addCase(fetchEmployerJobs.fulfilled, (state, action) => {
        state.chargement = false;
        state.employerJobs = action.payload;
      })
      .addCase(fetchEmployerJobs.rejected, (state, action) => {
        state.chargement = false;
        state.erreur = action.payload as string;
      })
      .addCase(deleteJob.pending, (state) => {
        state.chargement = true;
        state.erreur = null;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.chargement = false;
        // La mise à jour des emplois est gérée par fetchEmployerJobs qui est appelé dans l'action
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.chargement = false;
        state.erreur = action.payload as string;
      })
      .addCase(ajouterFavori, (state, action) => {
        if (!state.favoris.includes(action.payload)) {
          state.favoris.push(action.payload);
        }
      })
      .addCase(retirerFavori, (state, action) => {
        state.favoris = state.favoris.filter(id => id !== action.payload);
      });
      
  }
});

export const {
  setEmplois,
  setEmployerJobs,
  ajouterEmplois,
  setEmploisRecommandes,
  setFavoris,
  ajouterFavori,
  retirerFavori,
  setFiltres,
  setChargement,
  setErreur,
  setPage,
  setTotalPages,
  setTermeRecherche,
  setLocation,
  setResultatsRecherche,
  setChargementRecherche,
  reinitialiserRecherche,
} = emploisSlice.actions;

export default emploisSlice.reducer;