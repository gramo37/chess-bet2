import { useGameStore } from "../../../contexts/game.context";
import UserDetails from "./UserDetails";
import FriendlyMatch from "./FriendlyMatch";
import Lobby from "./Lobby";
import Random from "./Random";
import MainOptions from "./MainOptions";

const ChessOptions: React.FC = () => {
  const { isGameStarted, type } = useGameStore([
    "isGameStarted",
    "setIsGameStarted",
    "setResult",
    "socket",
    "setColor",
    "stake",
    "setStake",
    "type",
    "setType",
    "setGameId",
  ]);

  if (isGameStarted) return null;

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <UserDetails />
      <MainOptions />

      {/* Conditional rendering based on selected option */}
      {type === "friend" && <FriendlyMatch />}
      {type === "lobby" && <Lobby />}
      {type === "random" && <Random />}
    </div>
  );
};

export default ChessOptions;
