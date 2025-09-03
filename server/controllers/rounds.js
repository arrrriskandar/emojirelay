import { REDIS_KEYS } from "../types/constants.js";
import { createRound } from "../utils/createRound.js";
import { setRedisRound, getRedisRound } from "../utils/redisHelper.js";
import { generateUID } from "../utils/nanoid.js";

export const startRound = async (players) => {
  const roundId = await generateUID(REDIS_KEYS.ROUND);
  const numOfPlayers = players.length;
  const maxTurn = numOfPlayers % 2 === 0 ? numOfPlayers : numOfPlayers + 1;
  const relays = await createRound(players, maxTurn);
  const round = {
    id: roundId,
    relays,
    turnIndex: 0,
    maxTurn,
  };
  await setRedisRound(roundId, round);
  return roundId;
};

export const getRound = async (roundId) => {
  let round = await getRedisRound(roundId);
  round = JSON.parse(round);
  round.turnType =
    round.turnIndex === 0
      ? "write"
      : round.turnIndex === round.maxTurn - 1
      ? "review"
      : round.turnIndex % 2 == 0
      ? "guess"
      : "emoji";
  return round;
};
