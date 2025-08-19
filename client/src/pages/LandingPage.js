import { useNavigate } from "react-router-dom";
import { useSocket } from "../contexts/SocketContext";
import { createRoom } from "../utils/socketEvents";
import UsernameInput from "../components/UsernameInput";
import { useRoom } from "../contexts/RoomContext";
import { VStack, Heading, Box, useToast } from "@chakra-ui/react";

const LandingPage = () => {
  const navigate = useNavigate();
  const { socket } = useSocket();
  const { setPlayerName, setRoom } = useRoom();
  const toast = useToast();
  const handleCreate = (name) => {
    createRoom(
      socket,
      name,
      (room) => {
        setRoom(room);
        setPlayerName(name);
        navigate("/lobby");
      },
      (msg) => {
        toast({
          title: "Error creating room",
          description: msg,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }
    );
  };

  return (
    <VStack spacing={6} justify="center" align="center" h="100vh" p={4}>
      <Heading size="2xl" color="teal.600">
        Emoji Relay
      </Heading>
      <Box w={{ base: "90%", sm: "400px" }} textAlign="center">
        <UsernameInput buttonText="Create Game" onSubmit={handleCreate} />
      </Box>
    </VStack>
  );
};

export default LandingPage;
