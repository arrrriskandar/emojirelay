import { REDIS_KEYS } from "../types/constants.js";
import { generateUID } from "../utils/nanoid.js";
import { getRedisTurn, setRedisTurn } from "../utils/redisHelper.js";

export const createTurn = async () => {
  const turnId = await generateUID(REDIS_KEYS.TURN);

  const turn = {
    id: turnId,
    turnIndex: 0,
    readyCount: 0,
  };
  await setRedisTurn(turnId, turn);
  return turnId;
};

export const getTurn = async (turnId) => {
  const turn = await getRedisTurn(turnId);
  return JSON.parse(turn);
};
