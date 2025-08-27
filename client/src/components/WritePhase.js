import { Box, VStack, Heading } from "@chakra-ui/react";
import TextInput from "./TextInput";

const WritePhase = () => {
  const handleSubmit = (text) => {
    console.log("Submitted text:", text);
    // TODO: emit to backend later
  };

  return (
    <VStack spacing={6} justify="center" align="center" h="100vh" p={4}>
      <Heading size="2xl" color="teal.600">
        Write your word/phrase
      </Heading>
      <Box w={{ base: "90%", sm: "400px" }} textAlign="center">
        <TextInput
          buttonText="Submit"
          onSubmit={handleSubmit}
          placeholderText={"Please enter a word or phrase"}
          errorTitle={"Input is empty"}
          errorDescription={"Please enter a word or phrase"}
        />
      </Box>
    </VStack>
  );
};

export default WritePhase;
