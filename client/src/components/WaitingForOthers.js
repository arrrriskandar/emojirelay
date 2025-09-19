import { VStack, Text, Button } from "@chakra-ui/react";

const WaitingForOthers = ({
  value,
  isCreator,
  allReady,
  handleGameStateUpdate,
  startNextStep,
}) => {
  const handleEdit = () => {
    handleGameStateUpdate(null, -1, false);
  };

  const handleContinue = () => {
    startNextStep();
  };
  return (
    <VStack>
      <Text mb={2} fontStyle="italic">
        {value}
      </Text>
      <Button onClick={handleEdit} colorScheme="teal" size="sm">
        Edit
      </Button>
      {isCreator && allReady && (
        <Button onClick={handleContinue} size="sm" colorScheme="green">
          Continue
        </Button>
      )}
    </VStack>
  );
};

export default WaitingForOthers;
