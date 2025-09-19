import { useState } from "react";
import { VStack, SimpleGrid, Box, Button, Heading } from "@chakra-ui/react";
import Picker from "emoji-picker-react";
import ReadyCounter from "./ReadyCounter";
import WaitingForOthers from "./WaitingForOthers";

const EmojiPhase = ({
  step,
  turn,
  totalCount,
  handleGameStateUpdate,
  isCreator,
  startNextStep,
  allReady,
}) => {
  const [emojis, setEmojis] = useState([null, null, null, null]); // 4 slots
  const [pickerIndex, setPickerIndex] = useState(null);

  const handleEmojiClick = (emojiData) => {
    const newEmojis = [...emojis];
    newEmojis[pickerIndex] = emojiData.emoji;
    setEmojis(newEmojis);
    setPickerIndex(null); // close picker
  };

  const handleSubmit = () => {
    handleGameStateUpdate(emojis, 1, true);
  };

  return (
    <VStack spacing={6} justify="center" align="center" h="100vh" p={4}>
      <ReadyCounter readyCount={turn.readyCount} totalCount={totalCount} />
      <Heading size="2xl" color="teal.600">
        {step.ready ? "Submitted" : step.previousValue}
      </Heading>

      <Box w={{ base: "90%", sm: "400px" }} textAlign="center">
        {!step.ready ? (
          <VStack>
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
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </VStack>
        ) : (
          <WaitingForOthers
            value={step.value}
            isCreator={isCreator}
            allReady={allReady}
            handleGameStateUpdate={handleGameStateUpdate}
            startNextStep={startNextStep}
          />
        )}
      </Box>
    </VStack>
  );
};

export default EmojiPhase;
