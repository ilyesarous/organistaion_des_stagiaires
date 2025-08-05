import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosRequest } from "../../../apis/AxiosHelper";

export const fetchSujets = createAsyncThunk("sujet/fetchSujet", async () => {
  try {
    const response = await axiosRequest("get", "sujet");
    return response.data.data;
  } catch (err) {
    return "Failed to fetch events. Please try again later.";
  }
});
