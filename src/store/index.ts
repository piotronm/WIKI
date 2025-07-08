// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import articlesReducer from './articlesSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    articles: articlesReducer,
    auth: authReducer,
  },
});

// Infer RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
