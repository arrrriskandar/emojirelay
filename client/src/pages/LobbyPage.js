import { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useSocket } from "../contexts/SocketContext";
import TextInput from "../components/TextInput";
import {
  joinRoom,
  registerLobbyEvents,
  unregisterLobbyEvents,
  startGame,
} from "../utils/socketEvents";

const Lobby = () => {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const socket = useSocket();

  const initialName = location.state?.playerName || "";
  const isCreator = location.state?.isCreator || false;

  const [playerName, setPlayerName] = useState(initialName);
  const [players, setPlayers] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [askName, setAskName] = useState(!initialName);

  useEffect(() => {
    if (!playerName) return; // Wait until name is set

    joinRoom(socket, { roomId, playerName });

    registerLobbyEvents(socket, {
      onLobbyUpdate: ({ players, gameStarted }) => {
        setPlayers(players);
        setGameStarted(gameStarted);
      },
      onGameStarted: () => {
        navigate(`/game/${roomId}`, { state: { playerName } });
      },
    });

    return () => unregisterLobbyEvents(socket);
  }, [roomId, playerName, navigate, socket]);

  const handleStartGame = () => {
    startGame(socket, roomId);
  };

  const handleNameSubmit = (name) => {
    setAskName(false); // Hide modal
    setPlayerName(name);
  };

  return (
    <div style={{ padding: 20 }}>
      {askName && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
          }}
        >
          <TextInput
            placeholder={"Please enter a username"}
            onSubmit={handleNameSubmit}
            message={"Enter a username"}
          />
        </div>
      )}

      <h2>Room: {roomId}</h2>
      <h3>Players waiting:</h3>
      <ul>
        {players.map((p) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>

      {isCreator && !gameStarted && (
        <button onClick={handleStartGame}>Start Game</button>
      )}

      {gameStarted && <p>Game has started!</p>}

      <p>
        Share this link to invite others:{" "}
        <a href={`${window.location.origin}/lobby/${roomId}`}>
          {window.location.origin}/lobby/{roomId}
        </a>
      </p>
    </div>
  );
};

export default Lobby;
