import {
  createRoom,
  joinRoom,
  leaveRoom,
  startGame,
  addMessage,
  getMessages,
} from "./rooms.js";

const setupSocketHandlers = (io) => {
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("createRoom", async ({ playerName }) => {
      try {
        const room = await createRoom(socket.id, playerName);
        socket.join(room.id);
        socket.emit("roomCreated", { roomId: room.id });
        io.to(room.id).emit("lobbyUpdate", room);
      } catch (e) {
        socket.emit("error", e.message);
      }
    });

    socket.on("joinRoom", async ({ roomId, playerName }) => {
      try {
        const room = await joinRoom(roomId, socket.id, playerName);
        if (!room) {
          socket.emit("error", "Room not found or game started");
          return;
        }
        socket.join(roomId);
        const messages = getMessages(roomId);
        socket.emit("chatHistory", messages);
        io.to(roomId).emit("lobbyUpdate", room);
      } catch (e) {
        socket.emit("error", e.message);
      }
    });

    socket.on("sendMessage", ({ roomId, message }) => {
      const msgObj = addMessage(roomId, message);
      if (!msgObj) return;
      io.to(roomId).emit("newMessage", msgObj);
    });

    socket.on("startGame", async ({ roomId }) => {
      try {
        const room = await startGame(roomId, socket.id);
        io.to(roomId).emit("gameStarted");
      } catch (e) {
        socket.emit("error", e.message);
      }
    });

    socket.on("disconnect", async () => {
      const room = await leaveRoom(socket.id);
      if (room) {
        io.to(room.id).emit("lobbyUpdate", room);
      }
      console.log("Client disconnected:", socket.id);
    });
  });
};

export default setupSocketHandlers;
