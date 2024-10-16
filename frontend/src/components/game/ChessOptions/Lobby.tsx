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
    setGameId(null);
    setStake(10);
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
        className={`w-full bg-yellow-700 text-gray-300 py-2 px-4 rounded hover:bg-yellow-600 focus:outline-none focus:bg-yellow-600 ${
          socket === null && "bg-gray-500"
        }`}
        onClick={getOpponents}
      >
        Find Opponents
      </button>

      <div className="w-full">
        {isPending && <p className="text-white">Fetching Opponents...</p>}
        {isError && <p className="text-white">Something went wrong</p>}
        {!isPending && opponents.length > 0 && (
          <div className="flex flex-col items-start w-full">
            <h3 className="text-white text-lg text-left mb-2">
              Select Your Opponent
            </h3>
            <div className="w-full">
              {opponents.map((opponent: any) => {
                return (
                  <div
                    key={opponent.id}
                    className="flex items-center justify-between p-4 border rounded-lg shadow-sm w-full my-2"
                  >
                    <div className="flex justify-center items-center w-full">
                      <input
                        type="radio"
                        className="form-checkbox h-5 w-5 cursor-pointer text-indigo-600 mr-3"
                        checked={opponent.gameId === gameId}
                        onChange={() => {
                          setGameId(opponent.gameId);
                          setStake(opponent.stake);
                        }}
                      />
                      <div className="flex justify-center items-center gap-3 w-full text-white">
                        <p className="font-medium">{opponent.player1.name}</p>
                        <p className="text-sm ">
                          Rating: {opponent.player1.rating}
                        </p>
                        <p className="text-sm ">Stake: ${opponent.stake}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {!isPending && !isError && isSuccess && opponents.length === 0 && (
          <p className="text-white">No Opponents</p>
        )}
      </div>
      {gameId && (
        <button
          disabled={socket === null}
          onClick={startGame}
          className={`w-full bg-yellow-700 text-gray-300 py-2 px-4 rounded hover:bg-yellow-600 focus:outline-none focus:bg-yellow-600 ${
            socket === null && "bg-gray-500"
          }`}
        >
          Play
        </button>
      )}
    </>
  );
};

export default Lobby;
