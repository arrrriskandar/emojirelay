import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useSocket } from "../contexts/SocketContext";
import {
  registerGameEvents,
  unregisterGameEvents,
  sendMessage,
} from "../socket/events";
import { VStack, Box, Input, Button, Text } from "@chakra-ui/react";
import EmojiPicker from "emoji-picker-react";

const GamePage = () => {
  const { roomId } = useParams();
  const location = useLocation();
  const socket = useSocket();

  const playerName = location.state?.playerName || "";
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (!playerName) return;

    registerGameEvents(socket, {
      onNewMessage: (msg) => setMessages((prev) => [...prev, msg]),
      onChatHistory: (history) => setMessages(history),
    });

    return () => unregisterGameEvents(socket);
  }, [socket, playerName]);

  const handleSend = () => {
    if (!message.trim()) return;

    const msgObj = { playerName, content: message };
    sendMessage(socket, roomId, msgObj);
    setMessage("");
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") handleSend();
  };

  const handleEmojiClick = (emojiData, event) => {
    // emojiData.emoji contains the emoji character
    setMessage((prev) => prev + emojiData.emoji);
  };

  return (
    <VStack spacing={4} p={4} align="stretch">
      <Box
        border="1px solid gray"
        borderRadius="md"
        p={2}
        h="300px"
        overflowY="auto"
      >
        {messages.map((msg, i) => (
          <Text key={i}>
            <b>{msg.playerName}: </b>
            {msg.content}
          </Text>
        ))}
      </Box>

      <Box>
        <Input
          placeholder="Type your message or emoji..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleEnter}
        />
        <Button onClick={() => setShowPicker((prev) => !prev)} ml={2}>
          {showPicker ? "Close Picker" : "Emoji"}
        </Button>
        <Button onClick={handleSend} ml={2} colorScheme="blue">
          Send
        </Button>
      </Box>

      {showPicker && (
        <Box mt={2}>
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </Box>
      )}
    </VStack>
  );
};

export default GamePage;
