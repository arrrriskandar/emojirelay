import { REDIS_KEYS } from "../types/constants.js";
import redisClient from "../config/redisClient.js";

export const checkUIDExist = async (UID) => {
  return await redisClient.exists(UID);
};
export const setRedisRoom = async (room) => {
  await redisClient.set(REDIS_KEYS.ROOM + room.id, JSON.stringify(room));
};

export const setRedisPlayerRoom = async (playerId, roomId) => {
  await redisClient.set(REDIS_KEYS.PLAYER_ROOM + playerId, roomId);
};

export const getRedisRoom = async (roomId) => {
  return await redisClient.get(REDIS_KEYS.ROOM + roomId);
};

export const getRedisRoomByPlayerId = async (playerId) => {
  return await redisClient.get(REDIS_KEYS.PLAYER_ROOM + playerId);
};

export const deleteRedisPlayerRoom = async (playerId) => {
  await redisClient.del(REDIS_KEYS.PLAYER_ROOM + playerId);
};

export const getRedisPlayerSocket = async (playerId) => {
  return await redisClient.get(REDIS_KEYS.PLAYER_SOCKET + playerId);
};

export const deleteRedisRoom = async (roomId) => {
  await redisClient.del(REDIS_KEYS.ROOM + roomId);
};

export const setPlayerSocket = async (playerId, socketId) => {
  await redisClient.set(REDIS_KEYS.PLAYER_SOCKET + playerId, socketId);
};

export const setRedisRound = async (roundId, round) => {
  await redisClient.set(REDIS_KEYS.ROUND + roundId, JSON.stringify(round));
};

export const setRedisStep = async (stepId, step) => {
  await redisClient.set(REDIS_KEYS.STEP + stepId, JSON.stringify(step));
};

export const getRedisRound = async (roundId) => {
  return await redisClient.get(REDIS_KEYS.ROUND + roundId);
};

export const getRedisStep = async (stepId) => {
  return await redisClient.get(REDIS_KEYS.STEP + stepId);
};

export const setRedisTurn = async (turnId, turn) => {
  await redisClient.set(REDIS_KEYS.TURN + turnId, JSON.stringify(turn));
};

export const getRedisTurn = async (turnId) => {
  return await redisClient.get(REDIS_KEYS.TURN + turnId);
};
