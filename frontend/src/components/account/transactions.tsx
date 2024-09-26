import axios from "axios";
import { BACKEND_URL } from "../../constants/routes";
import usePersonStore from "../../contexts/auth";
import React from "react";
import { useQuery } from "@tanstack/react-query";

// interface Transaction {
//   id: string;
//   amount: number;
//   type: string;
//   status: string;
//   createdAt: string;
// }

const TransactionHistory: React.FC = () => {
  const { user, transactions, setTransactions } = usePersonStore();

  const fetchTransactions = async () => {
    try {
      if (!user || !user.token) return [];
      const url = `${BACKEND_URL}/payments/transaction-history`;
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      setTransactions(response.data.transactions);
      console.log(response.data.transactions);
      return response.data.transactions;
    } catch (err) {
      console.error(err);
    }
  };

  const { isLoading, error } = useQuery({
    queryKey: ["TransactionHistory"],
    queryFn: fetchTransactions,
  });

  if (isLoading) {
    return <div className="text-center py-6">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-6 text-red-500">{error.message}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {
        <div className="overflow-x-auto">
          {transactions && transactions.length > 0 ? (
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase">
                    ID
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase">
                    Amount
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase">
                    Currency
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase">
                    Final Amount ($)
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase">
                    Type
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase">
                    Status
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-t">
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {transaction.id}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {transaction.amount.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {transaction.currency}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {transaction.finalamountInUSD.toFixed(2)} $
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {transaction.type}
                    </td>
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
            </table>
          ) : transactions && transactions.length === 0 ? (
            <div className="text-center text-gray-500">No Transactions</div>
          ) : (
            ""
          )}
        </div>
      }
    </div>
  );
};

export default TransactionHistory;
