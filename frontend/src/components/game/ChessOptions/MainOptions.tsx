import usePersonStore from "../../../contexts/auth";
import { useGameStore } from "../../../contexts/game.context";

const MainOptions = () => {
  const { type, setType, setGameId } = useGameStore([
    "type",
    "setType",
    "setGameId",
  ]);
  const { isVirtualAccount } = usePersonStore();

  return (
    <div className="flex flex-col md:flex-row justify-around w-full gap-3 rounded-lg">
      <button
        onClick={() => setType("friend")}
        className={`py-2 px-4 rounded-lg w-full md:w-auto transition-colors duration-200 ${
          type === "friend"
            ? "bg-yellow-500 text-white"
            : "bg-gray-300 text-black hover:bg-gray-400"
        }`}
      >
        Friendly Match
      </button>
      <button
        onClick={() => {
          setType("random");
          setGameId("");
        }}
        className={`py-2 px-4 rounded-lg w-full md:w-auto transition-colors duration-200 ${
          type === "random"
            ? "bg-yellow-500 text-white"
            : "bg-gray-300 text-black hover:bg-gray-400"
        }`}
      >
        Play Random
      </button>
      {!isVirtualAccount && (
        <button
          onClick={() => {
            setType("lobby");
            setGameId("");
          }}
          className={`py-2 px-4 rounded-lg w-full md:w-auto transition-colors duration-200 ${
            type === "lobby"
              ? "bg-yellow-500 text-white"
              : "bg-gray-300 text-black hover:bg-gray-400"
          }`}
        >
          Choose Your Opponent
        </button>
      )}
    </div>
  );
};

export default MainOptions;
