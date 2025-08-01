import { createSlice } from "@reduxjs/toolkit";
import type { Event } from "../../../models/Events";
import {
  fetchEvents,
} from "./EventReduxThunk";

const initialState: { events: Event[]; status: string; error: any } = {
  events: [],
  status: "idle",
  error: null,
};

const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    addEvent(state, action) {
      action.payload.start = action.payload.start.replace("T", " ");
      action.payload.end = action.payload.end.replace("T", " ");
      state.events.push(action.payload);
    },
    updateEvent(state, action) {
      const index = state.events.findIndex(
        (event: Event) => event.id === action.payload.id
      );
      if (index !== -1) {
        state.events[index] = action.payload;
      }
    },
    deleteEvent(state, action) {
      state.events = state.events.filter(
        (event: Event) => event.id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.events = [...action.payload];
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const EventReducer = eventSlice.reducer;
export const EventActions = eventSlice.actions;
