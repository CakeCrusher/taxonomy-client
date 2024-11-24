// src/store/store.ts

import { configureStore } from '@reduxjs/toolkit';
import loadingReducer from './loadingSlice';
import openaiAPIKeyReducer from './openaiApiKeySlice';

const store = configureStore({
  reducer: {
    loading: loadingReducer,
    openaiApiKey: openaiAPIKeyReducer,
    // Add other reducers here if needed
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
