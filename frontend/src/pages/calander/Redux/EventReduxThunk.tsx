import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosRequest } from "../../../apis/AxiosHelper";
import type { Event } from "../../../models/Events";

export const fetchEvents = createAsyncThunk("event/fetchEvents", async () => {
  try {
    const response = await axiosRequest("get", "events");
    const listOfEvents = response.data.events.map((e: Event) => ({
      ...e,
      start: e.start.slice(0, 16),
      end: e.end.slice(0, 16),
    }));
    return listOfEvents;
  } catch (err) {
    return "Failed to fetch events. Please try again later.";
  }
});
