import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosRequest } from "../../../apis/AxiosHelper";

export const fetchUsers = createAsyncThunk("user/fetchUsers", async () => {
  try {
    const response = await axiosRequest("get", "auth/getAll");
    return response.data.users;
  } catch (err) {
    return "Failed to fetch events. Please try again later.";
  }
});
export const fetchSocieteUsers = createAsyncThunk("user/fetchSocieteUsers", async () => {
  try {
    const response = await axiosRequest("get", "auth/societe/users");
    return response.data.users;
  } catch (err) {
    return "Failed to fetch events. Please try again later.";
  }
});
