import { useNavigate, useParams } from "react-router-dom";
import { useSocket } from "../contexts/SocketContext";
import { checkRoomExists, joinRoom } from "../utils/socketEvents";
import TextInput from "../components/TextInput";
import { VStack, Heading, Box } from "@chakra-ui/react";
import { useEffect } from "react";
import { useToast } from "../contexts/ToastContext";

const JoinPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { socket } = useSocket();
  const { addToast } = useToast();

  useEffect(() => {
    const verifyRoom = async () => {
      if (!socket) return;
      try {
        const exists = await checkRoomExists(socket, roomId);
        if (!exists) {
          addToast(
            "Invalid room",
            "The room you're trying to join does not exist.",
            "error"
          );
          navigate("/");
        }
      } catch (e) {
        console.log(e);
        navigate("/");
      }
    };
    verifyRoom();
  }, [socket, roomId, navigate, addToast]);
  const onSuccess = () => {
    addToast(
      "Room joined successfully",
      "You have joined the room successfully.",
      "success"
    );
    navigate("/lobby");
  };
  const onError = (msg) => {
    addToast("Error joining room", msg, "error");
  };
  const handleCreate = (name) => {
    joinRoom(socket, roomId, name, onSuccess, onError);
  };

  return (
    <VStack spacing={6} justify="center" align="center" h="100vh" p={4}>
      <Heading size="2xl" color="teal.600">
        Emoji Relay
      </Heading>
      <Box w={{ base: "90%", sm: "400px" }} textAlign="center">
        <TextInput
          buttonText="Join Game"
          onSubmit={handleCreate}
          placeholderText={"Please enter a username"}
          errorTitle={"Username required"}
          errorDescription={"Please enter a username"}
        />
      </Box>
    </VStack>
  );
};

export default JoinPage;
