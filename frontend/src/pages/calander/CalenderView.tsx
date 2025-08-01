import { ScheduleXCalendar, useCalendarApp } from "@schedule-x/react";
import {
  createViewList,
  createViewMonthGrid,
  createViewWeek,
} from "@schedule-x/calendar";
import "@schedule-x/theme-default/dist/calendar.css";
import { createEventModalPlugin } from "@schedule-x/event-modal";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchEvents } from "./Redux/EventReduxThunk";
import type { AppDispatch, RootState } from "../../tools/redux/Store";
import { LoadingIndicator } from "../../components/Loading";
import "./Calender.css";

export const CalenderVeiw = () => {
  const dispatch = useDispatch<AppDispatch>();
  const eventList = useSelector((state: RootState) => state.event.events);
  const eventStatus = useSelector((state: RootState) => state.event.status);
  const eventError = useSelector((state: RootState) => state.event.error);

  const calendarApp = useCalendarApp({
    views: [createViewList(), createViewWeek(), createViewMonthGrid()],
    selectedDate: new Date().toISOString().split("T")[0],
    events: eventList,
    plugins: [createEventModalPlugin()],
    calendars: {
      non_urgent: {
        colorName: "personal",
        lightColors: {
          main: "#0d6efd",
          container: "#e8f0ff",
          onContainer: "#052c65",
        },
        darkColors: {
          main: "#0d6efd",
          container: "#e8f0ff",
          onContainer: "#052c65",
        },
      },
      urgent: {
        colorName: "work",
        lightColors: {
          main: "#dc3545",
          container: "#ffe5ea",
          onContainer: "#670017",
        },
        darkColors: {
          main: "#ffc0cc",
          onContainer: "#ffdee6",
          container: "#a24258",
        },
      },
    },
  });
  useEffect(() => {
    if (eventStatus === "idle") {
      dispatch(fetchEvents());
    }
    calendarApp?.events.set(eventList);
  }, [dispatch, eventStatus]);

  if (eventStatus === "loading") {
    return <LoadingIndicator />;
  } else if (eventStatus === "failed") {
    return <div>Error: {eventError}</div>;
  } else return <ScheduleXCalendar calendarApp={calendarApp} />;
};
