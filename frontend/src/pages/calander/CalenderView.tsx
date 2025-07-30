// CalenderView.tsx
import { useState } from "react";
import { ScheduleXCalendar, useCalendarApp } from "@schedule-x/react";
import {
  CalendarApp,
  createViewList,
  createViewMonthGrid,
  createViewWeek,
} from "@schedule-x/calendar";
import "@schedule-x/theme-default/dist/calendar.css";
import { createEventModalPlugin } from "@schedule-x/event-modal";
import { createDragAndDropPlugin } from "@schedule-x/drag-and-drop";
import CreateEventModal from "./CreateEventModel";
import "./Calender.css";
import { Button } from "react-bootstrap";

export const CalenderVeiw = () => {
  const [showModal, setShowModal] = useState(false);
  const [eventList, setEventList] = useState([
    {
      id: 1,
      title: "My new event",
      start: "2025-07-29 01:00",
      end: "2025-07-29 02:00",
      description: "This is a new event",
      //   calendarId: "personal"
    },
  ]);

  const calendarApp: CalendarApp | null = useCalendarApp({
    views: [createViewList(), createViewWeek(), createViewMonthGrid()],
    calendars: {
      personal: {
        colorName: "personal",
        lightColors: {
          main: "#f9d71c",
          container: "#fff5aa",
          onContainer: "#594800",
        },
        darkColors: {
          main: "#fff5c0",
          onContainer: "#fff5de",
          container: "#a29742",
        },
      },
      work: {
        colorName: "work",
        lightColors: {
          main: "#f91c45",
          container: "#ffd2dc",
          onContainer: "#59000d",
        },
        darkColors: {
          main: "#ffc0cc",
          onContainer: "#ffdee6",
          container: "#a24258",
        },
      },
    },
    events: eventList,
    selectedDate: new Date().toISOString().split("T")[0],
    plugins: [createEventModalPlugin(), createDragAndDropPlugin()],
  });

  const handleAddEvent = (event: any) => {
    const newEvent = {
      id: eventList.length + 1,
      ...event,
    };
    setEventList([...eventList, newEvent]);
    calendarApp?.events.add(newEvent);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center p-3">
        <h4>Calendar</h4>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          + Create Event
        </Button>
      </div>

      <ScheduleXCalendar calendarApp={calendarApp} />

      <CreateEventModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleAddEvent}
      />
    </div>
  );
};
