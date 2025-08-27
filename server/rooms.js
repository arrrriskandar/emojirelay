import redisClient from "./redisClient.js";
import { nanoid } from "nanoid";

const ROOM_PREFIX = "ROOM:";
const PLAYER_ROOM = "PLAYER_ROOM:";
const PLAYER_SOCKET = "PLAYER_SOCKET:";

const generateUniqueRoomId = async () => {
  let id;
  do {
    id = nanoid(6); // or your preferred length
  } while (await redisClient.exists(ROOM_PREFIX + id));
  return id;
};

export const createRoom = async (playerId, creatorName) => {
  const roomId = await generateUniqueRoomId();

  const room = {
    id: roomId,
    creatorId: playerId,
    players: [{ id: playerId, name: creatorName }],
    gameStarted: false,
    rounds: [],
    settings: { mode: "relaxed" },
  };

  await redisClient.set(ROOM_PREFIX + roomId, JSON.stringify(room));
  await redisClient.set(PLAYER_ROOM + playerId, roomId);
  return room;
};

export const getRoom = async (roomId) => {
  const data = await redisClient.get(ROOM_PREFIX + roomId);
  return data ? JSON.parse(data) : null;
};

export const getRoomByPlayerId = async (playerId) => {
  const roomId = await redisClient.get(PLAYER_ROOM + playerId);
  if (!roomId) return null;
  return getRoom(roomId);
};

export const joinRoom = async (roomId, playerId, playerName) => {
  const room = await getRoom(roomId);
  if (!room) return null;
  if (room.gameStarted) throw new Error("Game already started");

  if (!room.players.find((p) => p.id === playerId)) {
    room.players.push({ id: playerId, name: playerName });
    await redisClient.set(ROOM_PREFIX + roomId, JSON.stringify(room));
    await redisClient.set(PLAYER_ROOM + playerId, roomId);
  }
  return room;
};

export const removeFromRoom = async (playerId, roomId, playerIdToRemove) => {
  const room = await getRoom(roomId);
  if (!room) return { success: false, message: "Room not found" };
  if (playerId !== room.creatorId) {
    return {
      success: false,
      message: "Only the creator can remove players from the room",
    };
  }
  // Prevent removing the creator
  if (playerIdToRemove === room.creatorId) {
    return { success: false, message: "Cannot remove the creator" };
  }

  // Remove the player from players array
  const playerIndex = room.players.findIndex((p) => p.id === playerIdToRemove);
  if (playerIndex === -1)
    return { success: false, message: "Player not in room" };
  room.players.splice(playerIndex, 1);
  await redisClient.set(ROOM_PREFIX + roomId, JSON.stringify(room));
  await redisClient.del(PLAYER_ROOM + playerIdToRemove);

  const removedSocketId = await redisClient.get(
    PLAYER_SOCKET + playerIdToRemove
  );
  return { success: true, room, removedSocketId };
};

export const deleteRoom = async (playerId, roomId) => {
  const room = await getRoom(roomId);
  if (!room) return { success: false, message: "Room not found" };

  // Only creator can delete
  if (playerId !== room.creatorId) {
    return { success: false, message: "Only the creator can delete the room" };
  }

  // Delete room and all player mappings
  await redisClient.del(ROOM_PREFIX + roomId);
  for (const p of room.players) {
    await redisClient.del(PLAYER_ROOM + p.id);
  }

  return { success: true, message: "Room deleted successfully" };
};

export const startGame = async (roomId, playerId, mode) => {
  const room = await getRoom(roomId);
  if (!room) throw new Error("Room not found");
  if (room.creatorId !== playerId)
    throw new Error("Only creator can start the game");
  if (room.gameStarted) throw new Error("Game already started");

  room.gameStarted = true;
  room.settings.mode = mode;
  await redisClient.set(ROOM_PREFIX + roomId, JSON.stringify(room));
  return room;
};

export const createPlayerIdMapping = async (socketId, playerId) => {
  await redisClient.set(PLAYER_SOCKET + playerId, socketId);
};
