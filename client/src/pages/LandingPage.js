import { useNavigate } from "react-router-dom";
import { useSocket } from "../contexts/SocketContext";
import { createRoom } from "../utils/socketEvents";
import TextInput from "../components/TextInput";
import { VStack, Heading, Box } from "@chakra-ui/react";
import { useToast } from "../contexts/ToastContext";

const LandingPage = () => {
  const navigate = useNavigate();
  const { socket } = useSocket();
  const { addToast } = useToast();

  const handleCreate = (name) => {
    createRoom(
      socket,
      name,
      () => {
        addToast(
          "Room created",
          "Your room is ready for player. Invite players by sharing the link.",
          "success"
        );
        navigate("/lobby");
      },
      (msg) => addToast("Error creating room", msg, "error")
    );
  };

  return (
    <VStack spacing={6} justify="center" align="center" h="100vh" p={4}>
      <Heading size="2xl" color="teal.600">
        Emoji Relay
      </Heading>
      <Box w={{ base: "90%", sm: "400px" }} textAlign="center">
        <TextInput
          buttonText="Create Game"
          onSubmit={handleCreate}
          placeholderText={"Please enter a username"}
          errorTitle={"Username required"}
          errorDescription={"Please enter a username"}
        />
      </Box>
    </VStack>
  );
};

export default LandingPage;
