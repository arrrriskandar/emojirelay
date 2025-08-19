import ReactDOM from "react-dom/client";
import App from "./App";
import { SocketProvider } from "./contexts/SocketContext";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { RoomProvider } from "./contexts/RoomContext";

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ChakraProvider theme={theme}>
    <SocketProvider>
      <RoomProvider>
        <App />
      </RoomProvider>
    </SocketProvider>
  </ChakraProvider>
);
