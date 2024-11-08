import { useState } from "react";
import { useGameStore } from "../../../contexts/game.context";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { WS_BACKEND_URL } from "../../../constants/routes";
import usePersonStore from "../../../contexts/auth";
import { INIT_GAME } from "../../../constants";

const Lobby = () => {
  const {
    setIsGameStarted,
    setResult,
    socket,
    setColor,
    stake,
    setGameId,
    gameId,
    setStake,
  } = useGameStore([
    "setIsGameStarted",
    "setResult",
    "socket",
    "setColor",
    "stake",
    "setGameId",
    "gameId",
    "setStake",
  ]);
  const [opponents, setOpponents] = useState([]);
  const { user, isVirtualAccount } = usePersonStore();

  const { isPending, isError, isSuccess, mutate } = useMutation({
    mutationFn: async () => {
      const res = await axios.get(`${WS_BACKEND_URL}/open_games`, {
        params: {
          token: user?.token,
          stake,
          isVirtual: isVirtualAccount,
        },
      });
      console.log(res.data);
      if (res && res?.data && res?.data?.games) setOpponents(res.data.games);
    },
  });

  const getOpponents = () => {
    setGameId(null);
    setStake(10);
    mutate();
  };

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
    <>
      <button
        onClick={getOpponents}
        className={`w-full py-2 px-4 rounded focus:outline-none mb-4
          ${
            socket
              ? "bg-yellow-700 hover:bg-yellow-600 focus:bg-yellow-600 text-gray-300"
              : "bg-gray-500 cursor-not-allowed text-gray-400"
          }`}
      >
        Find Opponents
      </button>

      <div className="w-full">
        {isPending && <p className="text-white">Fetching Opponents...</p>}
        {isError && <p className="text-white">Something went wrong</p>}
        {!isPending && opponents.length > 0 && (
          <div className="flex flex-col items-start w-full">
            <h3 className="text-white text-lg mb-2">Select Your Opponent</h3>
            <div className="w-full">
              {opponents.map((opponent: any) => (
                <div
                  key={opponent.id}
                  className="flex items-center justify-between p-4 border rounded-lg shadow-sm w-full mb-2"
                >
                  <div className="flex items-center w-full">
                    <input
                      type="radio"
                      className="form-checkbox h-5 w-5 text-indigo-600 mr-3 cursor-pointer"
                      checked={opponent.gameId === gameId}
                      onChange={() => {
                        setGameId(opponent.gameId);
                        setStake(opponent.stake);
                      }}
                    />
                    <div className="text-white flex-1">
                      <p className="font-medium">{opponent.player1.name}</p>
                      <p className="text-sm">
                        Rating: {opponent.player1.rating}
                      </p>
                      <p className="text-sm">Stake: ${opponent.stake}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {!isPending && !isError && isSuccess && opponents.length === 0 && (
          <p className="text-white">No Opponents</p>
        )}
      </div>
      {gameId && (
        <button
          onClick={startGame}
          className={`w-full py-2 px-4 rounded focus:outline-none mt-4
            ${
              socket
                ? "bg-yellow-700 hover:bg-yellow-600 focus:bg-yellow-600 text-gray-300"
                : "bg-gray-500 cursor-not-allowed text-gray-400"
            }`}
          disabled={!socket}
        >
          Play
        </button>
      )}
    </>
  );
};

export default Lobby;
