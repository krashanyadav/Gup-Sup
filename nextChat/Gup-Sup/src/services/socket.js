import { io } from "socket.io-client";
// Frontend socket connection
const socket = io("https://backendnextchat.onrender.com", {
  transports: ["websocket", "polling"] // websocket ko priority dein
});


export default socket;
