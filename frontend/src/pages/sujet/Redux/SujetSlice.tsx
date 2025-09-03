import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Sujet } from "../../../models/Sujet";
import { fetchSujets } from "./SujetReduxThunk";
import { getItem, setItem } from "../../../tools/localStorage";

const initialState: { sujets: Sujet[]; status: string; error: string; googleAccessToken: string } = {
  sujets: [],
  status: "idle",
  error: "",
  googleAccessToken: getItem("googleAccessToken") || "",
};

const SujetSlice = createSlice({
  name: "sujet",
  initialState,
  reducers: {
    deleteSujet(state, action: PayloadAction<number>) {
      state.sujets = state.sujets.filter((sujet) => sujet.id !== action.payload);
    },
    updateSujet(state, action: PayloadAction<Sujet>) {
      const index = state.sujets.findIndex((s) => s.id === action.payload.id);
      if (index !== -1) {
        state.sujets[index] = action.payload;
      }
    },
    setGoogleAccessToken(state, action: PayloadAction<string>) {
      state.googleAccessToken = action.payload;
      setItem("googleAccessToken", action.payload);
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchSujets.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSujets.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.sujets = [...action.payload];
      })
      .addCase(fetchSujets.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "";
      });
  },
});

export const SujetReducer = SujetSlice.reducer;
export const SujetActions = SujetSlice.actions;
