import { useNavigate } from "react-router-dom";
import { useSocket } from "../contexts/SocketContext";
import { createRoom } from "../utils/socketEvents";
import TextInput from "../components/TextInput";

const LandingPage = () => {
  const navigate = useNavigate();
  const socket = useSocket();

  const handleCreate = (name) => {
    createRoom(
      socket,
      name,
      ({ roomId }) => {
        navigate(`/lobby/${roomId}`, {
          state: { playerName: name, isCreator: true },
        });
      },
      (msg) => {
        alert("Error creating room: " + msg);
      }
    );
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

export default LandingPage;
