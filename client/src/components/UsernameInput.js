import { useState } from "react";
import { VStack, Input, Button } from "@chakra-ui/react";
import { useToast } from "../contexts/ToastContext";
const UsernameInput = ({ buttonText, onSubmit }) => {
  const [value, setValue] = useState("");
  const { addToast } = useToast();

  const handleSubmit = () => {
    if (!value.trim()) {
      addToast("Username required", "Please enter a username", "warning");
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
