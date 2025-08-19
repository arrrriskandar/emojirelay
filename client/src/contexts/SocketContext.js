import { createContext, useEffect, useState, useContext, useRef } from "react";
import { io } from "socket.io-client";
import getPlayerId from "../utils/getPlayerId";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const playerId = getPlayerId();

  useEffect(() => {
    if (!playerId) return;
    const socketInstance = io("http://localhost:4000", {
      query: { playerId },
    });
    socketRef.current = socketInstance;
    setSocket(socketInstance);

    return () => socketInstance.disconnect();
  }, [playerId]);

  return (
    <SocketContext.Provider value={{ socket, playerId }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
