import { Box, VStack, Heading } from "@chakra-ui/react";
import TextInput from "./TextInput";
import ReadyCounter from "./ReadyCounter";
import WaitingForOthers from "./WaitingForOthers";

const WritePhase = ({
  step,
  turn,
  totalCount,
  handleGameStateUpdate,
  isCreator,
  startNextStep,
  allReady,
}) => {
  const handleSubmit = (text) => {
    handleGameStateUpdate(text, 1, true);
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

export default WritePhase;
