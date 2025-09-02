export const getCurrentStep = async (round, playerId) => {
  const turnIndex = round.turnIndex;

  for (let relaySteps of round.relays) {
    if (relaySteps[turnIndex].playerId === playerId) {
      const step = await getRedisStep(relaySteps[turnIndex].id);
      if (step.type === "emoji") {
      }
      return step;
    }
  }
};
