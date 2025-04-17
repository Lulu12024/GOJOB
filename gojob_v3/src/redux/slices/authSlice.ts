import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'; // Ajout de createAsyncThunk
import AsyncStorage from '@react-native-async-storage/async-storage'; // Ajout d'AsyncStorage
import { Utilisateur } from '../../api/authApi';

interface EtatAuth {
  estAuthentifie: boolean;
  utilisateur: Utilisateur | null;
  token: string | null;
  chargement: boolean;
  erreur: string | null;
}

const initialState: EtatAuth = {
  estAuthentifie: false,
  utilisateur: null,
  token: null,
  chargement: false,
  erreur: null,
};

// Création de l'action asynchrone pour vérifier l'authentification
export const verifierAuthentification = createAsyncThunk(
  'auth/verifierAuthentification',
  async (_, { dispatch }) => {
    try {
      const utilisateurJSON = await AsyncStorage.getItem('user_data');
      const token = await AsyncStorage.getItem('auth_token');
      
      if (utilisateurJSON && token) {
        const utilisateur = JSON.parse(utilisateurJSON);
        // Mettre à jour explicitement l'état d'authentification
        dispatch(setAuthentifie(true));
        dispatch(setToken(token));
        return utilisateur;
      }
      return null;
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'authentification :', error);
      return null;
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setChargement: (state, action: PayloadAction<boolean>) => {
      state.chargement = action.payload;
    },
    setAuthentifie: (state, action: PayloadAction<boolean>) => {
      state.estAuthentifie = action.payload;
    },
    setUtilisateur: (state, action: PayloadAction<Utilisateur>) => {
      state.utilisateur = action.payload;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setErreur: (state, action: PayloadAction<string | null>) => {
      state.erreur = action.payload;
    },
    reinitialiser: (state) => {
      Object.assign(state, initialState);
    },
  },
  // Ajout des extraReducers pour gérer les états de l'action asynchrone
  extraReducers: (builder) => {
    builder
      .addCase(verifierAuthentification.pending, (state) => {
        state.chargement = true;
        state.erreur = null;
      })
      .addCase(verifierAuthentification.fulfilled, (state, action) => {
        state.chargement = false;
        if (action.payload) {
          state.utilisateur = action.payload;
          state.estAuthentifie = true;
        } else {
          state.estAuthentifie = false;
        }
      })
      .addCase(verifierAuthentification.rejected, (state, action) => {
        state.chargement = false;
        state.erreur = action.error.message || 'Erreur lors de la vérification de l\'authentification';
        state.estAuthentifie = false;
      });
  }
});

export const {
  setChargement,
  setAuthentifie,
  setUtilisateur,
  setToken,
  setErreur,
  reinitialiser,
} = authSlice.actions;

export default authSlice.reducer;