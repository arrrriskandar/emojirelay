import { getRedisStep, setRedisStep } from "../utils/redisHelper.js";
import { REDIS_KEYS } from "../types/constants.js";
import { generateUID } from "../utils/nanoid.js";

export const createStep = async (playerId, type) => {
  const stepId = await generateUID(REDIS_KEYS.STEP);

  const step = {
    id: stepId,
    value: null,
    ready: false,
    playerId,
    type,
  };
  await setRedisStep(stepId, step);
  return stepId;
};

export const getStep = async (stepId) => {
  return await getRedisStep(stepId);
};

export const getCurrentStep = async (round, playerId, turnIndex) => {
  const stepIds = round.relays
    .map((relay) => relay.stepIds[turnIndex])
    .filter(Boolean);

  if (stepIds.length === 0) return null;

  const steps = await Promise.all(stepIds.map((id) => getStep(id)));

  const step = steps.find((s) => s?.playerId === playerId);
  if (!step) return null;

  if (step.type === "emoji" || step.type === "guess") {
    const relay = round.relays.find((r) => r.stepIds[turnIndex] === step.id);
    const prevStepId = relay?.stepIds[turnIndex - 1];

    if (prevStepId) {
      const prevStep = await getStep(prevStepId);
      step.previousValue = prevStep?.value ?? null;
    }
  }

  return step;
};

export const updateStep = async (stepId, ready, value = null) => {
  const step = await getStep(stepId);

  step.ready = ready;
  if (value) {
    step.value = value;
  }
  await setRedisStep(stepId, step);
  return step;
};
