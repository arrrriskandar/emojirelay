import { createContext, useEffect, useState, useContext } from "react";
import { useSocket } from "./SocketContext";
import { getRoomByPlayerId } from "../utils/socketEvents";

export const RoomContext = createContext();

export const RoomProvider = ({ children }) => {
  const [room, setRoom] = useState(null);
  const { socket, playerId } = useSocket();
  const [playerName, setPlayerName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!socket || !playerId) return;

    const onSuccess = (roomData) => {
      setRoom(roomData);
      setPlayerName(
        roomData?.players.find((player) => player.id === playerId)?.name || ""
      );
      setLoading(false);
    };

    const onError = (msg) => {
      console.log(msg);
      setLoading(false);
    };

    getRoomByPlayerId(socket, onSuccess, onError);
  }, [playerId, socket, room]);

  return (
    <RoomContext.Provider
      value={{ room, setRoom, playerName, setPlayerName, loading }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = () => useContext(RoomContext);
