import { v4 as uuidv4 } from "uuid";

const getPlayerId = () => {
  let playerId = localStorage.getItem("playerId");
  if (!playerId) {
    playerId = uuidv4();
    localStorage.setItem("playerId", playerId);
  }
  return playerId;
};
export default getPlayerId;
