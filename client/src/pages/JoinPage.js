import { useNavigate } from "react-router-dom";
import { useSocket } from "../contexts/SocketContext";
import { joinRoom, registerLobbyEvents } from "../utils/socketEvents";
import UsernameInput from "../components/UsernameInput";
import { useRoom } from "../contexts/RoomContext";
import { useParams } from "react-router-dom";
import { VStack, Heading, Box, useToast } from "@chakra-ui/react";

const JoinPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { socket } = useSocket();
  const { setPlayerName, setRoom } = useRoom();
  const toast = useToast();
  const handleCreate = (name) => {
    joinRoom(socket, { roomId, playerName: name });
    registerLobbyEvents(socket, {
      onLobbyUpdate: (room) => {
        setPlayerName(name);
        setRoom(room);
      },
      onGameStarted: () => {
        navigate("/");
        toast({
          title: "Game started",
          description: "The game has begun!",
          status: "info",
          duration: 2500,
          isClosable: true,
          position: "top",
        });
      },
    });
    navigate("/lobby");
  };

  return (
    <VStack spacing={6} justify="center" align="center" h="100vh" p={4}>
      <Heading size="2xl" color="teal.600">
        Emoji Relay
      </Heading>
      <Box w={{ base: "90%", sm: "400px" }} textAlign="center">
        <UsernameInput buttonText="Join Game" onSubmit={handleCreate} />
      </Box>
    </VStack>
  );
};

export default JoinPage;
