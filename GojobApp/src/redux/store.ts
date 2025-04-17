
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import emploisReducer from './slices/emploisSlice';
import flashJobsReducer from './slices/flashJobsSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    emplois: emploisReducer,
    flashJobs: flashJobsReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;