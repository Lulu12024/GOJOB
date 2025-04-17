
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EmploiFlash } from '../../api/flashJobsApi';

interface EtatFlashJobs {
  flashJobs: EmploiFlash[];
  chargement: boolean;
  erreur: string | null;
  page: number;
  totalPages: number;
}

const initialState: EtatFlashJobs = {
  flashJobs: [],
  chargement: false,
  erreur: null,
  page: 1,
  totalPages: 1,
};

const flashJobsSlice = createSlice({
  name: 'flashJobs',
  initialState,
  reducers: {
    setFlashJobs: (state, action: PayloadAction<EmploiFlash[]>) => {
      state.flashJobs = action.payload;
    },
    ajouterFlashJobs: (state, action: PayloadAction<EmploiFlash[]>) => {
      // Fusion des flash jobs existants avec les nouveaux
      const flashJobsExistants = new Set(state.flashJobs.map(e => e.id));
      const nouveauxFlashJobs = action.payload.filter(e => !flashJobsExistants.has(e.id));
      state.flashJobs = [...state.flashJobs, ...nouveauxFlashJobs];
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
  },
});

export const {
  setFlashJobs,
  ajouterFlashJobs,
  setChargement,
  setErreur,
  setPage,
  setTotalPages,
} = flashJobsSlice.actions;

export default flashJobsSlice.reducer;