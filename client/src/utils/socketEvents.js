export const createRoom = (socket, playerName, onSuccess, onError) => {
  if (!socket) return;

  socket.emit("createRoom", { playerName });

  socket.once("roomCreated", onSuccess);
  socket.once("error", onError);
};

export const getRoom = (socket, roomId, onSuccess, onError) => {
  if (!socket) return;

  socket.emit("getRoom", { roomId });

  socket.once("roomData", onSuccess);
  socket.once("error", onError);
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

  socket.on("lobbyUpdate", onLobbyUpdate);
  socket.on("gameStarted", onGameStarted);
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
  socket.on("newMessage", onNewMessage);
  socket.on("chatHistory", onChatHistory);
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
