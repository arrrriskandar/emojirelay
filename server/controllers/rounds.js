import { REDIS_KEYS } from "../types/constants.js";
import { createRound } from "../utils/createRound.js";
import { setRedisRound } from "../utils/redisHelper.js";

export const startRound = async (players) => {
  const roundId = await generateUID(REDIS_KEYS.ROUND);
  const relays = await createRound(players);
  const round = {
    id: roundId,
    relays,
    turnIndex: 0,
  };
  await setRedisRound(roundId, round);
  return roundId;
};

export const getRound = async (roundId) => {
  const round = await getRedisRound(roundId);
  return round;
};
