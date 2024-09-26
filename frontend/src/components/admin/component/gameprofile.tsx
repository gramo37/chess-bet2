import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BACKEND_URL } from "../../../constants/routes";
import { IoMdArrowBack } from "react-icons/io";
import Spinner from "../../spinner";

export default function GameProfile() {
  const { id } = useParams<{ id: string }>();
  const [game, setGame] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGame = async () => {
      const url = `${BACKEND_URL}/admin/game/${id}`;
      setIsLoading(true);
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure the token is passed
          },
        });
        if (!response.ok) {
          throw new Error("Game not found");
        }
        const data = await response.json();
        console.log(data);
        
        setGame(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGame();
  }, [id]);

  function onViewProfile(id: string): void {
    console.log(id);
    window.location.href = `/player/${id}`;
  }


  if (isLoading) return <Spinner/>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="max-w-4xl mx-auto mt-6  p-4 bg-white rounded-lg shadow-lg">
        <a className="absolute top-10 left-10 text-white" href="/dashboard">
        <IoMdArrowBack />
      </a>
    <h2 className="text-2xl font-semibold mb-6 text-gray-800">Game Report</h2>
    {game && (
      <div className="grid grid-cols-2 gap-6">
        <div className="col-span-2">
          <h3 className="text-xl font-semibold text-gray-700">Game Info</h3>

          <p className="mt-2 text-gray-600">
            <strong>Start Time:</strong> {new Date(game.startTime).toLocaleString()}
          </p>
          <p className="mt-2 text-gray-600">
            <strong>End Time:</strong> {game.endTime ? new Date(game.endTime).toLocaleString() : "In Progress"}
          </p>
          <p className="mt-2 text-gray-600">
            <strong>Status:</strong> {game.status}
          </p>
          <p className="mt-2 text-gray-600">
            <strong>Stake:</strong> ${game.stake}
          </p>
          <p className="mt-2 text-gray-600">
            <strong>Game Outcome:</strong> {game.gameOutCome}
          </p>
          <p className="mt-2 text-gray-600">
            <strong>Result:</strong> {game.result}
          </p>
          <p className="mt-2 text-gray-600">
            <strong>Board State:</strong>
            <div className="font-mono bg-gray-100 p-2 rounded-lg mt-1">{game.board}</div>
          </p>
        </div>
        <div className="col-span-1">
        <p className="font-semibold text-blue-500 cursor-pointer hover:underline" onClick={() => onViewProfile(game.blackPlayer.id)}>Black player : {game.blackPlayer.name}</p>
          
        </div>
        <div className="col-span-1">
        <p className="font-semibold text-blue-500 cursor-pointer hover:underline" onClick={() => onViewProfile(game.whitePlayer.id)}>White player : {game.whitePlayer.name}</p>
        </div>
        <div className="col-span-2">
          <h3 className="text-xl font-semibold text-gray-700">Moves Made</h3>
          <ul className="list-disc pl-5 mt-2 text-gray-600">
            {game.Move.map((move: any) => (
              <li key={move.id}>
                <strong>Move:</strong> {move.san} (from {move.from} to {move.to})
              </li>
            ))}
          </ul>
        </div>
      </div>
    )}
  </div>
  );
}
