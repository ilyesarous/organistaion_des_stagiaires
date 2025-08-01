import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosRequest } from "../../../apis/AxiosHelper";

export const fetchSocietes = createAsyncThunk(
  "societe/fetchSocietes",
  async () => {
    try {
      const response = await axiosRequest("get", "societe");
      return response.data.societes;
    } catch (err) {
      return "Failed to fetch events. Please try again later.";
    }
  }
);