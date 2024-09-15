import { useInitSocket, useSocketHandler } from "../hooks/useSocket";
import Moves from "../components/game/Moves";
import { useGameStore } from "../contexts/game.context";
import { formatTime } from "../utils/game";
import ChatContainer from "../components/game/chat";
import { useGameLogic } from "../hooks/useGameLogic";
import ChessOptions from "../components/game/ChessOptions";
import Results from "../components/game/Results";
import TimeLeft from "../components/game/TimeLeft";
import Board from "../components/Board";

export default function Game() {
  const { isGameStarted, color } = useGameStore([
    "board",
    "isGameStarted",
    "color",
    "setBoard",
    "socket",
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-0 sm:p-4">
      <div className="flex flex-col lg:flex-row bg-gray-800 rounded-lg shadow-lg overflow-hidden w-full sm:w-[70%] lg:w-[85%] max-w-7xl">
        <div className="w-full lg:w-1/2 p-4 lg:p-8 flex flex-col items-center">
          <TimeLeft
            timeLeft={
              color === "white"
                ? formatTime(player2timeLeft)
                : formatTime(player1timeLeft)
            }
          />
          {localGameId && <p className="text-white">Game ID - {localGameId}</p>}
          <Board setLoading={setLoading}/>
          <TimeLeft
            timeLeft={
              color === "white"
                ? formatTime(player1timeLeft)
                : formatTime(player2timeLeft)
            }
          />
        </div>
        <div className="w-full lg:w-1/2 p-4 lg:p-8 flex flex-col items-center">
          <Results loading={loading} />
          <div>
            {!isGameStarted && <ChessOptions />}
            {isGameStarted && <ChatContainer message={message} />}
            {isGameStarted && <Moves />}
          </div>
        </div>
      </div>
    </div>
  );
}
