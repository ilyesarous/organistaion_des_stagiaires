import { createSlice } from "@reduxjs/toolkit";
import type { Notification } from "../../../models/Notification";
import {
  fetchNotifications,
  updateNotifications,
} from "./NotificationReducThunk";

const initialState: {
  notifications: Notification[];
  status: string;
  error: string;
  count: number;
} = {
  notifications: [],
  status: "idle",
  error: "",
  count: 0,
};

const NotificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addCount(state, action) {
      state.count += action.payload;
    },
    resetCount(state) {
      state.count = 0;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.notifications = [...action.payload];
        state.count = state.notifications.filter((n) => n.read === false).length
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "";
      });
    builder
      .addCase(updateNotifications.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateNotifications.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(updateNotifications.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "";
      });
  },
});

export const NotificationReducer = NotificationSlice.reducer;
export const NotificationActions = NotificationSlice.actions;
