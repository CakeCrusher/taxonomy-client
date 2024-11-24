// src/store/openaiApiKeySlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the interface for the state
interface openaiApiKeyState {
  openaiApiKey: string;
}

const initialState: openaiApiKeyState = {
  openaiApiKey: localStorage.getItem('openaiApiKey') || "",
};

const openaiApiKeySlice = createSlice({
  name: 'openaiApiKey',
  initialState,
  reducers: {
    setOpenaiApiKey(state, action: PayloadAction<string>) {
      // Update the state
      // stip it
      const key = action.payload.trim();
      state.openaiApiKey = key;

      localStorage.setItem('openaiApiKey', key);
    },
  },
});

// Export the action and the reducer
export const { setOpenaiApiKey } = openaiApiKeySlice.actions;
export default openaiApiKeySlice.reducer;
