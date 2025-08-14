import redisClient from "./redisClient.js";
import { nanoid } from "nanoid";

const ROOM_PREFIX = "room:";

const generateUniqueRoomId = async () => {
  let id;
  do {
    id = nanoid(6); // or your preferred length
  } while (await redisClient.exists(ROOM_PREFIX + id));
  return id;
};

export const createRoom = async (playerId, creatorName) => {
  const roomId = await generateUniqueRoomId();

  const room = {
    id: roomId,
    creatorId: playerId,
    players: [{ id: playerId, name: creatorName }],
    gameStarted: false,
    messages: [],
  };

  await redisClient.set(ROOM_PREFIX + roomId, JSON.stringify(room));
  return room;
};

export const getRoom = async (roomId) => {
  const data = await redisClient.get(ROOM_PREFIX + roomId);
  return data ? JSON.parse(data) : null;
};

export const joinRoom = async (roomId, playerId, playerName) => {
  const room = await getRoom(roomId);
  if (!room) return null;
  if (room.gameStarted) throw new Error("Game already started");

  if (!room.players.find((p) => p.id === playerId)) {
    room.players.push({ id: playerId, name: playerName });
    await redisClient.set(ROOM_PREFIX + roomId, JSON.stringify(room));
  }
  return room;
};

export const leaveRoom = async (playerId) => {
  // Find the room where the player is in
  const keys = await redisClient.keys(ROOM_PREFIX + "*");

  for (const key of keys) {
    const data = await redisClient.get(key);
    if (!data) continue;
    const room = JSON.parse(data);

    const playerIndex = room.players.findIndex((p) => p.id === playerId);
    if (playerIndex !== -1) {
      room.players.splice(playerIndex, 1);

      // If creator left, assign new creator if players remain
      if (room.creatorId === playerId) {
        if (room.players.length > 0) {
          room.creatorId = room.players[0].id;
        } else {
          // No players left, delete room
          await redisClient.del(key);
          return null;
        }
      }

      if (room.players.length === 0) {
        await redisClient.del(key);
        return null;
      }

      await redisClient.set(key, JSON.stringify(room));
      return room;
    }
  }
  return null;
};

export const startGame = async (roomId, playerId) => {
  const room = await getRoom(roomId);
  if (!room) throw new Error("Room not found");
  if (room.creatorId !== playerId)
    throw new Error("Only creator can start the game");
  if (room.gameStarted) throw new Error("Game already started");

  room.gameStarted = true;
  await redisClient.set(ROOM_PREFIX + roomId, JSON.stringify(room));
  return room;
};

export const getMessages = async (roomId) => {
  const room = await getRoom(roomId);
  return room ? room.messages || [] : [];
};

export const addMessage = async (roomId, message) => {
  const room = await getRoom(roomId);
  if (!room) return null;
  room.messages = room.messages || [];
  const msgObj = { ...message, timestamp: Date.now() };
  room.messages.push(msgObj);
  await redisClient.set(ROOM_PREFIX + roomId, JSON.stringify(room));
  return msgObj;
};
