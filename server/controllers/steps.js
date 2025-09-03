import { getRedisStep } from "../utils/redisHelper.js";

export const getCurrentStep = async (round, playerId) => {
  const turnIndex = round.turnIndex;
  if (round.turnType == "review") return;

  let step;
  let prevStepValue;
  let readyCounter = 0;

  for (let relay of round.relays) {
    const stepId = relay.stepIds[turnIndex];
    const stepDataRaw = await getRedisStep(stepId);
    const stepData = JSON.parse(stepDataRaw);
    if (stepData.ready) readyCounter++;
    if (stepData.playerId === playerId) {
      step = stepData;
      if (turnIndex !== 0) {
        prevStepValue = await getRedisStep(relaySteps[turnIndex - 1].id);
      }
    }
  }
  return { step, prevStepValue, readyCounter };
};
