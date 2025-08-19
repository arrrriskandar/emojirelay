export const createRoom = (socket, playerName, onSuccess, onError) => {
  if (!socket) return;

  socket.emit("createRoom", { playerName });

  if (onSuccess) socket.once("roomCreated", onSuccess);
  if (onError) socket.once("error", onError);
};

export const getRoomByPlayerId = (socket, playerId, onSuccess, onError) => {
  if (!socket) return;

  socket.emit("getRoomByPlayerId", { playerId });

  if (onSuccess) socket.once("roomData", onSuccess);
  if (onError) socket.once("error", onError);
};

export const joinRoom = (socket, { roomId, playerName }) => {
  if (!socket) return;
  socket.emit("joinRoom", { roomId, playerName });
};

export const registerLobbyEvents = (
  socket,
  { onLobbyUpdate, onGameStarted }
) => {
  if (!socket) return;

  if (onLobbyUpdate) socket.on("lobbyUpdate", onLobbyUpdate);
  if (onGameStarted) socket.on("gameStarted", onGameStarted);
};

export const unregisterLobbyEvents = (socket) => {
  if (!socket) return;

  socket.off("lobbyUpdate");
  socket.off("gameStarted");
};

export const startGame = (socket, roomId) => {
  if (!socket) return;
  socket.emit("startGame", { roomId });
};

export const registerGameEvents = (socket, { onNewMessage, onChatHistory }) => {
  if (!socket) return;
  if (onNewMessage) socket.on("newMessage", onNewMessage);
  if (onChatHistory) socket.on("chatHistory", onChatHistory);
};

export const unregisterGameEvents = (socket) => {
  if (!socket) return;
  socket.off("newMessage");
  socket.off("chatHistory");
};

export const sendMessage = (socket, roomId, msgObj) => {
  if (!socket) return;
  socket.emit("sendMessage", { roomId, message: msgObj });
};
