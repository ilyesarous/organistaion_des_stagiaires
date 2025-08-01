import { createSlice } from "@reduxjs/toolkit";
import type { Societe } from "../../../models/Societe";
import { fetchSocietes } from "./SocieteThunk";


const initialState: { societe: Societe[]; status: string; error: any } = {
  societe: [],
  status: "idle",
  error: null,
};

const societeSlice = createSlice({
  name: "societe",
  initialState,
  reducers: {
    addSociete(state, action) {
      state.societe.push(action.payload);
    },
    updateSociete(state, action) {
      const index = state.societe.findIndex(
        (societe: Societe) => societe.id === action.payload.id
      );
      if (index !== -1) {
        state.societe[index] = action.payload;
      }
    },
    deleteSociete(state, action) {
      state.societe = state.societe.filter(
        (societe: Societe) => societe.id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSocietes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSocietes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.societe = [...action.payload];
      })
      .addCase(fetchSocietes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const SocieteReducer = societeSlice.reducer;
export const SocieteActions = societeSlice.actions;
