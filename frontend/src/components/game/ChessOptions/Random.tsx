import { INIT_GAME } from "../../../constants";
import { useChatStore } from "../../../contexts/auth";
import { useGameStore } from "../../../contexts/game.context";

const Random = () => {
  const { setIsGameStarted, setResult, socket, setColor, stake, setStake } =
    useGameStore([
      "setIsGameStarted",
      "setResult",
      "socket",
      "setColor",
      "stake",
      "setStake",
    ]);
  useChatStore();

  const startGame = () => {
    if (!socket) return;
    setIsGameStarted(true);
    setResult(null);
    setColor(null);
    socket.send(
      JSON.stringify({
        type: INIT_GAME,
      })
    );
  };

  return (
    <div className=" w-full rounded-lg shadow-lg  mx-auto">
      <label className="block text-white text-sm font-medium mb-2">
        Enter Stake
      </label>
      <div className="flex items-center mb-6 border border-gray-500 rounded-lg overflow-hidden">
        <span className="bg-gray-300 px-3 py-2 text-black border-r border-gray-400 font-semibold">
          $
        </span>
        <input
          type="text"
          className="flex-1 p-2 text-black outline-none focus:ring-2 focus:ring-yellow-500"
          value={stake}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*\.?\d*$/.test(value)) {
              setStake(Number(value));
            }
          }}
        />
      </div>
      <button
        disabled={!socket}
        onClick={startGame}
        className={`w-full py-2 px-4 rounded-lg font-semibold transition-all duration-150
          ${
            socket
              ? "bg-yellow-700 text-gray-100 hover:bg-yellow-600 focus:bg-yellow-600 focus:ring-2 focus:ring-yellow-400"
              : "bg-gray-500 cursor-not-allowed text-gray-400"
          }`}
      >
        Play
      </button>
    </div>
  );
};

export default Random;
