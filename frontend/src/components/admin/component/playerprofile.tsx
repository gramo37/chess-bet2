import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import Spinner from "../../spinner";
import bannedUser from "../fetch/banneduser";
import updateUser from "../fetch/updateuser";
import usePersonStore from "../../../contexts/auth";
import { useGetUser } from "../../../hooks/useGetUser";
import fetchPlayer from "../fetch/fetchplayer";

const PlayerProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [player, setPlayer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useGetUser(); // Fetch and set the user on component mount
  const user = usePersonStore((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        if (!id) throw new Error("Player not found");
        const playerData = await fetchPlayer(id);
        setPlayer(playerData);
      } catch (e: any) {
        setError(e.message || "Error loading player data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (isLoading) return <Spinner />;
  if (error) return <p className="text-xl text-center text-white">{error}</p>;
  if (!player)
    return <p className="text-center text-gray-500">Player not found</p>;

  const handleEdit = async (type: string) => {
    if (!id) return;
    if (type === "suspend" || type === "active") {
      await updateUser(type, id);
      return;
    }
    const amount = parseFloat(
      prompt(`Enter the amount to adjust ${type}:`) || ""
    );
    if (isNaN(amount) || amount < 0) {
      alert("Please enter a valid amount (0 or greater).");
      return;
    }
    await updateUser(type, id, amount);
  };

  const handleBanUser = () => {
    if (!id) return;

    const confirmation = prompt("Type 'YES' to confirm permanent ban.");
    if (confirmation !== "YES") return;

    const reason = prompt("Provide a reason for banning the user:");
    if (!reason) return;

    bannedUser(id, reason);
  };

  const handleViewGame = (gameId: string) => {
    window.location.href = `/game/${gameId}`;
  };

  return (
    <div className="bg-black w-full">
      <button
        className="text-gray-700 absolute top-6 left-6"
        onClick={() => navigate("/dashboard")}
        aria-label="Go back"
      >
        <IoMdArrowBack size={24} />
      </button>
      <div className="flex flex-col items-center p-8 min-h-screen w-full relative">
        <div className="bg-gray-50 p-6 rounded-lg shadow-lg w-full max-w-2xl">
          <h1 className="text-3xl font-bold mb-6 text-gray-800 capitalize">
            {player.name}'s Profile
          </h1>

          {user?.role === "ADMIN" && player.status !== "BANNED" && (
            <div className="flex gap-2 mb-4">
              <button
                className={`${
                  player.status === "ACTIVE" ? "bg-yellow-500" : "bg-green-500"
                } text-white rounded-lg px-3 py-1`}
                onClick={() =>
                  handleEdit(player.status === "ACTIVE" ? "suspend" : "active")
                }
              >
                {player.status === "ACTIVE" ? "Suspend" : "Activate"}
              </button>
              <button
                className="bg-red-500 text-white rounded-lg px-3 py-1"
                onClick={handleBanUser}
              >
                Ban
              </button>
            </div>
          )}

          <div className="flex flex-wrap justify-between text-lg">
            <div className="text-gray-600">
              <p>
                <span className="font-semibold text-gray-700">Email:</span>{" "}
                {player.email}
              </p>
              <p>
                <span className="font-semibold text-gray-700">Status:</span>{" "}
                {player.status}
              </p>
            </div>
            <div className="text-gray-600">
              <p>
                <span className="font-semibold text-gray-700">
                  Total Earnings:
                </span>{" "}
                {player.totalEarnings} $
              </p>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-gray-700">Balance:</span>
                <span className="text-green-600">
                  ${player.balance.toFixed(2)}
                </span>
                {user?.role === "ADMIN" && (
                  <MdEdit
                    className="cursor-pointer"
                    onClick={() => handleEdit("balance")}
                  />
                )}
              </div>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-gray-700">Rating:</span>
                <span className="text-indigo-600">{player.rating}</span>
                <MdEdit
                  className="cursor-pointer"
                  onClick={() => handleEdit("rating")}
                />
              </div>
            </div>
          </div>

          {/* Games Played */}
          <section className="mt-6">
            <h2 className="text-2xl font-semibold mb-3 text-indigo-600">
              Games Played
            </h2>
            {player.gamesAsWhite.length > 0 ||
            player.gamesAsBlack.length > 0 ? (
              <ul className="space-y-2">
                {[
                  ...player.gamesAsWhite.map((game: any) => ({
                    ...game,
                    color: "White",
                  })),
                  ...player.gamesAsBlack.map((game: any) => ({
                    ...game,
                    color: "Black",
                  })),
                ].map((game: any) => (
                  <li
                    key={game.id}
                    className="bg-gray-100 p-4 rounded-md shadow-sm flex justify-between"
                  >
                    <div>
                      <p className="text-gray-800 font-semibold">
                        Game ID: {game.id}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-semibold">Result:</span>{" "}
                        {game.result || "N/A"}
                      </p>
                      {user?.role === "ADMIN" && (
                        <p
                          className="text-blue-500 cursor-pointer"
                          onClick={() => handleViewGame(game.id)}
                        >
                          Game Report
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-gray-600">
                        <span className="font-semibold">Color:</span>{" "}
                        {game.color}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-semibold">Status:</span>{" "}
                        {game.status}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-semibold">Stake:</span>{" "}
                        {game.stake}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No games played.</p>
            )}
          </section>

          {/* Transactions */}
          <section className="mt-6">
            <h2 className="text-2xl font-semibold mb-3 text-indigo-600">
              Transactions
            </h2>
            {player.transactions.length > 0 ? (
              <ul className="space-y-2">
                {player.transactions.map((transaction: any) => (
                  <li
                    key={transaction.id}
                    className="bg-gray-100 p-4 rounded-md shadow-sm"
                  >
                    <p className="text-gray-800 font-semibold">
                      Transaction ID: {transaction.id}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Amount:</span>{" "}
                      {transaction.currency} {transaction.amount.toFixed(2)}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Status:</span>{" "}
                      {transaction.status}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No transactions available.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfile;
