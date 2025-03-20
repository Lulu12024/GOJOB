import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from 'redux';
import counterReducer from './slices/counterSlice';
import userReducer from './slices/userSlice';
import appReducer from './slices/appSlice';
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

// Configuration de redux-persist
const persistConfig = {
  key: 'root', // Clé de stockage
  storage: AsyncStorage, // Utilisation de AsyncStorage pour React Native
  whitelist: ['userReducer'], // Seuls ces reducers seront persistés
  blacklist: ['appReducer'],  // On peut aussi utiliser blacklist pour exclure des reducers
};

// Combinaison des reducers
const rootReducer = combineReducers({
  counter: counterReducer,
  userReducer: userReducer,
  appReducer: appReducer,
});

// Création du reducer persistant
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configuration du store Redux
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Création du persistor
export const persistor = persistStore(store);
