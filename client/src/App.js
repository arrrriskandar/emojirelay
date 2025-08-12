import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

const App = () => {
  const [playerName, setPlayerName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [joined, setJoined] = useState(false);
  const [roomData, setRoomData] = useState(null);
  const [entry, setEntry] = useState("");

  const joinRoom = () => {
    if (!roomId || !playerName) return alert("Enter name and room ID");
    socket.emit("joinRoom", { roomId, playerName });
    setJoined(true);
  };

  useEffect(() => {
    socket.on("roomUpdate", (data) => {
      setRoomData(data);
    });

    return () => socket.off("roomUpdate");
  }, []);

  const submitEntry = () => {
    if (!entry) return alert("Enter a word, guess, or emojis (e.g. 😀 😂)");
    socket.emit("submitEntry", {
      roomId,
      playerId: socket.id,
      entry,
    });
    setEntry("");
  };

  if (!joined)
    return (
      <div style={{ padding: 20 }}>
        <h2>Join or create a room</h2>
        <input
          placeholder="Your name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
        <input
          placeholder="Room ID (any string)"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <button onClick={joinRoom}>Join</button>
      </div>
    );

  return (
    <div style={{ padding: 20 }}>
      <h2>Room: {roomId}</h2>
      <div>
        <strong>Players:</strong>{" "}
        {roomData?.players.map((p) => p.name).join(", ") || "No players"}
      </div>
      <div>
        <strong>Game chain:</strong>
        <ul>
          {roomData?.chain.map((item, i) => (
            <li key={i}>
              <b>
                {roomData.players.find((p) => p.id === item.playerId)?.name}:
              </b>{" "}
              {Array.isArray(item.entry) ? item.entry.join(" ") : item.entry}
            </li>
          )) || "No entries yet"}
        </ul>
      </div>
      <div>
        <input
          placeholder="Word, guess, or emojis (e.g. 😀 😂 😍)"
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
        />
        <button onClick={submitEntry}>Submit</button>
      </div>
    </div>
  );
};

export default App;
