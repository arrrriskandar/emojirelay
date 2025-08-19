import {
  createRoom,
  joinRoom,
  leaveRoom,
  startGame,
  addMessage,
  getMessages,
  getRoomByPlayerId,
} from "./rooms.js";

const setupSocketHandlers = (io) => {
  io.on("connection", (socket) => {
    const playerId = socket.handshake.query.playerId;
    console.log(`Player connected: ${playerId} (socket: ${socket.id})`);

    socket.on("createRoom", async ({ playerName }) => {
      try {
        const room = await createRoom(playerId, playerName);
        socket.join(room.id);
        socket.emit("roomCreated", room);
        io.to(room.id).emit("lobbyUpdate", room);
      } catch (e) {
        socket.emit("error", e.message);
      }
    });

    socket.on("getRoomByPlayerId", async ({ playerId }) => {
      try {
        const room = await getRoomByPlayerId(playerId);
        if (!room) {
          socket.emit("error", "Room not found");
          return;
        }
        socket.emit("roomData", room);
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
        const messages = await getMessages(roomId);
        socket.emit("chatHistory", messages);
        io.to(roomId).emit("lobbyUpdate", room);
      } catch (e) {
        socket.emit("error", e.message);
      }
    });

    socket.on("sendMessage", async ({ roomId, message }) => {
      const msgObj = await addMessage(roomId, message);
      if (!msgObj) return;
      io.to(roomId).emit("newMessage", msgObj);
    });

    socket.on("startGame", async ({ roomId }) => {
      try {
        await startGame(roomId, playerId);
        io.to(roomId).emit("gameStarted");
      } catch (e) {
        socket.emit("error", e.message);
      }
    });

    // socket.on("disconnect", async () => {
    //   const room = await leaveRoom(playerId);
    //   if (room) {
    //     io.to(room.id).emit("lobbyUpdate", room);
    //   }
    //   console.log(`Player disconnected: ${playerId}`);
    // });
  });
};

export default setupSocketHandlers;
