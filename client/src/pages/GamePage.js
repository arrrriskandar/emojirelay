import { useEffect, useState, useRef } from "react";
import { useSocket } from "../contexts/SocketContext";
import {
  registerGameEvents,
  unregisterGameEvents,
  sendMessage,
} from "../utils/socketEvents";
import { VStack, Box, Input, Button, Text } from "@chakra-ui/react";
import EmojiPicker from "emoji-picker-react";
import { useRoom } from "../contexts/RoomContext";

const GamePage = () => {
  const { room, playerName } = useRoom();
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Sync messages with room.messages when room updates
  useEffect(() => {
    if (room?.messages) {
      setMessages(room.messages);
    }
  }, [room]);

  // Register socket events
  useEffect(() => {
    if (!socket) return;

    registerGameEvents(socket, {
      onNewMessage: (msg) => setMessages((prev) => [...prev, msg]),
      onChatHistory: (history) => setMessages(history),
    });

    return () => unregisterGameEvents(socket);
  }, [socket]);

  const handleSend = () => {
    if (!message.trim() || !room) return;

    const msgObj = { playerName, content: message };
    sendMessage(socket, room.id, msgObj);
    setMessage("");
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") handleSend();
  };

  const handleEmojiClick = (emojiData, event) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  if (!room) return <p>Loading room...</p>;

  return (
    <VStack spacing={4} p={4} align="stretch">
      {/* Chat box */}
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
        <div ref={messagesEndRef} />
      </Box>

      {/* Input + emoji picker */}
      <Box display="flex" alignItems="center">
        <Input
          placeholder="Type your message or emoji..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleEnter}
        />
        <Button onClick={() => setShowPicker((prev) => !prev)} ml={2}>
          {showPicker ? "Close" : "Emoji"}
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
