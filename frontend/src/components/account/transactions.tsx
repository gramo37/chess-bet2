import axios from "axios";
import { useState} from "react";
import { BACKEND_URL } from "../../constants/routes";
import usePersonStore from "../../contexts/auth";
import React from "react";

interface Transaction {
  id: string;
  amount: number;
  type: string;
  status: string;
  createdAt: string;
}


const TransactionHistory: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const { user, transactions, setTransactions, setIsLoading, isLoading } = usePersonStore();

  const fetchTransactions = async () => {
    try {
        if (!user || !user.token) return;

      setIsLoading(true);
      const url = `${BACKEND_URL}/payments/transaction-history`;
      const response = await axios.get(
        url,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          },
        }
      );
      setTransactions(response.data.transactions);
      setError(null); 
    } catch (err) {
      console.error(err);
      setError("Error loading transaction history.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-6">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-6 text-red-500">{error}</div>;
  }

  
  return (
    <div className="container mx-auto px-4 py-8">
      { (
        <div className="overflow-x-auto">
          {(transactions&&transactions.length>0)?<table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase">ID</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase">Amount</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase">Type</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase">Status</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-t">
                  <td className="py-3 px-4 text-sm text-gray-600">{transaction.id}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{transaction.amount.toFixed(2)}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{transaction.type}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        transaction.status === "COMPLETED"
                          ? "bg-green-100 text-green-700"
                          : transaction.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {new Date(transaction.createdAt).toLocaleDateString()}{" "}
                    {new Date(transaction.createdAt).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>:((transactions&&transactions.length===0)?<div className="text-center text-gray-500">No Transactions</div>:'')}
        </div>
      )}
  <button className="px-4 py-2 mt-4 bg-teal-500 text-white" onClick={fetchTransactions}>Get Transactions</button>
    </div>
  );
};

export default TransactionHistory;
