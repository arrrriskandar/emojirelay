import { useRoom } from "../contexts/RoomContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WritePhase from "../components/WritePhase";
import EmojiPhase from "../components/EmojiPhase";
import GuessPhase from "../components/GuessPhase";

const GamePage = () => {
  const { room, loading } = useRoom();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && !room) navigate("/");

    if (room && !room.gameStarted) navigate("/lobby");
  }, [loading, room, navigate]);

  if (loading) return <>Loading........</>;
  if (!room) return null;

  // const latestRound = room.rounds[room.rounds.length - 1];
  // const latestRelay = latestRound.relays[latestRound.relays.length - 1];

  // // Find the first step that is not completed
  // const currentStep = latestRelay.sequence.find((step) => !step.completed);

  const currentStep = { type: "guess" };

  if (!currentStep) return <p>Round complete!</p>;

  switch (currentStep.type) {
    case "write":
      return <WritePhase step={currentStep} />;
    case "emoji":
      return <EmojiPhase step={currentStep} />;
    case "guess":
      return <GuessPhase step={currentStep} />;
    default:
      return <p>Unknown phase</p>;
  }
};
export default GamePage;
