/* eslint-disable @typescript-eslint/no-explicit-any */

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
    gameId
  } = useGameStore([
    "setIsGameStarted",
    "setResult",
    "socket",
    "setColor",
    "stake",
    "setGameId",
    "gameId"
  ]);
  const [opponents, setOpponents] = useState([]);
  const user = usePersonStore((state) => state.user);
  const { isPending, isError, isSuccess, mutate } = useMutation({
    mutationFn: async () => {
      // TODO: Send token and stake
      const res = await axios.get(`${WS_BACKEND_URL}/open_games`, {
        params: {
          token: user?.token,
          stake,
        },
      });
      if (res && res?.data && res?.data?.games) setOpponents(res.data.games);
    },
  });
  const getOpponents = () => {
    // Make an API call to get all players matching current users rating, stake and type should not be friendly
    mutate();
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
      <button
        className={`w-full bg-blue-700 text-gray-300 py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600 ${
          socket === null && "bg-gray-500"
        }`}
        onClick={getOpponents}
      >
        Find Opponents
      </button>

      <div>
        {isPending && <p className="text-white">Fetching Opponents...</p>}
        {isError && <p className="text-white">Something went wrong</p>}
        {!isPending && opponents.length > 0 && (
          <div>
            {opponents.map((opponent: any) => {
              return (
                <div
                  key={opponent.gameId}
                  className="text-white border rounded-md p-1 border-white cursor-pointer m-1"
                  onClick={() => {
                    setGameId(opponent.gameId);
                  }}
                >
                  <p>Name: {opponent.player1.name}</p>
                  <p>Stake: ${opponent.stake}</p>
                  <p>Rating: {opponent.player1.rating}</p>
                </div>
              );
            })}
          </div>
        )}
        {!isPending && !isError && isSuccess && opponents.length === 0 && (
          <p className="text-white">No Opponents</p>
        )}
      </div>
      {gameId && <button
        disabled={socket === null}
        onClick={startGame}
        className={`w-full bg-blue-700 text-gray-300 py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600 ${
          socket === null && "bg-gray-500"
        }`}
      >
        Play
      </button>}
    </>
  );
};

export default Lobby;
