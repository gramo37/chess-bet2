import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../../constants/routes";
import { IoMdArrowBack } from "react-icons/io";
import Spinner from "../../spinner";
import { Chessboard } from "react-chessboard";
import { MdEdit } from "react-icons/md";

export default function GameProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [game, setGame] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGame = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${BACKEND_URL}/admin/game/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) throw new Error("Game not found");

        const data = await response.json();
        setGame(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGame();
  }, [id]);

  const handleProfileView = (playerId: string) => {
    navigate(`/player/${playerId}`);
  };

  const editGameResult = async () => {
    const newResult = prompt(
      "Enter new result (WHITE_WINS, BLACK_WINS, DRAW):"
    );
    if (
      !newResult ||
      !["WHITE_WINS", "BLACK_WINS", "DRAW"].includes(newResult)
    ) {
      alert("Invalid input. Please enter a valid result.");
      return;
    }

    if (newResult === game.result) {
      alert("The new result must be different from the current result.");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/admin/game/${id}/result`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ result: newResult }),
      });

      if (!response.ok) throw new Error("Failed to update game result");

      alert("Game result updated successfully!");
      window.location.reload();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  if (isLoading) return <Spinner />;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div className="bg-black min-h-screen py-6">
      <div className="container mx-auto max-w-2xl p-4 bg-white rounded-lg shadow-lg">
        <button
          className="text-gray-700 absolute top-6 left-6"
          onClick={() => navigate("/dashboard")}
          aria-label="Go back"
        >
          <IoMdArrowBack size={24} />
        </button>
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
          Game Report
        </h2>

        {game && (
          <div>
            <div className="flex flex-col lg:flex-row lg:justify-between">
              <div>
                <p className="text-gray-600">
                  <strong>Start Time:</strong>{" "}
                  {new Date(game.startTime).toLocaleString()}
                </p>
                <p className="text-gray-600">
                  <strong>End Time:</strong>{" "}
                  {game.endTime
                    ? new Date(game.endTime).toLocaleString()
                    : "In Progress"}
                </p>
                <p className="text-gray-600">
                  <strong>Status:</strong> {game.status}
                </p>
              </div>
              <div className="mt-4 lg:mt-0">
                <p className="text-gray-600">
                  <strong>Stake:</strong> ${game.stake}
                </p>
                <p className="text-gray-600">
                  <strong>Game Outcome:</strong> {game.gameOutCome}
                </p>
                <p className="flex items-center gap-2 text-gray-600">
                  <strong>Result:</strong> {game.result}
                  <MdEdit
                    className="cursor-pointer"
                    onClick={editGameResult}
                    title="Edit Game Result"
                  />
                </p>
              </div>
            </div>

            <div className="mt-6">
              <p className="font-mono bg-gray-100 p-2 break-words rounded-lg mb-4 text-gray-700">
                <strong>Board State:</strong> {game.board}
              </p>

              <div className="flex flex-col lg:flex-row gap-6">
                <div className="w-full lg:w-1/2">
                  <Chessboard
                    position={game.board}
                    arePiecesDraggable={false}
                  />
                </div>
                <div className="w-full lg:w-1/2">
                  <p
                    className="text-blue-500 font-semibold cursor-pointer hover:underline"
                    onClick={() => handleProfileView(game.blackPlayer.id)}
                  >
                    Black Player: {game.blackPlayer.name}
                  </p>
                  <p
                    className="text-blue-500 font-semibold cursor-pointer hover:underline"
                    onClick={() => handleProfileView(game.whitePlayer.id)}
                  >
                    White Player: {game.whitePlayer.name}
                  </p>
                  <h3 className="text-xl font-semibold text-gray-700 mt-4">
                    Moves Made
                  </h3>
                  <ul className="list-disc pl-5 mt-2 text-gray-600">
                    {game.Move.map((move: any, index: number) => (
                      <li key={move.id} className="py-1">
                        <strong>
                          {index % 2 === 0 ? "White Move:" : "Black Move:"}
                        </strong>{" "}
                        {move.san} (from {move.from} to {move.to})
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
