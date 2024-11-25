import { useGameStore } from "../../../contexts/game.context";
import UserDetails from "./UserDetails";
import FriendlyMatch from "./FriendlyMatch";
import Lobby from "./Lobby";
import Random from "./Random";
import MainOptions from "./MainOptions";
import usePersonStore from "../../../contexts/auth";

const ChessOptions: React.FC = () => {
  const { isGameStarted, type } = useGameStore(["isGameStarted", "type"]);
  const { isVirtualAccount } = usePersonStore();

  if (isGameStarted) return null;

  return (
    <div className="flex flex-col justify-center items-center space-y-4  lg:p-8 rounded-lg w-[90%] m-auto">
      <UserDetails />
      <MainOptions />
      {/* Conditional rendering based on selected option */}
      {type === "friend" && <FriendlyMatch />}
      {type === "lobby" && !isVirtualAccount && <Lobby />}
      {type === "random" && <Random />}
    </div>
  );
};

export default ChessOptions;
