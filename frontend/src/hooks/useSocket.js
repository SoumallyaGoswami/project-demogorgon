import { io } from "socket.io-client";

// Create a single shared Socket.IO client instance
const socket = io("http://localhost:3001");

export default socket;