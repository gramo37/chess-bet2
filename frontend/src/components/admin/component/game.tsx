import React, { useState } from "react";
import { BACKEND_URL } from "../../../constants/routes";
// Define types for Game, Transaction, and Report
interface Player {
  id: string;
  name: string;
  email: string;
  emailVerified: string | null;
}

interface Game {
  id: string;
  areBalancesUpdated: boolean;
  blackPlayer: Player;
  blackPlayerId: string;
  board: string;
  endTime: string;
  gameOutCome: string;
  isFriendly: boolean;
  result: string;
  stake: string;
  startTime: string;
  status: string;
  whitePlayer: Player;
  whitePlayerId: string;
}


// GamesList Component
type GamesListProps = {
  games: Game[];
};

export const GamesList: React.FC<GamesListProps> = ({ games }) => {
  
  function onViewProfile(id:string): void {
    console.log(id);
    
  window.location.href = `/player/${id}`    
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
              <p>Result: {game.result}</p>
              <p>Stake: ${game.stake}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">
                Start Time: {new Date(game.startTime).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                End Time: {new Date(game.endTime).toLocaleString()}
              </p>

              <div className="mt-4 space-y-2">
                <div>
                  <p
                    className="font-semibold cursor-pointer text-blue-500 hover:underline"
                    onClick={() => onViewProfile(game.whitePlayer.id)}
                  >
                    White Player: {game.whitePlayer.name}
                  </p>
                </div>

                <div>
                  <p
                    className="font-semibold text-blue-500 cursor-pointer hover:underline"
                    onClick={() => onViewProfile(game.blackPlayer.id)}
                  >
                    Black Player: {game.blackPlayer.name}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

