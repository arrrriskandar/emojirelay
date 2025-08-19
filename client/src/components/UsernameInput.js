import { useState } from "react";
import { VStack, Input, Button, useToast } from "@chakra-ui/react";

const UsernameInput = ({ buttonText, onSubmit }) => {
  const [value, setValue] = useState("");
  const toast = useToast();

  const handleSubmit = () => {
    if (!value.trim()) {
      toast({
        title: "Username required",
        description: "Please enter a username",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    onSubmit(value.trim());
    setValue("");
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <VStack spacing={4} w="100%">
      <Input
        placeholder={"Please enter a username"}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleEnter}
        size="lg"
      />
      <Button colorScheme="teal" size="lg" w="100%" onClick={handleSubmit}>
        {buttonText}
      </Button>
    </VStack>
  );
};

export default UsernameInput;
