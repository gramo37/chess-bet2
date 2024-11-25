import { useState } from "react";
import { useGameStore } from "../../../contexts/game.context";
import { INIT_GAME } from "../../../constants";

type FriendlyOption = "Create Game" | "Join Game";

const FriendlyMatch = () => {
  const [friendlyOption, setFriendlyOption] = useState<FriendlyOption | null>(
    null
  );
  const {
    setGameId,
    gameId,
    stake,
    setStake,
    socket,
    setIsGameStarted,
    setResult,
    setColor,
    gameTime,
    setGameTime,
  } = useGameStore([
    "setGameId",
    "gameId",
    "stake",
    "setStake",
    "socket",
    "setIsGameStarted",
    "setResult",
    "setColor",
    "gameTime",
    "setGameTime",
  ]);

  const handleFriendlyOptionChange = (option: FriendlyOption) => {
    setFriendlyOption(option);
    setGameId("");
  };

  const startGame = () => {
    if (!socket) return;
    setIsGameStarted(true);
    setResult(null);
    setColor(null);
    socket?.send(JSON.stringify({ type: INIT_GAME }));
  };

  return (
    <div className="flex flex-col items-center space-y-4  whitespace-nowrap rounded-lg w-full w-full shadow-lg">
      <h3 className="text-white text-xl font-semibold mb-1">
        Friendly Match Options:
      </h3>
      <div className="flex gap-4">
        <button
          onClick={() => handleFriendlyOptionChange("Create Game")}
          className={`py-2 px-3 rounded-lg transition-colors ${
            friendlyOption === "Create Game"
              ? "bg-green-600 text-white"
              : "bg-gray-300 text-black"
          }`}
        >
          Create Game
        </button>
        <button
          onClick={() => handleFriendlyOptionChange("Join Game")}
          className={`py-2 px-3 rounded-lg transition-colors ${
            friendlyOption === "Join Game"
              ? "bg-green-600 text-white"
              : "bg-gray-300 text-black"
          }`}
        >
          Join Game
        </button>
      </div>

      {friendlyOption === "Join Game" && (
        <input
          type="text"
          value={gameId ?? ""}
          onChange={(e) => setGameId(e.target.value)}
          placeholder="Enter Game Code"
          className="border border-gray-400 p-2 rounded w-full mt-3 text-black"
        />
      )}

      {friendlyOption === "Create Game" && (
        <div className="flex flex-col w-full  gap-3">
          <div className="flex items-center justify-between gap-4">
            <div className="w-[49%]">
              <label className="block text-white text-sm font-medium mb-1">
                Enter Stake
              </label>
              <div className="flex items-center border border-gray-500 rounded-lg overflow-hidden">
                <span className="bg-gray-200 px-3 py-2 text-black font-semibold border-r border-gray-400">
                  $
                </span>
                <input
                  type="number"
                  className="flex-1 p-2 text-black outline-none focus:ring-2 focus:ring-yellow-500"
                  value={stake}
                  onChange={(e) => setStake(Number(e.target.value))}
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="w-[49%]">
              <label className="block text-white text-sm font-medium mb-1">
                Select Game Time
              </label>
              <select
                value={gameTime}
                onChange={(e) => setGameTime(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-500 rounded-lg bg-gray-200 text-black focus:ring-2 focus:ring-yellow-500"
              >
                <option value={300}>5 min</option>
                <option value={600}>10 min</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <button
        disabled={!socket}
        onClick={startGame}
        className={`w-full mt-6 py-2 px-4 rounded-lg font-semibold text-white transition-all ${
          socket
            ? "bg-yellow-600 hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-400"
            : "bg-gray-500 cursor-not-allowed"
        }`}
      >
        Play
      </button>
    </div>
  );
};

export default FriendlyMatch;
