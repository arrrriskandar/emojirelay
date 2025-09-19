import { useRoom } from "../contexts/RoomContext";
import { useCallback, useEffect, useMemo, useState } from "react";
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
  updateTurn,
} from "../utils/socketEvents";
import { useSocket } from "../contexts/SocketContext";
import { useToast } from "../contexts/ToastContext";

const GamePage = () => {
  const { room, loading } = useRoom();
  const { socket, playerId } = useSocket();
  const { addToast } = useToast();
  const [step, setStep] = useState();
  const [round, setRound] = useState();
  const [turn, setTurn] = useState();
  const navigate = useNavigate();

  const currentRoundId = useMemo(() => room?.rounds?.at(-1), [room]);
  const isCreator = useMemo(
    () => room?.creatorId === playerId,
    [room, playerId]
  );

  const fetchGameState = useCallback(() => {
    if (!socket || !currentRoundId) return;
    getGameState(
      socket,
      currentRoundId,
      ({ stepData, roundData, turnData }) => {
        setStep(stepData);
        setRound(roundData);
        setTurn(turnData);
      },
      (msg) => addToast("Error retrieving game state", msg, "error")
    );
  }, [addToast, currentRoundId, socket]);

  useEffect(() => {
    if (loading) return;

    if (!room) {
      navigate("/");
      return;
    }
    if (room)
      if (!room.gameStarted) {
        navigate("/lobby");
        return;
      }
    fetchGameState();
  }, [fetchGameState, loading, navigate, room]);

  useEffect(() => {
    if (!socket) return;

    const onUpdatedGameState = ({ turnData }) => {
      setTurn(turnData);
    };
    const onNewStepStarted = () => {
      fetchGameState();
    };
    registerGameEvents(socket, onUpdatedGameState, onNewStepStarted);
    return () => unregisterGameEvents(socket);
  }, [fetchGameState, socket]);

  if (loading) return <>Loading...</>;
  if (!room) return null;
  if (!step) return <>Loading...</>;

  const handleGameStateUpdate = (value, incrementValue, ready) => {
    updateGameState(
      socket,
      room.id,
      turn.id,
      incrementValue,
      step.id,
      ready,
      value,
      (stepData) => setStep(stepData),
      (msg) => addToast("Error updating game state", msg, "error")
    );
  };

  const startNextStep = () => {
    updateTurn(socket, room.id, turn.id, room.settings.turnDuration, (msg) =>
      addToast("Error starting next step", msg, "error")
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
          isCreator={isCreator}
          startNextStep={startNextStep}
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
