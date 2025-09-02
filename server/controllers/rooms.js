import { REDIS_KEYS } from "../types/constants.js";
import { generateUID } from "../utils/nanoid.js";
import {
  setRedisRoom,
  setRedisPlayerRoom,
  getRedisRoom,
  deleteRedisPlayerRoom,
  getRedisPlayerSocket,
  deleteRedisRoom,
  getRedisRoomByPlayerId,
} from "../utils/redisHelper.js";

export const createRoom = async (playerId, creatorName) => {
  const roomId = await generateUID(REDIS_KEYS.ROOM);

  const room = {
    id: roomId,
    creatorId: playerId,
    players: [{ id: playerId, name: creatorName }],
    gameStarted: false,
    settings: { mode: "relaxed" },
    rounds: [],
  };

  await setRedisRoom(room);
  await setRedisPlayerRoom(playerId, roomId);
  return room;
};

export const getRoom = async (roomId) => {
  const data = await getRedisRoom(roomId);
  return data ? JSON.parse(data) : null;
};

export const getRoomByPlayerId = async (playerId) => {
  const roomId = await getRedisRoomByPlayerId(playerId);
  if (!roomId) return null;
  return getRoom(roomId);
};

export const joinRoom = async (roomId, playerId, playerName) => {
  const room = await getRoom(roomId);
  if (!room) return null;
  if (room.gameStarted) throw new Error("Game already started");

  if (!room.players.find((p) => p.id === playerId)) {
    room.players.push({ id: playerId, name: playerName });
    await setRedisRoom(room);
    await setRedisPlayerRoom(playerId, roomId);
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
  await setRedisRoom(room);
  await deleteRedisPlayerRoom(playerIdToRemove);

  const removedSocketId = await getRedisPlayerSocket(playerIdToRemove);
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
  await deleteRedisRoom(roomId);
  for (const p of room.players) {
    await deleteRedisPlayerRoom(p.id);
  }

  return { success: true, message: "Room deleted successfully" };
};

export const startGame = async (roomId, playerId, mode, roundId) => {
  const room = await getRoom(roomId);
  if (!room) throw new Error("Room not found");
  if (room.creatorId !== playerId)
    throw new Error("Only creator can start the game");
  if (room.gameStarted) throw new Error("Game already started");

  room.rounds.push(roundId);
  room.gameStarted = true;
  room.settings.mode = mode;
  await setRedisRoom(room);
  return room;
};

export const updateCurrentRoundId = async (roomId, roundId) => {
  const room = await getRedisRoom(roomId);
  if (!room) throw new Error("Room not found");

  room.rounds.push(roundId);
  await setRedisRoom(room);

  return room;
};
