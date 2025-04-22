// authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authApi from '../../api/authApi';
import { ConnexionPayload, InscriptionPayload, Utilisateur } from '../../api/authApi';

// État initial
interface AuthState {
  utilisateur: Utilisateur | null;
  token: string | null;
  chargement: boolean;
  erreur: string | null;
  authenticated: boolean;
}

const initialState: AuthState = {
  utilisateur: null,
  token: null,
  chargement: false,
  erreur: null,
  authenticated: false
};

export const verifierAuthentification = createAsyncThunk(
  'auth/verifierAuthentification',
  async (_, { rejectWithValue }) => {
    try {
      const utilisateur = await authApi.verifierAuthentification();
      return utilisateur;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Actions asynchrones
export const connexion = createAsyncThunk(
  'auth/connexion',
  async (payload: ConnexionPayload, { rejectWithValue }) => {
    try {
      const response = await authApi.connexion(payload);
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const inscription = createAsyncThunk(
  'auth/inscription',
  async (payload: InscriptionPayload, { rejectWithValue }) => {
    try {
      const response = await authApi.inscription(payload);
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const chargerUtilisateur = createAsyncThunk(
  'auth/chargerUtilisateur',
  async (_, { rejectWithValue }) => {
    try {
      const user = await authApi.getStoredUser();
      if (!user) {
        throw new Error('Aucun utilisateur trouvé');
      }
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Erreur lors du chargement du profil');
    }
  }
);

export const deconnexion = createAsyncThunk(
  'auth/deconnexion',
  async () => {
    await authApi.deconnexion();
    return null;
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reinitialiser: (state) => {
      state.utilisateur = null;
      state.token = null;
      state.chargement = false;
      state.erreur = null;
      state.authenticated = false;
    },
    setAuthenticated: (state, action) => {
      state.authenticated = action.payload;
    }
  },
  extraReducers: (builder) => {
    // Connexion
    // Gérer l'action verifierAuthentification
    builder.addCase(verifierAuthentification.pending, (state) => {
      state.chargement = true;
      state.erreur = null;
    })
    builder.addCase(verifierAuthentification.fulfilled, (state, action) => {
      state.chargement = false;
      state.utilisateur = action.payload;
      state.authenticated = !!action.payload;
    })
    builder.addCase(verifierAuthentification.rejected, (state, action) => {
      state.chargement = false;
      // state.erreur = action.payload;
    });

    builder.addCase(connexion.pending, (state) => {
      state.chargement = true;
      state.erreur = null;
    });
    builder.addCase(connexion.fulfilled, (state, action) => {
      state.chargement = false;
      state.utilisateur = action.payload.user;
      state.token = action.payload.token;
      state.authenticated = true;
    });
    builder.addCase(connexion.rejected, (state, action) => {
      state.chargement = false;
      state.erreur = action.payload as string;
      state.authenticated = false;
    });
    
    // Inscription
    builder.addCase(inscription.pending, (state) => {
      state.chargement = true;
      state.erreur = null;
    });
    builder.addCase(inscription.fulfilled, (state, action) => {
      state.chargement = false;
      // Nous ne connectons pas automatiquement l'utilisateur après l'inscription
      // Il doit se connecter avec ses identifiants
    });
    builder.addCase(inscription.rejected, (state, action) => {
      state.chargement = false;
      state.erreur = action.payload as string;
    });
    
    // Chargement de l'utilisateur
    builder.addCase(chargerUtilisateur.pending, (state) => {
      state.chargement = true;
      state.erreur = null;
    });
    builder.addCase(chargerUtilisateur.fulfilled, (state, action) => {
      state.chargement = false;
      state.utilisateur = action.payload;
      state.authenticated = true;
    });
    builder.addCase(chargerUtilisateur.rejected, (state, action) => {
      state.chargement = false;
      state.erreur = action.payload as string;
      state.authenticated = false;
    });
    
    // Déconnexion
    builder.addCase(deconnexion.fulfilled, (state) => {
      state.utilisateur = null;
      state.token = null;
      state.authenticated = false;
    });
  }
});

export const { reinitialiser, setAuthenticated } = authSlice.actions;
export default authSlice.reducer;