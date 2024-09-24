/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { useGameStore } from "../../contexts/game.context";
import usePersonStore from "../../contexts/auth";
import { useMutation } from "@tanstack/react-query";
import { WS_BACKEND_URL } from "../../constants/routes";
import axios from "axios";
import { INIT_GAME } from "../../constants";

type FriendlyOption = "Create Game" | "Join Game";

const ChessOptions: React.FC = () => {
  const [friendlyOption, setFriendlyOption] = useState<FriendlyOption | null>(
    null
  );
  const {
    isGameStarted,
    setIsGameStarted,
    setResult,
    socket,
    setColor,
    stake,
    setStake,
    type,
    setType,
    setGameId,
    gameId,
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
    "gameId",
  ]);
  const user = usePersonStore((state) => state.user);
  const [opponents, setOpponents] = useState([]);
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

  const getOpponents = () => {
    // Make an API call to get all players matching current users rating, stake and type should not be friendly
    mutate();
  };

  if (isGameStarted) return null;

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <h2 className="text-white text-2xl font-bold">
        Choose how to play chess:
      </h2>
      <h2 className="text-white text-xl font-bold">
        Balance: {user?.balance ?? 0} $
      </h2>
      <h2 className="text-white text-lg font-bold mb-4">
        Your Rating: {user?.rating ?? 0}
      </h2>
      {/* Main options */}
      <div className="space-y-2">
        <button
          onClick={() => setType("friend")}
          className={`btn m-2 p-2 ${
            type === "friend" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Friendly Match
        </button>
        <button
          onClick={() => {
            setType("random");
            setGameId("");
          }}
          className={`btn m-2 p-2 ${
            type === "random" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Play Random
        </button>
        <button
          onClick={() => {
            setType("lobby");
            setGameId("");
          }}
          className={`btn m-2 p-2 ${
            type === "lobby" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Choose your opponent
        </button>
      </div>

      {/* Conditional rendering based on selected option */}
      {type === "friend" && (
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
        </div>
      )}
      <div className="flex gap-2 justify-center items-center">
        {type !== "lobby" && (
          <>
            <label className="text-white">Enter Stake</label>
            <input
              type="number"
              className="p-2"
              value={stake}
              onChange={(e) => setStake(Number(e.target.value))}
            />
          </>
        )}
        {type === "lobby" && (
          <button
            className={`w-full bg-blue-700 text-gray-300 py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600 ${
              socket === null && "bg-gray-500"
            }`}
            onClick={getOpponents}
          >
            Find Opponents
          </button>
        )}
      </div>
      {type === "lobby" && (
        <div>
          {isPending && <p>Fetching Opponents...</p>}
          {isError && <p>Something went wrong</p>}
          {opponents.length > 0 && (
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
                    <p>Stake: {opponent.stake}</p>
                  </div>
                );
              })}
            </div>
          )}
          {!isPending && !isError && isSuccess && opponents.length === 0 && (
            <p className="text-white">No Opponents</p>
          )}
        </div>
      )}
      {type !== "lobby" && (
        <button
          disabled={socket === null}
          onClick={startGame}
          className={`w-full bg-blue-700 text-gray-300 py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600 ${
            socket === null && "bg-gray-500"
          }`}
        >
          Play
        </button>
      )}
      {type === "lobby" && gameId && (
        <button
          disabled={socket === null}
          onClick={startGame}
          className={`w-full bg-blue-700 text-gray-300 py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600 ${
            socket === null && "bg-gray-500"
          }`}
        >
          Play
        </button>
      )}
      <a
        onClick={() => {
          localStorage.setItem("token", "");
          window.location.href = "/game";
        }}
        className="w-full bg-gray-700 text-gray-300 py-2 px-4 rounded mt-4 hover:bg-gray-600 focus:outline-none focus:bg-gray-600 text-center"
      >
        Logout
      </a>
    </div>
  );
};

export default ChessOptions;
