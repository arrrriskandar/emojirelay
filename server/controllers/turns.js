import { REDIS_KEYS } from "../types/constants.js";
import { generateUID } from "../utils/nanoid.js";
import {
  getRedisTurn,
  redisCreateTurn,
  redisStartNextTurn,
  redisUpdateReadyCount,
} from "../utils/redisHelper.js";

export const createTurn = async (turnDuration) => {
  const turnId = await generateUID(REDIS_KEYS.TURN);
  const turnDeadline = Date.now() + turnDuration;
  await redisCreateTurn(turnId, turnDeadline);
  return turnId;
};

export const startNextTurn = async (turnId, turnDuration) => {
  const turnDeadline = Date.now() + turnDuration;
  await redisStartNextTurn(turnId, turnDeadline);
};

export const getTurn = async (turnId) => {
  return await getRedisTurn(turnId);
};

export const updateReadyCount = async (turnId, value) => {
  await redisUpdateReadyCount(turnId, value);
  return getTurn(turnId);
};
