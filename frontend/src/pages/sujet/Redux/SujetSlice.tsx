import { createSlice } from "@reduxjs/toolkit";
import type { Sujet } from "../../../models/Sujet";
import { fetchSujets } from "./SujetReduxThunk";

const initialState: { sujets: Sujet[]; status: string; error: string } = {
  sujets: [],
  status: "idle",
  error: "",
};

const SujetSlice = createSlice({
  name: "sujet",
  initialState,
  reducers: {
    deleteSujet(state, action){
        state.sujets.filter((sujet) => sujet.id !== action.payload);
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
