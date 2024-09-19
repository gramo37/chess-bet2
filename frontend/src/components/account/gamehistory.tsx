import React, { useState } from "react";
import usePersonStore from "../../contexts/auth";
import axios from "axios";
import { BACKEND_URL } from "../../constants/routes"; 

const GameHistory: React.FC = () => {
  const { user, games, setGames, setIsLoading, isLoading } = usePersonStore();
  const [error, setError] = useState<string | null>(null);

      
      const fetchGameHistory = async () => {
        if (!user || !user.token) return;
      setIsLoading(true);
      try {
        const response = await axios.get(`${BACKEND_URL}/game/transaction-history`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        console.log(response.data.games);
        setGames(response.data.games);
      } catch (error) {
        console.error("Failed to fetch game history:", error);
        setError("Failed to fetch game history")
      } finally {
        setIsLoading(false);
      }
    };


  if (isLoading) {
    return <div className="text-center py-6">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-6 text-red-500">{error}</div>;
  }


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="overflow-x-auto">
        {(games&&games.length>0)?
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase">Game ID</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase">White Player</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase">Black Player</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase">Status</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase">Result</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase">Start Time</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase">End Time</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase">Stake</th>
            </tr>
          </thead>
          <tbody>
            {games.map((game) => (
              <tr key={game.id} className="border-t">
                <td className="py-3 px-4 text-sm text-gray-600">{game.id}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{game.whitePlayer.name}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{game.blackPlayer.name}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{game.status}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{game.result || "N/A"}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{new Date(game.startTime).toLocaleString()}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{game.endTime ? new Date(game.endTime).toLocaleString() : "N/A"}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{game.stake}</td>
              </tr>
            ))}
          </tbody>
        </table>:((games&&games.length===0)?<div className="text-center text-gray-500">No games played yet.</div>:"")}
      </div>
              <button className="px-4 py-2 mt-4 bg-teal-500 text-white" onClick={fetchGameHistory}>Get Played Games</button>
    </div>
  );
};

export default GameHistory;
