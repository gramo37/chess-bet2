import { INIT_GAME } from "../../../constants";
import { useGameStore } from "../../../contexts/game.context";

const Random = () => {
  const {
    setIsGameStarted,
    setResult,
    socket,
    setColor,
    stake,
    setStake
  } = useGameStore([
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
      <label className="text-white">Enter Stake</label>
      <input
        type="number"
        className="p-2"
        value={stake}
        onChange={(e) => setStake(Number(e.target.value))}
      />
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

export default Random;
