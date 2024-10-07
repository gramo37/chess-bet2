import { useInitSocket, useSocketHandler } from "../hooks/useSocket";
import Moves from "../components/game/Moves";
import { useGameStore } from "../contexts/game.context";
import { formatTime } from "../types/utils/game";
import ChatContainer from "../components/game/chat";
import { useGameLogic } from "../hooks/useGameLogic";
import ChessOptions from "../components/game/ChessOptions";
import Results from "../components/game/Results";
import TimeLeft from "../components/game/TimeLeft";
import Board from "../components/game/Board";


export default function Game() {
  const { color, opponent, player } = useGameStore([
    "color",
    "opponent",
    "player",
  ]);
  useInitSocket();
  const {
    loading,
    setLoading,
    message,
    localGameId,
    player1timeLeft,
    player2timeLeft,
  } = useSocketHandler();
  useGameLogic();

  return (
    <div className="min-h-screen flex flex-col max-w-[90%] m-auto items-center justify-center bg-black p-0 sm:p-4">
      <div className="flex flex-col lg:flex-row bg-gray rounded-lg shadow-lg overflow-hidden w-full">
        <div className="w-full relative lg:w-1/2 p-4 lg:p-8 flex flex-col items-center">
        {localGameId && <p className="text-white self-start"><span className="font-bold">GAME ID </span>- {localGameId}</p>}
        <div className="flex justify-between w-full">
          <h2 className="text-xl font-bold text-gray-300">
            {opponent?.name ?? ""}
          </h2>
          <TimeLeft
            timeLeft={
              color === "white"
              ? formatTime(player2timeLeft)
              : formatTime(player1timeLeft)
            }
            />
            </div>
          <Board setLoading={setLoading} />
          
          <div className="flex justify-between w-full">
          <h2 className="text-xl font-bold text-gray-300">
            {player?.name ?? ""}
          </h2>
          <TimeLeft
            timeLeft={
              color === "white"
              ? formatTime(player1timeLeft)
              : formatTime(player2timeLeft)
            }
            />
            </div>
        </div>
        <div className="w-full lg:w-1/2 flex flex-col items-center">
          <Results loading={loading} />
          <div className="w-full">
            <ChessOptions />
            <Moves />
            <ChatContainer message={message} />
          </div>
        </div>
      </div>
    </div>
  );
}
