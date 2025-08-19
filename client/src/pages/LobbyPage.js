import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../contexts/SocketContext";
import {
  registerLobbyEvents,
  unregisterLobbyEvents,
  startGame,
} from "../utils/socketEvents";
import { useRoom } from "../contexts/RoomContext";
import {
  VStack,
  Box,
  Heading,
  Text,
  Button,
  List,
  ListItem,
  useToast,
} from "@chakra-ui/react";

const LobbyPage = () => {
  const navigate = useNavigate();
  const { socket, playerId } = useSocket();
  const { room, setRoom } = useRoom();
  const toast = useToast();

  useEffect(() => {
    registerLobbyEvents(socket, {
      onLobbyUpdate: (room) => setRoom(room),
      onGameStarted: () => navigate("/game"),
    });

    return () => unregisterLobbyEvents(socket);
  }, [navigate, socket, setRoom]);

  const handleStartGame = () => {
    startGame(socket, room.id);
    navigate("/game");
  };

  const handleCopy = async () => {
    const link = `${window.location.origin}/join/${room.id}`;
    try {
      await navigator.clipboard.writeText(link);
      toast({
        title: "Link copied!",
        description: "You can now share this link with others.",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    } catch (err) {
      console.error("Failed to copy!", err);
      toast({
        title: "Error",
        description: "Failed to copy the link.",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    }
  };

  if (!room) return <Text>Loading room...</Text>;

  const link = `${window.location.origin}/join/${room.id}`;

  return (
    <VStack spacing={6} p={6} align="center" w="100%" maxW="500px" mx="auto">
      <Heading size="xl" color="teal.300">
        Lobby
      </Heading>

      <Box w="100%" p={6} borderRadius="md" shadow="md" bg="gray.700">
        <Text fontWeight="bold" mb={2}>
          Room ID:{" "}
          <Text as="span" color="teal.300">
            {room.id}
          </Text>
        </Text>

        <Text fontWeight="bold" mb={2}>
          Players waiting:
        </Text>
        <List spacing={2} mb={4}>
          {room.players.map((p) => (
            <ListItem key={p.id} pl={2}>
              • {p.name} {p.id === room.creatorId && "(Host)"}
            </ListItem>
          ))}
        </List>

        {room.creatorId === playerId && !room.gameStarted && (
          <Button colorScheme="teal" mb={4} onClick={handleStartGame} w="100%">
            Start Game
          </Button>
        )}

        {room.gameStarted && (
          <Text color="green.300" mb={4}>
            Game has started!
          </Text>
        )}

        <Text>
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
      </Box>
    </VStack>
  );
};

export default LobbyPage;
