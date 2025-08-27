import { useRoom } from "../contexts/RoomContext";
const GamePage = () => {
  const { room } = useRoom();
  if (!room) return <>Loading........</>;
  return <>{JSON.stringify(room)}</>;
};
export default GamePage;
