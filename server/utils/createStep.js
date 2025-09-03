import { REDIS_KEYS } from "../types/constants.js";
import { generateUID } from "./nanoid.js";
import { setRedisStep } from "./redisHelper.js";

export const createStep = async (playerId) => {
  const stepId = await generateUID(REDIS_KEYS.STEP);

  const step = {
    id: stepId,
    value: null,
    ready: false,
    playerId,
  };
  await setRedisStep(stepId, step);
  return stepId;
};
