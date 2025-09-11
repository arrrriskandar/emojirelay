import { REDIS_KEYS } from "../types/constants.js";
import redisClient from "../config/redisClient.js";

export const checkUIDExist = async (UID) => {
  return await redisClient.exists(UID);
};

// --- ROOM HELPER ---
export const setRedisRoom = async (room) => {
  await redisClient.set(REDIS_KEYS.ROOM + room.id, JSON.stringify(room));
};

export const getRedisRoom = async (roomId) => {
  const room = await redisClient.get(REDIS_KEYS.ROOM + roomId);
  return room ? JSON.parse(room) : null;
};

export const deleteRedisRoom = async (roomId) => {
  await redisClient.del(REDIS_KEYS.ROOM + roomId);
};

// --- ROOM PLAYERS HELPER ---
export const setRedisRoomPlayers = async (roomId, playerId, player) => {
  await redisClient.hSet(
    REDIS_KEYS.ROOM_PLAYERS + roomId,
    playerId,
    JSON.stringify(player)
  );
};

export const getRedisRoomPlayers = async (roomId) => {
  const playerEntries = await redisClient.hGetAll(
    REDIS_KEYS.ROOM_PLAYERS + roomId
  );

  return Object.values(playerEntries).map((playerStr) => JSON.parse(playerStr));
};

export const redisCheckAlreadyInRoom = async (roomId, playerId) => {
  return redisClient.hExists(REDIS_KEYS.ROOM_PLAYERS + roomId, playerId);
};

export const redisRemoveFromRoom = async (roomId, playerId) => {
  return redisClient.hDel(REDIS_KEYS.ROOM_PLAYERS + roomId, playerId);
};

// --- PLAYER ROOM HELPER ---
export const setRedisPlayerRoom = async (playerId, roomId) => {
  await redisClient.set(REDIS_KEYS.PLAYER_ROOM + playerId, roomId);
};

export const getRedisPlayerRoom = async (playerId) => {
  return await redisClient.get(REDIS_KEYS.PLAYER_ROOM + playerId);
};

export const deleteRedisPlayerRoom = async (playerId) => {
  await redisClient.del(REDIS_KEYS.PLAYER_ROOM + playerId);
};

// --- PLAYER SOCKET HELPER ---
export const getRedisPlayerSocket = async (playerId) => {
  return await redisClient.get(REDIS_KEYS.PLAYER_SOCKET + playerId);
};

export const setRedisPlayerSocket = async (playerId, socketId) => {
  await redisClient.set(REDIS_KEYS.PLAYER_SOCKET + playerId, socketId);
};

// --- ROUND HELPER ---
export const setRedisRound = async (roundId, round) => {
  await redisClient.set(REDIS_KEYS.ROUND + roundId, JSON.stringify(round));
};

export const getRedisRound = async (roundId) => {
  const round = await redisClient.get(REDIS_KEYS.ROUND + roundId);
  return round ? JSON.parse(round) : null;
};

// --- STEP HELPER ---
export const setRedisStep = async (stepId, step) => {
  await redisClient.set(REDIS_KEYS.STEP + stepId, JSON.stringify(step));
};

export const getRedisStep = async (stepId) => {
  const step = await redisClient.get(REDIS_KEYS.STEP + stepId);
  return step ? JSON.parse(step) : null;
};

// --- TURN HELPER ---
export const setRedisTurn = async (turnId, turn) => {
  await redisClient.set(REDIS_KEYS.TURN + turnId, JSON.stringify(turn));
};

export const getRedisTurn = async (turnId) => {
  const turn = await redisClient.get(REDIS_KEYS.TURN + turnId);
  return turn ? JSON.parse(turn) : null;
};
