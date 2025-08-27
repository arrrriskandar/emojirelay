import {
  createRoom,
  joinRoom,
  removeFromRoom,
  startGame,
  getRoomByPlayerId,
  getRoom,
  deleteRoom,
  createPlayerIdMapping,
} from "./rooms.js";

const setupSocketHandlers = (io) => {
  io.on("connection", async (socket) => {
    const playerId = socket.handshake.query.playerId;
    if (!playerId) return;
    await createPlayerIdMapping(socket.id, playerId);
    console.log(`Player connected: ${playerId} (socket: ${socket.id})`);

    socket.on("createRoom", async ({ playerName }) => {
      try {
        const room = await createRoom(playerId, playerName);
        socket.join(room.id);
        socket.emit("roomCreated");
        io.to(room.id).emit("lobbyUpdate", room);
      } catch (e) {
        socket.emit("error", e.message);
      }
    });

    socket.on("joinRoom", async ({ roomId, playerName }) => {
      try {
        const room = await joinRoom(roomId, playerId, playerName);
        if (!room) {
          socket.emit("error", "Room not found or game started");
          return;
        }
        socket.join(roomId);
        socket.emit("roomJoined", "Room joined successfully");
        io.to(roomId).emit("lobbyUpdate", room);
      } catch (e) {
        socket.emit("error", e.message);
      }
    });

    socket.on("checkRoomExists", async ({ roomId }, callback) => {
      const room = await getRoom(roomId);
      callback(!!room); // true if room exists, false otherwise
    });

    socket.on("getRoomByPlayerId", async () => {
      try {
        const room = await getRoomByPlayerId(playerId);
        if (!room) {
          return;
        }
        socket.join(room.id);
        socket.emit("roomData", room);
      } catch (e) {
        socket.emit("error", e.message);
      }
    });

    socket.on("startGame", async ({ roomId, mode }) => {
      try {
        const room = await startGame(roomId, playerId, mode);
        io.to(roomId).emit("lobbyUpdate", room);
        io.to(roomId).emit("gameStarted");
      } catch (e) {
        socket.emit("error", e.message);
      }
    });

    socket.on("removeFromRoom", async ({ roomId, playerIdToRemove }) => {
      const result = await removeFromRoom(playerId, roomId, playerIdToRemove);
      if (result.success && result.room) {
        const removedSocket = io.sockets.sockets.get(result.removedSocketId);
        if (removedSocket) {
          removedSocket.leave(roomId);
          removedSocket.emit("removedFromRoom", roomId);
        }
        io.to(roomId).emit("lobbyUpdate", result.room);
      } else {
        socket.emit("error", result.message);
      }
    });

    socket.on("deleteRoom", async ({ roomId }) => {
      const result = await deleteRoom(playerId, roomId);

      if (result.success) {
        io.to(roomId).emit("roomDeleted", roomId);
        const roomSockets = io.sockets.adapter.rooms.get(roomId);
        if (roomSockets) {
          for (const sockId of roomSockets) {
            const sock = io.sockets.sockets.get(sockId);
            if (sock) sock.leave(roomId);
          }
        }
      } else {
        socket.emit("error", result.message);
      }
    });
  });
};

export default setupSocketHandlers;
