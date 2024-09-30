import React from "react";
import { GamesListProps } from "../schema";

export const GamesList: React.FC<GamesListProps> = ({ games }) => {
  
  function onViewProfile(id:string): void {
    console.log(id);
    
  window.location.href = `/game/${id}`    
  }

  return (
    <div className="space-y-6">
      {games.map((game) => (
        <div key={game.id} className="bg-gray-100 p-6 rounded-lg shadow-lg">
          <div className="flex justify-between">
            <div>
              <p className="text-lg font-bold">Game ID: {game.id}</p>
              <p>Status: {game.status}</p>
              <p>Outcome: {game.gameOutCome}</p>
              <p className="font-semibold cursor-pointer inline text-blue-500 hover:underline" onClick={() => onViewProfile(game.id)}>Game Report</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">
                Start Time: {new Date(game.startTime).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                End Time: {new Date(game.endTime).toLocaleString()}
              </p>
              <p>Result: {game.result}</p>
              <p>Stake: ${game.stake}</p>
              
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

