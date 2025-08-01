export interface Event {
  id?: number;
  title: string;
  start: string;
  end: string;
  description: string;
  room_name?: string;
  type?: string;
  calendarId: string;
}
