import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BACKEND_URL } from "../../../constants/routes";
import { IoMdArrowBack } from "react-icons/io";
import Spinner from "../../spinner";
import { Chessboard } from "react-chessboard";
import { MdEdit } from "react-icons/md";

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

  const EditGameResult = async () => {
    // Prompt user for new result
    const newResult = prompt("Enter new result (WHITE_WINS, BLACK_WINS, DRAW):");
    
    // Validate input
    if (!newResult || !["WHITE_WINS", "BLACK_WINS", "DRAW"].includes(newResult)) {
      alert("Invalid input. Please enter a valid result.");
      return;
    }

    if (newResult === game.result) {
      alert("The new result must be different from the current result.");
      return;
    }

    const url = `${BACKEND_URL}/admin/game/${id}/result`;
    try {
      const response = await fetch(url, {
        method: "PUT", 
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ result: newResult }),
      });

      if (!response.ok) {
        throw new Error("Failed to update game result");
      }

      const updatedGame = await response.json();

      console.log(updatedGame.game);
      
      alert("Game result updated successfully!");
       window.location.reload();
    } catch (err) {
      setError((err as Error).message);
    }
  };



  if (isLoading) return <Spinner />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="max-w-4xl relative mx-auto mt-6 p-4 bg-white rounded-lg shadow-lg">
  <a className="absolute top-10 left-10 text-white" href="/dashboard">
    <IoMdArrowBack />
  </a>
  <h2 className="text-2xl font-semibold mb-6 text-gray-800">Game Report</h2>
  {game && (
    <div>
      <h3 className="text-xl font-semibold text-gray-700">Game Info</h3>
      <div className="flex w-full justify-between">
        <div>
          <p className="mt-2 text-gray-600">
            <strong>Start Time:</strong> {new Date(game.startTime).toLocaleString()}
          </p>
          <p className="mt-2 text-gray-600">
            <strong>End Time:</strong> {game.endTime ? new Date(game.endTime).toLocaleString() : "In Progress"}
          </p>
          <p className="mt-2 text-gray-600">
            <strong>Status:</strong> {game.status}
          </p>
        </div>
        <div>
          <p className="mt-2 text-gray-600">
            <strong>Stake:</strong> ${game.stake}
          </p>
          <p className="mt-2 text-gray-600">
            <strong>Game Outcome:</strong> {game.gameOutCome}
          </p>
          <p className="mt-2 text-gray-600 flex gap-2 items-center">
            <strong>Result:</strong> {game.result}
      <div className="cursor-pointer" onClick={EditGameResult}> <MdEdit /></div>
          </p>
        </div>
      </div>
      <div className=" text-gray-600">
        
        <div className="font-mono bg-gray-100 p-2 rounded-lg my-3"><strong>Board State:</strong> {game.board}</div>
        <div className="flex justify-between">
          <div className="w-[60%]">
          <Chessboard position={game.board} arePiecesDraggable={false}/>
          </div>
          <div>
            <p className="font-semibold text-blue-500 inline cursor-pointer hover:underline" onClick={() => onViewProfile(game.blackPlayer.id)}>
              Black player: {game.blackPlayer.name}
            </p>
            <p className="font-semibold text-blue-500 inline cursor-pointer hover:underline" onClick={() => onViewProfile(game.whitePlayer.id)}>
              White player: {game.whitePlayer.name}
            </p>
            <h3 className="text-xl font-semibold text-gray-700">Moves Made</h3>
            <ul className="list-disc pl-5 mt-2 text-gray-600">
              {game.Move.map((move: any, index: number) => (
                <li key={move.id} className="text-black py-1">
                  {index % 2 === 0 ? (
                    <>
                      <strong>White Move:</strong> {move.san} (from {move.from} to {move.to})
                    </>
                  ) : (
                    <>
                      <strong>Black Move:</strong> {move.san} (from {move.from} to {move.to})
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )}
</div>
  );
}
