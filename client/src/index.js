import ReactDOM from "react-dom/client";
import App from "./App";
import { SocketProvider } from "./contexts/SocketContext";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { ToastProvider } from "./contexts/ToastContext";

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ChakraProvider theme={theme}>
    <BrowserRouter>
      <SocketProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </SocketProvider>
    </BrowserRouter>
  </ChakraProvider>
);
