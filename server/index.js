import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import setupSocketHandlers from "./socketHandler.js";

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

setupSocketHandlers(io);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
