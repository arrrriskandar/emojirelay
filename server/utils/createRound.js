import { createStep } from "../controllers/steps.js";

export const createRound = async (players, maxTurn) => {
  const shuffled = [...players].sort(() => Math.random() - 0.5);

  const relays = [];

  for (let idx = 0; idx < shuffled.length; idx++) {
    let nextIdx = (idx + 1) % shuffled.length;

    const stepIds = [];

    for (let step = 0; step < maxTurn; step++) {
      const playerId = shuffled[nextIdx].id;
      const type =
        step === 0
          ? "write"
          : step === maxTurn - 1
          ? "review"
          : step % 2 == 0
          ? "guess"
          : "emoji";
      const stepId = await createStep(playerId, type);
      stepIds.push(stepId);

      nextIdx = (nextIdx + 1) % shuffled.length;
    }
    relays.push({
      stepIds,
    });
  }

  return relays;
};
