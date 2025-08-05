import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosRequest } from "../../../apis/AxiosHelper";

export const fetchNotifications = createAsyncThunk(
  "societe/fetchNotifications",
  async () => {
    try {
      const response = await axiosRequest("get", "notifications");
      return response.data.notifications;
    } catch (err) {
      return "Failed to fetch events. Please try again later.";
    }
  }
);
export const updateNotifications = createAsyncThunk(
  "societe/updateNotifications",
  async () => {
    try {
      const response = await axiosRequest("patch", "notifications/markAsRead");
      return response.data;
    } catch (err) {
      return "Failed to update events. Please try again later.";
    }
  }
);