
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import emploisReducer from './slices/emploisSlice';
import flashJobsReducer from './slices/flashJobsSlice';
import messagesReducer from './slices/messagesSlice';
import uiReducer from './slices/uiSlice';
import { useDispatch } from 'react-redux';
import applicationsReducer from './slices/applicationsSlice';
import applyAiReducer from './slices/applyAiSlice';
import favorisReducer from './slices/favorisSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    emplois: emploisReducer,
    flashJobs: flashJobsReducer,
    messages: messagesReducer,
    applications: applicationsReducer,
    ui: uiReducer,
    applyAi: applyAiReducer,
    favoris: favorisReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();