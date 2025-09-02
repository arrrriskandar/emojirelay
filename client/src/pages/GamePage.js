import { useRoom } from "../contexts/RoomContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import WritePhase from "../components/WritePhase";
import EmojiPhase from "../components/EmojiPhase";
import GuessPhase from "../components/GuessPhase";
import RoundReviewPhase from "../components/RoundReviewPhase";
import { getCurrentRound } from "../utils/socketEvents";
import { useSocket } from "../contexts/SocketContext";
import { useToast } from "../contexts/ToastContext";

const GamePage = () => {
  const { room, loading } = useRoom();
  const { socket } = useSocket();
  const { addToast } = useToast();
  const { step, setStep } = useState();
  const { prevStep, setPrevStep } = useState();
  const { round, setRound } = useState();
  const navigate = useNavigate();
  useEffect(() => {
    const onSuccess = ({ stepData, roundData }) => {
      setStep(stepData);
      setRound(roundData);
    };
    const onError = (msg) => {
      addToast("Error retrieving current round", msg, "error");
    };
    if (!loading && !room) navigate("/");
    if (room)
      if (!room.gameStarted) {
        navigate("/lobby");
      } else {
        const currentRoundId = room.rounds[room.rounds.length - 1];
        getCurrentRound(socket, currentRoundId, onSuccess, onError);
      }
  }, [loading, room, navigate, addToast, setRound, setStep, socket]);

  if (loading) return <>Loading........</>;
  if (!room) return null;

  switch (step.type) {
    case "write":
      return <WritePhase step={step} />;
    case "emoji":
      return <EmojiPhase step={step} />;
    case "guess":
      return <GuessPhase step={step} />;
    case "review":
      return <RoundReviewPhase round={round} />;
    default:
      return <p>Unknown phase</p>;
  }
};
export default GamePage;
