import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BACKEND_URL } from "../../../constants/routes";
import { IoMdArrowBack } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import Spinner from "../../spinner";
import { updateUser } from "../fetch";

// type Game = {
//     id: string;
//     status: string;
//     result: string | null;
//   };

// type Transaction = {
//   id: string;
//   amount: number;
//   status: string;
// };

// type Player = {
//   id: string;
//   name: string;
//   email: string;
//   balance: number;
//   rating: number;
//   status:string;
//   gamesAsWhite: Game[];
//   gamesAsBlack: Game[];
//   transactions: Transaction[];
// };

const PlayerProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [player, setPlayer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log(id);

    const fetchPlayer = async () => {
      const url = `${BACKEND_URL}/admin/users/${id}`;
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
          throw new Error("Player not found");
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
    return <Spinner />;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!player) {
    return <p>Player not found</p>;
  }

  async function Edit(type: string) {
    if (!id) return;
    if (type === "suspend" || type === "active") {
      updateUser(type, id);
      return;
    }
    const a = Number(prompt(`Enter the amount you want to change ${type}:`));
    if (isNaN(a) || a < 0) {
      alert("Please enter a valid amount that is zero or greater.");
    } else {
      console.log(`You entered: ${a}`);
    }
    updateUser(type, id, a);
  }

  return (
    <div className="flex flex-col w-full items-center p-8 min-h-screen">
      <a className="absolute top-10 left-10 text-white" href="/dashboard">
        <IoMdArrowBack />
      </a>
      <div className="p-6 bg-gray-50 rounded-lg shadow-lg w-full max-w-2xl">
        <div className="">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            {player.name}'s Profile
          </h1>

          <div>
            {player.status === "ACTIVE" && (
              <button
                className="bg-yellow-500 rounded-lg text-white px-3 py-1 m-2"
                onClick={() => Edit("suspend")}
              >
                Suspended
              </button>
            )}
            {player.status !== "ACTIVE" && (
              <button
                className="bg-green-500 rounded-lg text-white px-3 py-1 m-2"
                onClick={() => Edit("active")}
              >
                ACTIVATE
              </button>
            )}
            <button className="bg-red-500 px-3 rounded-lg text-white py-1 m-2">
              Delete
            </button>
          </div>
        </div>

        <p className="text-gray-600 text-lg mb-4">
          <span className="font-semibold text-gray-700">Email:</span>{" "}
          {player.email}
        </p>
        <p className="flex gap-1 cursor-pointer items-center text-gray-600 text-lg mb-4">
          <span className="font-semibold text-gray-700">Balance:</span>{" "}
          <span className="text-green-600">${player.balance.toFixed(2)}</span>
          <div onClick={() => Edit("balance")}>
            <MdEdit />
          </div>
        </p>
        <p className="flex gap-1 items-center cursor-pointer text-gray-600 text-lg mb-4">
          <span className="font-semibold text-gray-700">Rating:</span>{" "}
          <span className="text-indigo-600">{player.rating}</span>
          <div onClick={() => Edit("rating")}>
            <MdEdit />
          </div>
        </p>

        {/* Games as White */}
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-3 text-indigo-600">
            Games as White
          </h2>
          {player.gamesAsWhite.length > 0 ? (
            <ul className="space-y-2">
              {player.gamesAsWhite.map((game: any) => (
                <li
                  key={game.id}
                  className="bg-gray-100 p-4 rounded-md shadow-sm"
                >
                  <p className="text-gray-800">
                    <span className="font-semibold">Game ID:</span> {game.id}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Status:</span> {game.status}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Result:</span>{" "}
                    {game.result || "N/A"}
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
          <h2 className="text-2xl font-semibold mb-3 text-indigo-600">
            Games as Black
          </h2>
          {player.gamesAsBlack.length > 0 ? (
            <ul className="space-y-2">
              {player.gamesAsBlack.map((game: any) => (
                <li
                  key={game.id}
                  className="bg-gray-100 p-4 rounded-md shadow-sm"
                >
                  <p className="text-gray-800">
                    <span className="font-semibold">Game ID:</span> {game.id}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Status:</span> {game.status}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Result:</span>{" "}
                    {game.result || "N/A"}
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
                  <p className="text-gray-800">
                    <span className="font-semibold">Transaction ID:</span>{" "}
                    {transaction.id}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Amount:</span> $
                    {transaction.amount.toFixed(2)}
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
        </div>
      </div>
    </div>
  );
};

export default PlayerProfile;
