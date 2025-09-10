import { REDIS_KEYS } from "../types/constants.js";
import { generateUID } from "../utils/nanoid.js";
import { getRedisTurn, setRedisTurn } from "../utils/redisHelper.js";

export const createTurn = async (turnDuration) => {
  const turnId = await generateUID(REDIS_KEYS.TURN);
  startNextTurn(turnId, turnDuration);
  return turnId;
};

export const startNextTurn = async (turnId, turnDuration) => {
  const turn = {
    id: turnId,
    turnIndex: 0,
    readyCount: 0,
    turnDeadline: Date.now() + turnDuration,
  };
  await setRedisTurn(turnId, turn);
};

export const getTurn = async (turnId) => {
  const turn = await getRedisTurn(turnId);
  return JSON.parse(turn);
};
