import React, { useState } from "react";
import { format } from "date-fns";
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

type Transaction = {
  id: string;
  amount: number;
  createdAt: Date;
  status: string;
  type: string;
  currency: string;
  user: {
    name: string;
    email: string;
    id: string;
  };
};
type Report = {
  id: string;
  title: string;
  description: string;
  user: {
    name: string;
    email: string; // Added email to user
    id: string;    // Added user ID
  };
  createdAt: string; // Timestamp of when the report was created
  status: string; 
};

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

// TransactionsList Component
type TransactionsListProps = {
  transactions: Transaction[];
};

export const TransactionsList: React.FC<TransactionsListProps> = ({
  transactions,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>("all"); // State for status filter
  const [filterType, setFilterType] = useState<string>("all"); // State for type filter

  // Function to handle filtering logic based on status and type
  const filteredTransactions = transactions.filter((transaction) => {
    const statusMatch =
      filterStatus === "all" ||
      transaction.status.toLowerCase() === filterStatus;
    const typeMatch =
      filterType === "all" || transaction.type.toLowerCase() === filterType;
    return statusMatch && typeMatch;
  });

  function onViewProfile(id:string): void {
console.log(id);
window.location.href = `/player/${id}`
  }

  return (
    <div>
      <div className="flex justify-between gap-2">
        <div className="mb-4">
          <label
            htmlFor="statusFilter"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Filter by Status:
          </label>
          <select
            id="statusFilter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        {/* Type Filter Dropdown */}
        <div className="mb-4">
          <label
            htmlFor="typeFilter"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Filter by Type:
          </label>
          <select
            id="typeFilter"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All</option>
            <option value="deposit">Deposit</option>
            <option value="withdrawal">Withdrawal</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredTransactions.length > 0 ? (
          <ul className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <li
                key={transaction.id}
                className={`p-4 rounded-md shadow-md ${
                  transaction.status === "completed"
                    ? "bg-green-100"
                    : "bg-gray-100"
                }`}
              >
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold">
                      Amount:{" "}
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: transaction.currency,
                      }).format(transaction.amount)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Status: {transaction.status}
                    </p>
                    <p className="text-sm text-gray-600">
                      Type: {transaction.type}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      {format(new Date(transaction.createdAt), "PPpp")}
                    </p>
                    <div>
                      <p className="text-sm text-gray-800 font-semibold">
                        User: {transaction.user.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Email: {transaction.user.email}
                      </p>
                    </div>
                  </div>
                </div>
              <p className="font-semibold text-blue-500 cursor-pointer hover:underline" onClick={() => onViewProfile(transaction.user.id)}>View User</p>

              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">
            No transactions found for the selected filters.
          </p>
        )}
      </div>
    </div>
  );
};

// ReportsList Component
type ReportsListProps = {
  reports: Report[];
};

export const ReportsList: React.FC<ReportsListProps> = ({ reports }) => {
  if (!reports || reports.length === 0)
    return <p className="text-gray-600">No Reports found </p>;

  return (
    <div className="space-y-4">
    {reports.map((report) => (
      <div key={report.id} className="bg-white p-3 rounded-md shadow-md">
        <h3 className="font-semibold text-lg text-gray-800">{report.title}</h3>
        <p className="text-gray-700">{report.description}</p>

        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-sm text-gray-600">Reported by:</span>
            <span className="font-medium text-gray-800">{report.user.name}</span>
            <span className="text-sm text-gray-600">{report.user.email}</span>
          </div>
          <div className="mt-2 border-l border-gray-200 pl-4">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg mb-2 hover:bg-blue-400 transition duration-200">
              Mark as completed
            </button>
            <p className="text-sm text-gray-600">
              Status: <span className={report.status === "COMPLETED" ? "text-green-600" : "text-red-600"}>{report.status}</span>
            </p>
            <p className="text-xs text-gray-500">Created At: {new Date(report.createdAt).toLocaleString()}</p>
          </div>
        </div>
      </div>
    ))}
  </div>
  );
};
