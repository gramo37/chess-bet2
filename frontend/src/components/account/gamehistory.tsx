/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import usePersonStore from "../../contexts/auth";
import axios from "axios";
import { BACKEND_URL } from "../../constants/routes";
import { useQuery } from "@tanstack/react-query";

const GameHistory: React.FC = () => {
  const { user } = usePersonStore();

  const fetchGameHistory = async () => {
    if (!user || !user.token) return [];
    try {
      const response = await axios.get(
        `${BACKEND_URL}/game/transaction-history`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log(response.data.games);
      // setGames(response.data.games);
      return response.data.games;
    } catch (error) {
      console.error("Failed to fetch game history:", error);
    }
  };

  const { data:games, error, isLoading } = useQuery({
    queryKey: ["gamesHistory"],
    queryFn: fetchGameHistory,
  });

  if (error) {
    return <div className="text-center py-6 text-red-500">{error.message}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="overflow-x-auto">
        {games && games.length > 0 ? (
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase">
                  Game ID
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase">
                  White Player
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase">
                  Black Player
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase">
                  Status
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase">
                  Result
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase">
                  Start Time
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase">
                  End Time
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase">
                  Stake
                </th>
              </tr>
            </thead>
            {isLoading ? <p className="text-white">Loading...</p> : <tbody>
              {games.map((game: any) => (
                <tr key={game.id} className="border-t">
                  <td className="py-3 px-4 text-sm text-gray-600">{game.id}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {game.whitePlayer.name}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {game.blackPlayer.name}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {game.status}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {game.result || "N/A"}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {new Date(game.startTime).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {game.endTime
                      ? new Date(game.endTime).toLocaleString()
                      : "N/A"}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {game.stake}
                  </td>
                </tr>
              ))}
            </tbody>}
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
