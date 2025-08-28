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
const apiUrl = import.meta.env.VITE_API_URL;
const newStr = apiUrl.replace(/\bapi\b/, '');
const echo = new Echo({
  broadcaster: "pusher",
  key: "local-key",
  cluster: "mt1",
  wsHost: "myapp.com",
  wsPort: 80,
  forceTLS: false,
  disableStats: true,
  enabledTransports: ["ws", "wss"],
  wsPath: "/ws",
  authEndpoint: `${newStr.trim()}/broadcasting/auth`,
  auth: {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  },
});

export default echo;
