import { REDIS_KEYS } from "../types/constants.js";
import { generateUID } from "../utils/nanoid.js";
import {
  setRedisRoom,
  setRedisPlayerRoom,
  getRedisRoom,
  deleteRedisPlayerRoom,
  getRedisPlayerSocket,
  deleteRedisRoom,
  getRedisPlayerRoom,
  setRedisRoomPlayers,
  getRedisRoomPlayers,
  redisCheckAlreadyInRoom,
  redisRemoveFromRoom,
} from "../utils/redisHelper.js";

export const createRoom = async (playerId, creatorName) => {
  const roomId = await generateUID(REDIS_KEYS.ROOM);

  const room = {
    id: roomId,
    creatorId: playerId,
    gameStarted: false,
    settings: { turnDuration: 60000 },
    rounds: [],
  };

  const player = {
    id: playerId,
    name: creatorName,
  };

  await setRedisRoom(room);
  await setRedisRoomPlayers(roomId, playerId, player);
  await setRedisPlayerRoom(playerId, roomId);

  return { ...room, players: [player] };
};

export const getRoom = async (roomId) => {
  return await getRedisRoom(roomId);
};

const getRoomPlayers = async (roomId) => {
  return await getRedisRoomPlayers(roomId);
};

export const getRoomByPlayerId = async (playerId) => {
  const roomId = await getRedisPlayerRoom(playerId);
  if (!roomId) return null;
  const room = await getRoom(roomId);
  const players = await getRoomPlayers(roomId);
  return { ...room, players };
};

export const joinRoom = async (roomId, playerId, playerName) => {
  const alreadyInRoom = await redisCheckAlreadyInRoom(roomId, playerId);
  const room = await getRoom(roomId);

  if (room.gameStarted) throw new Error("Game already started");

  const player = {
    id: playerId,
    name: playerName,
  };

  if (!alreadyInRoom) {
    await setRedisPlayerRoom(playerId, roomId);
    await setRedisRoomPlayers(roomId, playerId, player);
  }
  const players = await getRoomPlayers(roomId);
  return { ...room, players };
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

  const removed = await redisRemoveFromRoom(roomId, playerIdToRemove);

  if (removed === 0) {
    return { success: false, message: "Player not in room" };
  }
  await deleteRedisPlayerRoom(playerIdToRemove);

  const removedSocketId = await getRedisPlayerSocket(playerIdToRemove);
  const players = await getRoomPlayers(roomId);

  const updatedRoom = { ...room, players };
  return { success: true, room: updatedRoom, removedSocketId };
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

export const startGame = async (roomId, playerId, turnDuration, roundId) => {
  const room = await getRoom(roomId);
  if (!room) throw new Error("Room not found");
  if (room.creatorId !== playerId)
    throw new Error("Only creator can start the game");
  if (room.gameStarted) throw new Error("Game already started");

  room.rounds.push(roundId);
  room.gameStarted = true;
  room.settings.turnDuration = turnDuration;
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
