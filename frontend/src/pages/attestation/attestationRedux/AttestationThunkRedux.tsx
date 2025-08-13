import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosRequest } from "../../../apis/AxiosHelper";

export const fetchAttestations = createAsyncThunk("event/fetchAttestations", async () => {
  try {
    const response = await axiosRequest("get", "attestation");
    return response.data.attestations;
  } catch (err) {
    return "Failed to fetch attesations. Please try again later.";
  }
});
