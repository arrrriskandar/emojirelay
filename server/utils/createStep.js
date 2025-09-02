import { REDIS_KEYS } from "../types/constants.js";
import { generateUID } from "./nanoid.js";
import { setRedisStep } from "./redisHelper.js";

export const createStep = async (type) => {
  const stepId = await generateUID(REDIS_KEYS.STEP);

  const step = {
    id: stepId,
    type,
    value: null,
    ready: false,
    completed: false,
  };
  await setRedisStep(stepId, step);
  return stepId;
};
