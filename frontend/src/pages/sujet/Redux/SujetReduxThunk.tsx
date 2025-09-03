import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosRequest } from "../../../apis/AxiosHelper";
import { getItem } from "../../../tools/localStorage";
import type { User } from "../../../models/User";

export const fetchSujets = createAsyncThunk("sujet/fetchSujet", async () => {
  const role: string = getItem("type");
  const user: User = getItem("user");
  try {
    const response = await axiosRequest(
      "get",
      role === "encadrant"
        ? `sujet/getSujetByEmployee/${user.userable_id}`
        : "sujet"
    );
    return response.data.data;
  } catch (err) {
    return "Failed to fetch events. Please try again later.";
  }
});
