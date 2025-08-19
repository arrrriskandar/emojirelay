import { createContext, useEffect, useState, useContext } from "react";
import { useSocket } from "./SocketContext";
import { getRoomByPlayerId } from "../utils/socketEvents";

export const RoomContext = createContext();

export const RoomProvider = ({ children }) => {
  const [room, setRoom] = useState(null);
  const { socket, playerId } = useSocket();
  const [playerName, setPlayerName] = useState("");

  useEffect(() => {
    if (!socket || !playerId) return;

    getRoomByPlayerId(socket, playerId, (roomData) => {
      setRoom(roomData);
      setPlayerName(
        roomData.players.find((player) => player.id === playerId)?.name || ""
      );
    });
  });

  return (
    <RoomContext.Provider value={{ room, setRoom, playerName, setPlayerName }}>
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = () => useContext(RoomContext);
