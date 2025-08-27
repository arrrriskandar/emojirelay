export const createLobbyListeners = ({
  setRoom,
  setPlayerName,
  addToast,
  navigate,
}) => ({
  onLobbyUpdate: (updatedRoom) => setRoom(updatedRoom),
  onGameStarted: () => {
    addToast("Game started", "The game has begun. Good luck!", "info");
    navigate("/game");
  },
  onRoomDeleted: (roomId) => {
    addToast(
      "Room deleted",
      `Room ${roomId} was deleted by the creator`,
      "info"
    );
    setRoom(null);
    setPlayerName("");
    navigate("/");
  },
  onRemovedFromRoom: (roomId) => {
    console.log("HI");
    addToast(
      "Removed from room",
      `You were removed from room ${roomId}`,
      "info"
    );
    setRoom(null);
    setPlayerName("");
    navigate("/");
  },
});
