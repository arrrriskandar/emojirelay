import { useState } from "react";
import { VStack, Input, Button } from "@chakra-ui/react";
import { useToast } from "../contexts/ToastContext";
const TextInput = ({
  buttonText,
  onSubmit,
  placeholderText,
  errorTitle,
  errorDescription,
}) => {
  const [value, setValue] = useState("");
  const { addToast } = useToast();

  const handleSubmit = () => {
    if (!value.trim()) {
      addToast(errorTitle, errorDescription, "warning");
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
        placeholder={placeholderText}
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

export default TextInput;
