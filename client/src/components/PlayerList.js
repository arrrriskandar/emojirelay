import { VStack, HStack, Text, Button } from "@chakra-ui/react";

const PlayerList = ({ players, creatorId, isCreator, onRemove, playerId }) => {
  return (
    <VStack align="start" w="100%">
      {players.map((player) => {
        const isRoomCreator = player.id === creatorId;
        const isYou = player.id === playerId;

        return (
          <HStack
            key={player.id}
            justify="space-between"
            w="100%"
            p={2}
            borderRadius="md"
            bg="gray.600"
          >
            <Text
              fontWeight={isYou ? "bold" : "normal"}
              color={isYou ? "teal.300" : "white"}
            >
              {isRoomCreator && (
                <Text as="span" ml={1}>
                  👑
                </Text>
              )}{" "}
              {player.name}
            </Text>

            {/* Show remove button only if *you* are the creator and not removing yourself */}
            {isCreator && !isRoomCreator && !isYou && (
              <Button
                size="xs"
                colorScheme="red"
                onClick={() => onRemove(player.id)}
              >
                Remove
              </Button>
            )}
          </HStack>
        );
      })}
    </VStack>
  );
};

export default PlayerList;
