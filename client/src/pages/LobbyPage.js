import { useNavigate } from "react-router-dom";
import { useSocket } from "../contexts/SocketContext";
import {
  startGame,
  removeFromRoom,
  deleteRoom,
  registerLobbyEvents,
  unregisterLobbyEvents,
} from "../utils/socketEvents";
import { useRoom } from "../contexts/RoomContext";
import { VStack, Box, Heading, Text, Button } from "@chakra-ui/react";
import GameModeSelector from "../components/GameModeSelector";
import PlayerList from "../components/PlayerList";
import { useEffect, useState } from "react";
import { useToast } from "../contexts/ToastContext";
import { createLobbyListeners } from "../utils/lobbyListeners";

const LobbyPage = () => {
  const navigate = useNavigate();
  const { socket, playerId } = useSocket();
  const { room, setRoom, loading, setPlayerName } = useRoom();
  const { addToast } = useToast();
  const [mode, setMode] = useState("relaxed");

  useEffect(() => {
    if (!loading && !room) navigate("/");

    if (room && room.gameStarted) navigate("/game");
  }, [loading, room, navigate]);

  useEffect(() => {
    if (!socket) return;

    const listeners = createLobbyListeners({
      setRoom,
      setPlayerName,
      addToast,
      navigate,
    });

    registerLobbyEvents(socket, listeners);
    return () => unregisterLobbyEvents(socket);
  }, [socket, setRoom, addToast, navigate, setPlayerName]);

  if (loading) return <div>Loading...</div>;
  if (!room) return null; // in case it's null during render

  const link = `${window.location.origin}/join/${room.id}`;
  const isCreator = room.creatorId === playerId;

  const onRemovePlayerError = (msg) => {
    addToast("Failed to remove player", msg, "error");
  };

  const onDeleteRoomError = (msg) => {
    addToast("Failed to delete room", msg, "error");
  };

  const onStartGameError = (msg) => {
    addToast("Failed to start game", msg, "error");
  };

  const handleStartGame = () => {
    startGame(socket, room.id, mode, onStartGameError);
  };

  const handleRemovePlayer = (playerIdToRemove) => {
    removeFromRoom(socket, room.id, playerIdToRemove, onRemovePlayerError);
  };

  const handleDeleteRoom = () => {
    if (window.confirm("Are you sure you want to delete the room?")) {
      deleteRoom(socket, room.id, onDeleteRoomError);
    }
  };

  const handleModeChange = (mode) => {
    setMode(mode);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      addToast(
        "Link copied!",
        "You can now share this link with others.",
        "success"
      );
    } catch (err) {
      addToast("Error", "Failed to copy the link. Please try again.", "error");
    }
  };

  return (
    <VStack spacing={6} p={6} align="center" w="100%" maxW="500px" mx="auto">
      <Heading size="xl" color="teal.300">
        Lobby
      </Heading>

      <Box w="100%" p={6} borderRadius="md" shadow="md" bg="gray.700">
        {/* Room ID */}
        <Text fontWeight="bold" mb={4}>
          Room ID:{" "}
          <Text as="span" color="teal.300">
            {room.id}
          </Text>
        </Text>

        {/* Game Mode */}
        {isCreator && !room.gameStarted && (
          <GameModeSelector currentMode={mode} onChange={handleModeChange} />
        )}

        {/* Players */}
        <Text fontWeight="bold" mb={2}>
          Players waiting:
        </Text>
        <PlayerList
          players={room.players}
          creatorId={room.creatorId}
          isCreator={isCreator}
          onRemove={handleRemovePlayer}
          playerId={playerId}
        />

        {/* Start Game */}
        {isCreator && !room.gameStarted && (
          <Button colorScheme="teal" mb={4} w="100%" onClick={handleStartGame}>
            Start Game
          </Button>
        )}

        {room.gameStarted && (
          <Text color="green.300" mb={4}>
            Game has started!
          </Text>
        )}

        {/* Invite Link */}
        <Text mb={4}>
          Invite others:{" "}
          <Text
            as="span"
            color="teal.300"
            textDecoration="underline"
            cursor="pointer"
            onClick={handleCopy}
          >
            {link}
          </Text>
        </Text>

        {/* Delete Room */}
        {isCreator && (
          <Button colorScheme="red" w="100%" onClick={handleDeleteRoom}>
            Delete Room
          </Button>
        )}
      </Box>
    </VStack>
  );
};

export default LobbyPage;
