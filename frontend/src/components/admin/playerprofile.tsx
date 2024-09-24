import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BACKEND_URL } from '../../constants/routes';
import { IoMdArrowBack } from 'react-icons/io';
import Spinner from '../spinner';

type Game = {
    id: string;
    status: string;
    result: string | null;
  };
  
  type Transaction = {
    id: string;
    amount: number;
    status: string;
  };
  
  type Player = {
    id: string;
    name: string;
    email: string;
    balance: number;
    rating: number;
    gamesAsWhite: Game[];
    gamesAsBlack: Game[];
    transactions: Transaction[];
  };
  


const PlayerProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [player, setPlayer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log(id);
    
    const fetchPlayer = async () => {
const url = `${BACKEND_URL}/admin/users/${id}`
        setIsLoading(true);
      try {
        const response = await fetch(url,{
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`, // Ensure the token is passed
            }});
        if (!response.ok) {
          throw new Error('Player not found');
        }
        const data = await response.json();
        console.log(data);
        
        setPlayer(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchPlayer();
    }
  }, [id]);

  if (isLoading) {
    return <Spinner/>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!player) {
    return <p>Player not found</p>;
  }

  return (
    <div className="flex flex-col items-center p-8 min-h-screen">
        <a className="absolute top-10 left-10 text-white" href="/dashboard">
        <IoMdArrowBack />
      </a>
    <div className="p-6 bg-gray-50 rounded-lg shadow-lg w-full max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        {player.name}'s Profile
      </h1>

      <p className="text-gray-600 text-lg mb-4">
        <span className="font-semibold text-gray-700">Email:</span> {player.email}
      </p>
      <p className="text-gray-600 text-lg mb-4">
        <span className="font-semibold text-gray-700">Balance:</span> <span className="text-green-600">${player.balance.toFixed(2)}</span>
      </p>
      <p className="text-gray-600 text-lg mb-4">
        <span className="font-semibold text-gray-700">Rating:</span> <span className="text-indigo-600">{player.rating}</span>
      </p>

      {/* Games as White */}
      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-3 text-indigo-600">Games as White</h2>
        {player.gamesAsWhite.length > 0 ? (
          <ul className="space-y-2">
            {player.gamesAsWhite.map((game: any) => (
              <li key={game.id} className="bg-gray-100 p-4 rounded-md shadow-sm">
                <p className="text-gray-800">
                  <span className="font-semibold">Game ID:</span> {game.id}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Status:</span> {game.status}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Result:</span> {game.result || "N/A"}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">No games as White player.</p>
        )}
      </div>

      {/* Games as Black */}
      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-3 text-indigo-600">Games as Black</h2>
        {player.gamesAsBlack.length > 0 ? (
          <ul className="space-y-2">
            {player.gamesAsBlack.map((game: any) => (
              <li key={game.id} className="bg-gray-100 p-4 rounded-md shadow-sm">
                <p className="text-gray-800">
                  <span className="font-semibold">Game ID:</span> {game.id}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Status:</span> {game.status}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Result:</span> {game.result || "N/A"}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">No games as Black player.</p>
        )}
      </div>

      {/* Transactions */}
      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-3 text-indigo-600">Transactions</h2>
        {player.transactions.length > 0 ? (
          <ul className="space-y-2">
            {player.transactions.map((transaction: any) => (
              <li key={transaction.id} className="bg-gray-100 p-4 rounded-md shadow-sm">
                <p className="text-gray-800">
                  <span className="font-semibold">Transaction ID:</span> {transaction.id}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Amount:</span> ${transaction.amount.toFixed(2)}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Status:</span> {transaction.status}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">No transactions available.</p>
        )}
      </div>
    </div>
  </div>
  );
};

export default PlayerProfile;
