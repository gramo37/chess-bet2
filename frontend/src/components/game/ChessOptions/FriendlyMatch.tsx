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
    setGameTime
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
    "setGameTime"
  ]);

  const handleFriendlyOptionChange = (option: FriendlyOption) => {
    setFriendlyOption(option);
    setGameId(""); // Clear game code on changing option
  };

  const startGame = () => {
    if (!socket) return;
    setIsGameStarted(true);
    setResult(null);
    setColor(null);
    socket?.send(
      JSON.stringify({
        type: INIT_GAME,
      })
    );
  };

  return (
    <>
      <div className="flex flex-col items-center space-y-2 mt-4">
        <h3 className="text-white text-xl font-semibold">
          Friendly Match Options:
        </h3>
        <div>
          <button
            onClick={() => handleFriendlyOptionChange("Create Game")}
            className={`btn p-2 ${
              friendlyOption === "Create Game"
                ? "bg-green-500 text-white"
                : "bg-gray-200"
            }`}
          >
            Create Game
          </button>
          <button
            onClick={() => handleFriendlyOptionChange("Join Game")}
            className={`btn ml-2 p-2 ${
              friendlyOption === "Join Game"
                ? "bg-green-500 text-white"
                : "bg-gray-200"
            }`}
          >
            Join Game
          </button>
        </div>

        {friendlyOption === "Join Game" && (
          <div className="mt-4">
            <input
              type="text"
              value={gameId ?? ""}
              onChange={(e) => setGameId(e.target.value)}
              placeholder="Enter Game Code"
              className="border p-2 rounded"
            />
          </div>
        )}

        {friendlyOption === "Create Game" && (
          <div className="flex flex-col gap-2">
            <div>
              <label className="text-white mr-2">Enter Stake</label>
              <span className="bg-white p-[0.57rem] pr-0 text-black">$</span>
              <input
                type="number"
                className="p-2 outline-none pl-0"
                value={stake}
                onChange={(e) => setStake(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="text-white mr-2">Enter Time</label>
              <select
                name="currency"
                value={gameTime}
                onChange={(e) => setGameTime(Number(e.target.value))}
                className="px-4 py-2 rounded outline-none"
              >
                <option value={300}>5 min</option>
                <option value={600}>10 min</option>
              </select>
            </div>
          </div>
        )}
      </div>
      <button
        disabled={socket === null}
        onClick={startGame}
        className={`w-full bg-blue-700 text-gray-300 py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600 ${
          socket === null && "bg-gray-500"
        }`}
      >
        Play
      </button>
    </>
  );
};

export default FriendlyMatch;
