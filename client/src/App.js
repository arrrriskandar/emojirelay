import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import EmojiPicker from "emoji-picker-react";

const socket = io("http://localhost:4000");

const App = () => {
  const [playerName, setPlayerName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [joined, setJoined] = useState(false);
  const [roomData, setRoomData] = useState(null);
  const [emojiInput, setEmojiInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [textInput, setTextInput] = useState("");

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

  const onEmojiClick = (emojiData) => {
    if (emojiInput.length + emojiData.emoji.length <= 16) {
      // Approx 4 emojis max (roughly 4 x 4 chars max)
      setEmojiInput((prev) => prev + emojiData.emoji);
    }
  };

  const submitEntry = () => {
    const entry = emojiInput.trim() || textInput.trim();
    if (!entry) return alert("Enter a word, guess, or emojis");

    socket.emit("submitEntry", {
      roomId,
      playerId: socket.id,
      entry,
    });
    setEmojiInput("");
    setTextInput("");
    setShowEmojiPicker(false);
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
              {item.entry}
            </li>
          )) || "No entries yet"}
        </ul>
      </div>
      <div>
        <button onClick={() => setShowEmojiPicker((v) => !v)}>
          {showEmojiPicker ? "Close Emoji Picker" : "Open Emoji Picker"}
        </button>
        {showEmojiPicker && <EmojiPicker onEmojiClick={onEmojiClick} />}
      </div>
      <div>
        <input
          placeholder="Or type word/guess"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          disabled={emojiInput.length > 0}
        />
      </div>
      <div>
        <input
          readOnly
          placeholder="Emoji input (max 4)"
          value={emojiInput}
          onClick={() => setShowEmojiPicker(true)}
        />
      </div>
      <button onClick={submitEntry}>Submit</button>
    </div>
  );
};

export default App;
