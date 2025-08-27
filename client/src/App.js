import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LobbyPage from "./pages/LobbyPage";
import GamePage from "./pages/GamePage";
import JoinPage from "./pages/JoinPage";
import { RoomProvider } from "./contexts/RoomContext";

const RoomRoutes = () => (
  <RoomProvider>
    <Routes>
      <Route path="/lobby" element={<LobbyPage />} />
      <Route path="/game" element={<GamePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </RoomProvider>
);

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/join/:roomId" element={<JoinPage />} />
      <Route path="/*" element={<RoomRoutes />} />
    </Routes>
  );
};

export default App;
