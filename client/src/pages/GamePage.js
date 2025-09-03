import { useRoom } from "../contexts/RoomContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import WritePhase from "../components/WritePhase";
import EmojiPhase from "../components/EmojiPhase";
import GuessPhase from "../components/GuessPhase";
import RoundReviewPhase from "../components/RoundReviewPhase";
import { getCurrentTurn } from "../utils/socketEvents";
import { useSocket } from "../contexts/SocketContext";
import { useToast } from "../contexts/ToastContext";

const GamePage = () => {
  const { room, loading } = useRoom();
  const { socket } = useSocket();
  const { addToast } = useToast();
  const [step, setStep] = useState();
  const [prevStep, setPrevStep] = useState();
  const [round, setRound] = useState();
  const [readyCount, setReadyCount] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    const onSuccess = ({
      stepData,
      roundData,
      prevStepValue,
      readyCounter,
    }) => {
      setStep(stepData);
      setPrevStep(prevStepValue);
      setRound(roundData);
      setReadyCount(readyCounter);
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
        getCurrentTurn(socket, currentRoundId, onSuccess, onError);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addToast, loading, navigate, room, socket]);

  if (loading) return <>Loading........</>;
  if (!room) return null;
  if (!round) return <>Loading...</>;

  switch (round.turnType) {
    case "write":
      return (
        <WritePhase
          step={step}
          readyCount={readyCount}
          totalCount={room.players.length}
        />
      );
    case "emoji":
      return (
        <EmojiPhase
          step={step}
          prevStep={prevStep}
          readyCount={readyCount}
          totalCount={room.players.length}
        />
      );
    case "guess":
      return (
        <GuessPhase
          step={step}
          prevStep={prevStep}
          readyCount={readyCount}
          totalCount={room.players.length}
        />
      );
    case "review":
      return <RoundReviewPhase round={round} />;
    default:
      return <p>Unknown phase</p>;
  }
};
export default GamePage;
