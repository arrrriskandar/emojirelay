import { createContext, useEffect, useState, useContext, useRef } from "react";
import { io } from "socket.io-client";
import getPlayerId from "../utils/getPlayerId";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const playerId = getPlayerId();

    const socketInstance = io("http://localhost:4000", {
      query: { playerId },
    });
    socketRef.current = socketInstance;
    setSocket(socketInstance);

    return () => socketInstance.disconnect();
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
