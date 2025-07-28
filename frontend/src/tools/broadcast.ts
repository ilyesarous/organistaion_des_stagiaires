import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { getItem } from "./localStorage";

declare global {
  interface Window {
    Pusher: typeof Pusher;
  }
}

window.Pusher = Pusher;
const token = getItem("token");

const echo = new Echo({
  broadcaster: "pusher",
  key: "local-key",
  cluster: "mt1",
  wsHost: "localhost",
  wsPort: 6001,
  forceTLS: false,
  disableStats: true,
  enabledTransports: ["ws", "wss"],
  authEndpoint: "http://localhost:8000/broadcasting/auth",
  auth: {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    
  },
});

export default echo;
