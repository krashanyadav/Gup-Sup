import { io } from "socket.io-client";

const socket = io("https://backendnextchat.onrender.com",{
    autoConnect:false
});

export default socket;
