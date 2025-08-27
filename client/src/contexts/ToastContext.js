// ToastProvider.jsx
import { createContext, useContext } from "react";
import { useToast as useChakraToast } from "@chakra-ui/react";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const chakraToast = useChakraToast();

  const addToast = (title, description = "", type = "info") => {
    chakraToast({
      title,
      description,
      status: type,
      duration: 3000,
      position: "top",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
