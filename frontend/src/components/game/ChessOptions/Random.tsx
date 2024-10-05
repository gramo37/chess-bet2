import { INIT_GAME } from "../../../constants";
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
      <div className="flex items-center">
        <span className="bg-white p-[0.5rem] pr-0 text-black">$</span>
        <input
          type="number"
          className="p-2 outline-none pl-0"
          value={stake}
          onChange={(e) => setStake(Number(e.target.value))}
        />
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

export default Random;
