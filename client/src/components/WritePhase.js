import { Box, VStack, Heading, Text, Button } from "@chakra-ui/react";
import TextInput from "./TextInput";
import ReadyCounter from "./ReadyCounter";

const WritePhase = ({
  step,
  turn,
  totalCount,
  handleGameStateUpdate,
  isCreator,
  startNextStep,
}) => {
  const handleSubmit = (text) => {
    handleGameStateUpdate(text, 1, true);
  };

  const handleEdit = () => {
    handleGameStateUpdate(null, -1, false);
  };

  const handleContinue = () => {
    startNextStep();
  };

  return (
    <VStack spacing={6} justify="center" align="center" h="100vh" p={4}>
      <ReadyCounter readyCount={turn.readyCount} totalCount={totalCount} />
      <Heading size="2xl" color="teal.600">
        {step.ready ? "Submitted" : "Write your word/phrase"}
      </Heading>
      <Box w={{ base: "90%", sm: "400px" }} textAlign="center">
        {!step.ready ? (
          <TextInput
            buttonText="Submit"
            onSubmit={handleSubmit}
            placeholderText={"Please enter a word or phrase"}
            errorTitle={"Input is empty"}
            errorDescription={"Please enter a word or phrase"}
          />
        ) : (
          <VStack>
            <Text mb={2} fontStyle="italic">
              {step.value}
            </Text>
            <Button onClick={handleEdit} colorScheme="teal" size="sm">
              Edit
            </Button>
            {isCreator && turn.readyCount === totalCount && (
              <Button onClick={handleContinue} size="sm" colorScheme="green">
                Continue
              </Button>
            )}
          </VStack>
        )}
      </Box>
    </VStack>
  );
};

export default WritePhase;
