import { REDIS_KEYS } from "../types/constants.js";
import { createRound } from "../utils/createRound.js";
import { setRedisRound, getRedisRound } from "../utils/redisHelper.js";
import { generateUID } from "../utils/nanoid.js";

export const startRound = async (players, turnId) => {
  const roundId = await generateUID(REDIS_KEYS.ROUND);
  const numOfPlayers = players.length;
  const maxTurn = numOfPlayers % 2 === 0 ? numOfPlayers : numOfPlayers + 1;
  const relays = await createRound(players, maxTurn);
  const round = {
    id: roundId,
    relays,
    maxTurn,
    turnId,
  };
  await setRedisRound(roundId, round);
  return roundId;
};

export const getRound = async (roundId) => {
  const round = await getRedisRound(roundId);
  return JSON.parse(round);
};
