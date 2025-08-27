import { useState } from "react";
import { VStack, SimpleGrid, Box, Button } from "@chakra-ui/react";
import Picker from "emoji-picker-react";

const EmojiPhase = () => {
  const [emojis, setEmojis] = useState([null, null, null, null]); // 4 slots
  const [pickerIndex, setPickerIndex] = useState(null);

  const handleEmojiClick = (emojiData) => {
    const newEmojis = [...emojis];
    newEmojis[pickerIndex] = emojiData.emoji;
    setEmojis(newEmojis);
    setPickerIndex(null); // close picker
  };

  return (
    <VStack spacing={6} justify="center" align="center" h="100vh" p={4}>
      <SimpleGrid columns={2} spacing={4}>
        {emojis.map((emoji, index) => (
          <Box
            key={index}
            w="80px"
            h="80px"
            bg="gray.700"
            borderRadius="md"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="2xl"
            cursor="pointer"
            onClick={() => setPickerIndex(index)}
          >
            {emoji || "?"}
          </Box>
        ))}
      </SimpleGrid>

      {/* Render emoji picker when a slot is clicked */}
      {pickerIndex !== null && <Picker onEmojiClick={handleEmojiClick} />}

      <Button
        colorScheme="teal"
        isDisabled={emojis.includes(null)}
        onClick={() => console.log("Submit emojis:", emojis)}
      >
        Submit
      </Button>
    </VStack>
  );
};

export default EmojiPhase;
