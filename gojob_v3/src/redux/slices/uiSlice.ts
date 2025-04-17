import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EtatUI {
  modeNuit: boolean;
  barreRechercheVisible: boolean;
  notification: {
    visible: boolean;
    message: string;
    type: 'succes' | 'erreur' | 'info' | 'alerte';
  };
  chargementGlobal: boolean;
}

const initialState: EtatUI = {
  modeNuit: true, // Mode nuit par défaut d'après les maquettes
  barreRechercheVisible: false,
  notification: {
    visible: false,
    message: '',
    type: 'info',
  },
  chargementGlobal: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleModeNuit: (state) => {
      state.modeNuit = !state.modeNuit;
    },
    setModeNuit: (state, action: PayloadAction<boolean>) => {
      state.modeNuit = action.payload;
    },
    setBarreRechercheVisible: (state, action: PayloadAction<boolean>) => {
      state.barreRechercheVisible = action.payload;
    },
    afficherNotification: (state, action: PayloadAction<{ message: string; type: 'succes' | 'erreur' | 'info' | 'alerte' }>) => {
      state.notification = {
        visible: true,
        message: action.payload.message,
        type: action.payload.type,
      };
    },
    masquerNotification: (state) => {
      state.notification.visible = false;
    },
    setChargementGlobal: (state, action: PayloadAction<boolean>) => {
      state.chargementGlobal = action.payload;
    },
  },
});

export const {
  toggleModeNuit,
  setModeNuit,
  setBarreRechercheVisible,
  afficherNotification,
  masquerNotification,
  setChargementGlobal,
} = uiSlice.actions;

export default uiSlice.reducer;