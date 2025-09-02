import {
  createRoom,
  joinRoom,
  removeFromRoom,
  startGame,
  getRoomByPlayerId,
  getRoom,
  deleteRoom,
} from "../controllers/rooms.js";
import { setPlayerSocket } from "../utils/redisHelper.js";
import { getRound, startRound } from "../controllers/rounds.js";

const setupSocketHandlers = (io) => {
  io.on("connection", (socket) => {
    (async () => {
      try {
        const playerId = socket.handshake.query.playerId;
        if (!playerId) return;

        await setPlayerSocket(playerId, socket.id);
        console.log(`Player connected: ${playerId} (socket: ${socket.id})`);

        // --- CREATE ROOM ---
        socket.on("createRoom", async ({ playerName }) => {
          try {
            const room = await createRoom(playerId, playerName);
            socket.join(room.id);
            socket.emit("roomCreated");
            io.to(room.id).emit("lobbyUpdate", room);
          } catch (e) {
            console.error("Error in createRoom:", e);
            socket.emit("error", e.message);
          }
        });

        // --- JOIN ROOM ---
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
            console.error("Error in joinRoom:", e);
            socket.emit("error", e.message);
          }
        });

        // --- CHECK ROOM EXISTS (callback) ---
        socket.on("checkRoomExists", async ({ roomId }, callback) => {
          try {
            const room = await getRoom(roomId);
            callback(!!room); // true if exists, false otherwise
          } catch (e) {
            console.error("Error in checkRoomExists:", e);
            callback(false);
          }
        });

        // --- GET ROOM BY PLAYER ID ---
        socket.on("getRoomByPlayerId", async () => {
          try {
            const room = await getRoomByPlayerId(playerId);
            if (!room) return;
            socket.join(room.id);
            socket.emit("roomData", room);
          } catch (e) {
            console.error("Error in getRoomByPlayerId:", e);
            socket.emit("error", e.message);
          }
        });

        // --- START GAME ---
        socket.on("startGame", async ({ roomId, mode, players }) => {
          try {
            const roundId = await startRound(players);
            const room = await startGame(roomId, playerId, mode, roundId);
            io.to(roomId).emit("gameStarted", room);
          } catch (e) {
            console.error("Error in startGame:", e);
            socket.emit("error", e.message);
          }
        });

        // --- START NEXT ROUND ---
        socket.on("startNextRound", async ({ roomId, players }) => {
          try {
            const roundId = await createRound(players);
            const room = await updateCurrentRoundId(roomId, roundId);
            io.to(roomId).emit("newRoundStarted", {
              roundId,
              roundData: room.currentRound,
            });
          } catch (e) {
            socket.emit("error", e.message);
          }
        });

        // --- REMOVE PLAYER FROM ROOM ---
        socket.on("removeFromRoom", async ({ roomId, playerIdToRemove }) => {
          try {
            const result = await removeFromRoom(
              playerId,
              roomId,
              playerIdToRemove
            );
            if (result.success && result.room) {
              const removedSocket = io.sockets.sockets.get(
                result.removedSocketId
              );
              if (removedSocket) {
                removedSocket.leave(roomId);
                removedSocket.emit("removedFromRoom", roomId);
              }
              io.to(roomId).emit("lobbyUpdate", result.room);
            } else {
              socket.emit("error", result.message);
            }
          } catch (e) {
            console.error("Error in removeFromRoom:", e);
            socket.emit("error", e.message);
          }
        });

        // --- DELETE ROOM ---
        socket.on("deleteRoom", async ({ roomId }) => {
          try {
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
          } catch (e) {
            console.error("Error in deleteRoom:", e);
            socket.emit("error", e.message);
          }
        });

        // --- GET CURRENT ROUND ---
        socket.on("getCurrentRound", async ({ currentRoundId }) => {
          try {
            const round = await getRound(currentRoundId);
            const step = await getCurrentStep(round, playerId);
          } catch (e) {
            console.error("Error in deleteRoom:", e);
            socket.emit("error", e.message);
          }
        });
      } catch (err) {
        console.error("Fatal socket connection error:", err);
        socket.disconnect(true); // disconnect client if critical error
      }
    })();
  });
};

export default setupSocketHandlers;
