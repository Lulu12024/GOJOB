import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authApi, { 
  Utilisateur, 
  ConnexionPayload, 
  InscriptionPayload 
} from '../../api/authApi';

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

// Action de connexion
export const connexion = createAsyncThunk<
  Utilisateur, 
  ConnexionPayload, 
  { rejectValue: string }
>(
  'auth/connexion',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await authApi.connexion(payload);
      
      // Dispatch des actions pour mettre à jour l'état
      dispatch(setToken(response.token));
      dispatch(setUtilisateur(response.user));
      dispatch(setAuthentifie(true));
      
      return response.user;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Impossible de se connecter'
      );
    }
  }
);

// Action d'inscription
export const inscription = createAsyncThunk<
  Utilisateur, 
  InscriptionPayload, 
  { rejectValue: string }
>(
  'auth/inscription',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await authApi.inscription(payload);
      
      // Dispatch des actions pour mettre à jour l'état
      dispatch(setToken(response.token));
      dispatch(setUtilisateur(response.user));
      dispatch(setAuthentifie(true));
      
      return response.user;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Impossible de créer le compte'
      );
    }
  }
);

// Vérification de l'authentification
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
        dispatch(setUtilisateur(utilisateur));
        
        return utilisateur;
      }
      
      return null;
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'authentification :', error);
      return null;
    }
  }
);

// Action de déconnexion
export const deconnexion = createAsyncThunk(
  'auth/deconnexion',
  async (_, { dispatch }) => {
    try {
      await authApi.deconnexion();
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
    } finally {
      dispatch(reinitialiser());
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
  extraReducers: (builder) => {
    // Gestion de la vérification d'authentification
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
      })
      
      // Gestion de la connexion
      .addCase(connexion.pending, (state) => {
        state.chargement = true;
        state.erreur = null;
      })
      .addCase(connexion.fulfilled, (state, action) => {
        state.chargement = false;
        state.utilisateur = action.payload;
        state.estAuthentifie = true;
      })
      .addCase(connexion.rejected, (state, action) => {
        state.chargement = false;
        state.erreur = action.payload || 'Erreur de connexion';
        state.estAuthentifie = false;
      })
      
      // Gestion de l'inscription
      .addCase(inscription.pending, (state) => {
        state.chargement = true;
        state.erreur = null;
      })
      .addCase(inscription.fulfilled, (state, action) => {
        state.chargement = false;
        state.utilisateur = action.payload;
        state.estAuthentifie = true;
      })
      .addCase(inscription.rejected, (state, action) => {
        state.chargement = false;
        state.erreur = action.payload || 'Erreur d\'inscription';
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