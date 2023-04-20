import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
const URL = ["production", "dev"].includes(import.meta.env.MODE ?? "")
  ? undefined
  : import.meta.env.VITE_SOCKET_URL;

export const socket = io(URL ?? "", {
  transports: ["websocket"],
});
