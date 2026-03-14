import { io } from "socket.io-client";

// Create a single shared Socket.IO client instance
const socket = io("http://172.22.3.83:3001");

export default socket;