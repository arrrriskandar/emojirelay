import { useRoom } from "../contexts/RoomContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import WritePhase from "../components/WritePhase";
import EmojiPhase from "../components/EmojiPhase";
import GuessPhase from "../components/GuessPhase";
import RoundReviewPhase from "../components/RoundReviewPhase";
import {
  getGameState,
  registerGameEvents,
  unregisterGameEvents,
  updateGameState,
} from "../utils/socketEvents";
import { useSocket } from "../contexts/SocketContext";
import { useToast } from "../contexts/ToastContext";

const GamePage = () => {
  const { room, loading } = useRoom();
  const { socket } = useSocket();
  const { addToast } = useToast();
  const [step, setStep] = useState();
  const [round, setRound] = useState();
  const [turn, setTurn] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const onSuccess = ({ stepData, roundData, turnData }) => {
      setTurn(turnData);
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
        getGameState(socket, currentRoundId, onSuccess, onError);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addToast, loading, navigate, room, socket]);

  useEffect(() => {
    if (!socket) return;

    const onUpdatedGameState = ({ turnData }) => {
      setTurn(turnData);
    };
    registerGameEvents(socket, onUpdatedGameState);
    return () => unregisterGameEvents(socket);
  }, [socket]);

  if (loading) return <>Loading........</>;
  if (!room) return null;
  if (!step) return <>Loading...</>;

  const onUpdateGameStateSuccess = (stepData) => {
    setStep(stepData);
  };

  const onUpdateGameStateError = (msg) => {
    addToast("Error updating game state", msg, "error");
  };

  const handleGameStateUpdate = (value, incrementValue, ready) => {
    updateGameState(
      socket,
      room.id,
      turn.id,
      incrementValue,
      step.id,
      ready,
      value,
      onUpdateGameStateSuccess,
      onUpdateGameStateError
    );
  };
  switch (step.type) {
    case "write":
      return (
        <WritePhase
          step={step}
          totalCount={room.players.length}
          turn={turn}
          handleGameStateUpdate={handleGameStateUpdate}
        />
      );
    case "emoji":
      return (
        <EmojiPhase step={step} totalCount={room.players.length} turn={turn} />
      );
    case "guess":
      return (
        <GuessPhase step={step} totalCount={room.players.length} turn={turn} />
      );
    case "review":
      return <RoundReviewPhase round={round} />;
    default:
      return <p>Unknown phase</p>;
  }
};
export default GamePage;
