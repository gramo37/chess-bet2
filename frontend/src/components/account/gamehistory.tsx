/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import usePersonStore from "../../contexts/auth";
import axios from "axios";
import { BACKEND_URL } from "../../constants/routes";
import { useQuery } from "@tanstack/react-query";
import Game from "../../screens/Game";

const GameHistory: React.FC = () => {
  const { user } = usePersonStore();
  const [tooltip, setTooltip] = useState<{ id: string | null; visible: boolean }>()
 
  const fetchGameHistory = async () => {
    if (!user || !user.token) return [];
    try {
      const response = await axios.get(`${BACKEND_URL}/game/transaction-history`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      return response.data.games;
    } catch (error) {
      console.error("Failed to fetch game history:", error);
    }
  };

  const { data: games, error, isLoading } = useQuery({
    queryKey: ["gamesHistory"],
    queryFn: fetchGameHistory,
  });

  function getWinner(game: any) {
    if (!user || !user.id) return;
    if (game.result === "WHITE_WINS") {
      return game.whitePlayer.id === user.id ? "WON" : "LOST";
    } else if (game.result === "BLACK_WINS") {
      return game.blackPlayer.id === user.id ? "WON" : "LOST";
    } else {
      return "DRAW";
    }
  }

  const copyTransactionId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      setTooltip({ id, visible: true });
      setTimeout(() => setTooltip({ id: null, visible: false }), 2000); // Hide after 2 seconds
    } catch (err) {
      console.error("Failed to copy transaction ID:", err);
    }
  };


  if (error) {
    return <div className="text-center py-6 text-red-500">{error.message}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="overflow-x-auto">
        {games && games.length > 0 ? (
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
            <thead className="bg-yellow-500 text-white">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-medium uppercase">
                  Game ID
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium uppercase">
                  White Player
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium uppercase">
                  Black Player
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium uppercase">
                  Status
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium uppercase">
                  Result
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium uppercase">
                  Start Time
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium uppercase">
                  End Time
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium uppercase">
                  Stake
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : (
                games.map((game: any) => (
                  <tr key={game.id} className="border-t hover:bg-gray-50 transition duration-200 whitespace-nowrap">
                    <td 
                    className="py-3 px-4 text-sm text-gray-600 cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis relative" 
                    onClick={() => copyTransactionId(game.id)}
                    title={game.id} 
                  >
                    <span className="text-gray-400">Click to copy ID</span>
                    {tooltip&&tooltip.visible && tooltip.id === game.id && (
                      <span className="absolute left-1/2 transform -translate-x-1/3 bg-gray-800 text-white text-xs rounded py-1 px-2 mt-1">
                        Copied!
                      </span>
                    )}
                  </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {game.whitePlayer.name}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {game.blackPlayer.name}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700 capitalize">
                      {game.status.toLowerCase()}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {game.result.replace("_", " ")}
                      <span
                        className={
                          getWinner(game) === "WON"
                            ? "text-green-600 text-xs ml-2"
                            : getWinner(game) === "LOST"
                            ? "text-red-600 text-xs ml-2"
                            : "text-yellow-600 text-xs ml-2"
                        }
                      >
                        {`(${getWinner(game)})`}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {new Date(game.startTime).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {game.endTime ? new Date(game.endTime).toLocaleString() : "N/A"}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {game.stake}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : games && games.length === 0 ? (
          <div className="text-center text-gray-500">No games played yet.</div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default GameHistory;
