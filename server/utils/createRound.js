import { createStep } from "./createStep.js";

export const createRound = async (players) => {
  const shuffled = [...players].sort(() => Math.random() - 0.5);

  const relays = [];

  for (let idx = 0; idx < shuffled.length; idx++) {
    const creator = shuffled[idx];
    let nextIdx = (idx + 1) % shuffled.length;

    const steps = [];

    for (let step = 0; step < shuffled.length - 1; step++) {
      const type = step === 0 ? "write" : step % 2 === 1 ? "emoji" : "guess";
      if (step === shuffled.length - 2 && type === "emoji") {
        break;
      }
      const playerId = shuffled[nextIdx].id;

      const stepId = await createStep(type);
      steps.push({ id: stepId, playerId });

      nextIdx = (nextIdx + 1) % shuffled.length;
    }

    const relaySteps = [...steps, { type: "review" }];
    relays.push({
      creatorId: creator.id,
      steps: relaySteps,
    });
  }

  return relays;
};
