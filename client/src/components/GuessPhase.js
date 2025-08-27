import { Box, VStack, SimpleGrid, Text } from "@chakra-ui/react";
import TextInput from "./TextInput";

const GuessPhase = () => {
  const emojis = ["🍎", "🐱", "🚀", "🎩"];
  const handleSubmit = (text) => {
    console.log("Submitted guess:", text);
    // TODO: emit to backend later
  };

  return (
    <VStack spacing={6} justify="center" align="center" h="100vh" p={4}>
      <SimpleGrid columns={2} spacing={4}>
        {emojis.map((emoji, index) => (
          <Text key={index}>{emoji}</Text>
        ))}
      </SimpleGrid>
      <Box w={{ base: "90%", sm: "400px" }} textAlign="center">
        <TextInput
          buttonText="Submit"
          onSubmit={handleSubmit}
          placeholderText={"Please enter your guess"}
          errorTitle={"Guess cannot be empty"}
          errorDescription={"Please enter a word or phrase"}
        />
      </Box>
    </VStack>
  );
};

export default GuessPhase;
