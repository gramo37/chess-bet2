import React, { useState } from "react";
import { format } from 'date-fns';
// Define types for Game, Transaction, and Report
type Game = {
  id: string;
  whitePlayer: {
    name: string;
  };
  blackPlayer: {
    name: string;
  };
  status: string;
};

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
  };
};

// GamesList Component
type GamesListProps = {
  games: Game[];
};

export const GamesList: React.FC<GamesListProps> = ({ games }) => {
  return (
    <div className="space-y-4">
      {games.map((game) => (
        <div key={game.id} className="bg-gray-100 p-4 rounded-md shadow-md">
          <p className="font-semibold">Game ID: {game.id}</p>
          <p>White Player: {game.whitePlayer.name}</p>
          <p>Black Player: {game.blackPlayer.name}</p>
          <p>Status: {game.status}</p>
        </div>
      ))}
    </div>
  );
};

// TransactionsList Component
type TransactionsListProps = {
  transactions: Transaction[];
};

export const TransactionsList: React.FC<TransactionsListProps> = ({ transactions }) => {
  const [filterStatus, setFilterStatus] = useState<string>('all'); // State for status filter
  const [filterType, setFilterType] = useState<string>('all');     // State for type filter

  // Function to handle filtering logic based on status and type
  const filteredTransactions = transactions.filter((transaction) => {
    const statusMatch = filterStatus === 'all' || transaction.status.toLowerCase() === filterStatus;
    const typeMatch = filterType === 'all' || transaction.type.toLowerCase() === filterType;
    return statusMatch && typeMatch;
  });

  return (
    <div>
<div className="flex justify-between gap-2">
      <div className="mb-4">
        <label htmlFor="statusFilter" className="block mb-2 text-sm font-medium text-gray-700">
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
        <label htmlFor="typeFilter" className="block mb-2 text-sm font-medium text-gray-700">
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
                className={`p-4 rounded-md shadow-md ${transaction.status === 'completed' ? 'bg-green-100' : 'bg-gray-100'}`}
              >
                <div className="flex justify-between">
                  <p className="font-semibold">
                    Amount: {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: transaction.currency,
                    }).format(transaction.amount)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {format(new Date(transaction.createdAt), 'PPpp')}
                  </p>
                </div>
                <p className="text-sm text-gray-600">Status: {transaction.status}</p>
                <p className="text-sm text-gray-600">Type: {transaction.type}</p>
                <div className="mt-2">
                  <p className="text-sm text-gray-800 font-semibold">User: {transaction.user.name}</p>
                  <p className="text-sm text-gray-600">Email: {transaction.user.email}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No transactions found for the selected filters.</p>
        )}
      </div>
    </div>
  )
};

// ReportsList Component
type ReportsListProps = {
  reports: Report[];
};

export const ReportsList: React.FC<ReportsListProps> = ({ reports }) => {
  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <div key={report.id} className="bg-gray-100 p-4 rounded-md shadow-md">
          <h3 className="font-semibold">{report.title}</h3>
          <p>{report.description}</p>
          <p className="text-sm text-gray-600">Reported by: {report.user.name}</p>
        </div>
      ))}
    </div>
  );
};
