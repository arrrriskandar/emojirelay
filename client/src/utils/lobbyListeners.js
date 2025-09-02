export const createLobbyListeners = ({ setRoom, setPlayerName, addToast }) => ({
  onLobbyUpdate: (room) => setRoom(room),
  onGameStarted: (room) => {
    setRoom(room);
    addToast("Game started", "The game has begun. Good luck!", "info");
  },
  onRoomDeleted: (roomId) => {
    addToast(
      "Room deleted",
      `Room ${roomId} was deleted by the creator`,
      "info"
    );
    setRoom(null);
    setPlayerName("");
  },
  onRemovedFromRoom: (roomId) => {
    addToast(
      "Removed from room",
      `You were removed from room ${roomId}`,
      "info"
    );
    setRoom(null);
    setPlayerName("");
  },
  onNewRoundStart: (room) => {
    setRoom(room);
    addToast("New round started", "New round has begun. Good luck!", "info");
  },
});
