import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import redisClient from "./redisClient.js";

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

const PORT = process.env.PORT || 4000;
const ROOM_PREFIX = "room:";

async function getRoom(roomId) {
  const data = await redisClient.get(ROOM_PREFIX + roomId);
  return data ? JSON.parse(data) : null;
}

async function saveRoom(roomId, roomData) {
  await redisClient.setEx(
    ROOM_PREFIX + roomId,
    60 * 60,
    JSON.stringify(roomData)
  );
}

const socketRoomMap = new Map();

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("joinRoom", async ({ roomId, playerName }) => {
    let room = await getRoom(roomId);

    if (!room) {
      room = {
        players: [{ id: socket.id, name: playerName }],
        turn: 0,
        chain: [],
      };
      await saveRoom(roomId, room);
      console.log(`Created room ${roomId}`);
    } else {
      if (!room.players.find((p) => p.id === socket.id)) {
        room.players.push({ id: socket.id, name: playerName });
        await saveRoom(roomId, room);
      }
    }

    socket.join(roomId);
    socketRoomMap.set(socket.id, roomId);

    io.to(roomId).emit("roomUpdate", room);
  });

  socket.on("submitEntry", async ({ roomId, playerId, entry }) => {
    const room = await getRoom(roomId);
    if (!room) return;

    room.chain.push({ playerId, entry });
    room.turn += 1;

    await saveRoom(roomId, room);
    io.to(roomId).emit("roomUpdate", room);
  });

  socket.on("disconnect", () => {
    const roomId = socketRoomMap.get(socket.id);
    if (!roomId) return;

    getRoom(roomId).then(async (room) => {
      if (!room) return;
      room.players = room.players.filter((p) => p.id !== socket.id);

      if (room.players.length === 0) {
        await redisClient.del(ROOM_PREFIX + roomId);
        console.log(`Deleted room ${roomId}`);
      } else {
        await saveRoom(roomId, room);
        io.to(roomId).emit("roomUpdate", room);
      }
    });

    socketRoomMap.delete(socket.id);
    console.log("Client disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
