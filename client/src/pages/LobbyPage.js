import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../contexts/SocketContext";
import {
  registerLobbyEvents,
  unregisterLobbyEvents,
  startGame,
} from "../utils/socketEvents";
import { useRoom } from "../contexts/RoomContext";

const LobbyPage = () => {
  const navigate = useNavigate();
  const { socket, playerId } = useSocket();
  const { room, setRoom, playerName } = useRoom();

  useEffect(() => {
    registerLobbyEvents(socket, {
      onLobbyUpdate: (room) => {
        setRoom(room);
      },
      onGameStarted: () => {
        navigate("/game");
      },
    });

    return () => unregisterLobbyEvents(socket);
  }, [room, playerName, navigate, socket, setRoom]);

  const handleStartGame = () => {
    startGame(socket, room.id);
    navigate("/game");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      alert("Link copied!"); // optional feedback
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  if (!room) {
    return <p>Loading room...</p>; // or a spinner
  }
  const link = `${window.location.origin}/join/${room.id}`;
  return (
    <div style={{ padding: 20 }}>
      <h2>Room: {room.id}</h2>
      <h3>Players waiting:</h3>
      <ul>
        {room.players.map((p) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>

      {room.creatorId === playerId && !room.gameStarted && (
        <button onClick={handleStartGame}>Start Game</button>
      )}

      {room.gameStarted && <p>Game has started!</p>}
      <p>
        <span
          onClick={handleCopy}
          style={{
            color: "teal",
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          {link}
        </span>
      </p>
    </div>
  );
};

export default LobbyPage;
