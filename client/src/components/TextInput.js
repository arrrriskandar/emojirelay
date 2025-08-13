import { Input } from "@chakra-ui/react";
import { useState } from "react";

const TextInput = ({ placeholder, onSubmit, autoFocus = true, message }) => {
  const [value, setValue] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (!value.trim()) return alert(message);
      else {
        onSubmit(value.trim());
        setValue("");
      }
    }
  };

  return (
    <Input
      placeholder={placeholder}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      autoFocus={autoFocus}
      variant="outline"
      size="lg"
      maxW="300px"
      borderRadius="xl"
      textAlign="center"
    />
  );
};

export default TextInput;
