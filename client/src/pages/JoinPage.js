import { useNavigate } from "react-router-dom";
import { useSocket } from "../contexts/SocketContext";
import { joinRoom, registerLobbyEvents } from "../utils/socketEvents";
import TextInput from "../components/TextInput";
import { useRoom } from "../contexts/RoomContext";
import { useParams } from "react-router-dom";

const JoinPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { socket } = useSocket();
  const { setPlayerName, setRoom } = useRoom();
  const handleCreate = (name) => {
    joinRoom(socket, { roomId, playerName: name });
    registerLobbyEvents(socket, {
      onLobbyUpdate: (room) => {
        setPlayerName(name);
        setRoom(room);
      },
      onGameStarted: () => {
        navigate("/");
        alert("Game has started!");
      },
    });
    navigate("/lobby");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Emoji Relay</h1>
      <TextInput
        placeholder={"Please enter a username"}
        onSubmit={handleCreate}
        message={"Enter a username"}
      />
    </div>
  );
};

export default JoinPage;
