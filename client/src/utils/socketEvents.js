export const createRoom = (socket, playerName, onSuccess, onError) => {
  if (!socket) return;

  socket.emit("createRoom", { playerName });

  if (onSuccess) socket.once("roomCreated", onSuccess);
  if (onError) socket.once("error", onError);
};

export const joinRoom = (socket, roomId, playerName, onSuccess, onError) => {
  if (!socket) return;

  socket.emit("joinRoom", { roomId, playerName });

  if (onSuccess) socket.once("roomJoined", onSuccess);
  if (onError) socket.once("error", onError);
};

export const checkRoomExists = (socket, roomId) => {
  return new Promise((resolve) => {
    socket.emit("checkRoomExists", { roomId }, (exists) => resolve(exists));
  });
};

export const getRoomByPlayerId = (socket, onSuccess, onError) => {
  if (!socket) return;

  socket.emit("getRoomByPlayerId");

  if (onSuccess) socket.once("roomData", onSuccess);
  if (onError) socket.once("error", onError);
};

export const deleteRoom = (socket, roomId, onError) => {
  if (!socket) return;
  socket.emit("deleteRoom", { roomId });
  if (onError) socket.once("error", onError);
};

export const removeFromRoom = (socket, roomId, playerIdToRemove, onError) => {
  if (!socket) return;
  socket.emit("removeFromRoom", { roomId, playerIdToRemove });
  if (onError) socket.once("error", onError);
};

export const registerLobbyEvents = (
  socket,
  { onLobbyUpdate, onGameStarted, onRoomDeleted, onRemovedFromRoom }
) => {
  if (!socket) return;

  if (onLobbyUpdate) socket.on("lobbyUpdate", onLobbyUpdate);
  if (onGameStarted) socket.on("gameStarted", onGameStarted);
  if (onRoomDeleted) socket.on("roomDeleted", onRoomDeleted);
  if (onRemovedFromRoom) socket.on("removedFromRoom", onRemovedFromRoom);
};

export const unregisterLobbyEvents = (socket) => {
  if (!socket) return;

  socket.off("lobbyUpdate");
  socket.off("gameStarted");
  socket.off("roomDeleted");
  socket.off("removedFromRoom");
};

export const startGame = (socket, roomId, players, mode, onError) => {
  if (!socket) return;
  socket.emit("startGame", { roomId, mode, players });
  if (onError) socket.once("error", onError);
};

export const getGameState = (socket, currentRoundId, onSuccess, onError) => {
  if (!socket) return;

  socket.emit("getGameState", { currentRoundId });

  if (onSuccess) socket.once("gameState", onSuccess);
  if (onError) socket.once("error", onError);
};
