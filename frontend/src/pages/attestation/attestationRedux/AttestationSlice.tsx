import { createSlice } from "@reduxjs/toolkit";
import type { Attestation } from "../../../models/Attestation";
import { fetchAttestations } from "./AttestationThunkRedux";

const initialState: {
  attestations: Attestation[];
  status: string;
  error: any;
} = {
  attestations: [],
  status: "idle",
  error: null,
};

const AttestationSlice = createSlice({
  name: "attestation",
  initialState,
  reducers: {
    addAttestation(state, action) {
      state.attestations.push(action.payload);
    },
    validateAttestation(state, action) {
      state.attestations.map((attestation: Attestation) => {
        attestation.id === action.payload
          ? (attestation.isValid = true)
          : null;
      });
    },
    approveAttestation(state, action) {
      state.attestations.map((attestation: Attestation) => {
        attestation.id === action.payload
          ? (attestation.isApproved = true)
          : null;
      });
    },
    deleteAttestation(state, action) {
      state.attestations = state.attestations.filter(
        (attestation: Attestation) => attestation.id !== action.payload
      );
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchAttestations.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAttestations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.attestations = [...action.payload];
      })
      .addCase(fetchAttestations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const AttestationReducer = AttestationSlice.reducer;
export const AttestationActions = AttestationSlice.actions;
