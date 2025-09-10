import { Text } from "@chakra-ui/react";

const ReadyCounter = ({ readyCount, totalCount }) => {
  return (
    <Text>
      {readyCount}/{totalCount}
    </Text>
  );
};

export default ReadyCounter;
