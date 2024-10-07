import axios from "axios";
import { BACKEND_URL } from "../../constants/routes";
import usePersonStore from "../../contexts/auth";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../spinner"
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
    return <Spinner/>
  }

  if (error) {
    return <div className="text-center py-6 text-red-500">{error.message}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="overflow-x-auto">
        {transactions && transactions.length > 0 ? (
          <table className="min-w-full bg-white border whitespace-nowrap text-center border-gray-200 rounded-lg shadow-md">
            <thead className="bg-yellow-500 text-white">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-medium uppercase">ID</th>
                <th className="py-3 px-4 text-left text-sm font-medium uppercase">Amount</th>
                <th className="py-3 px-4 text-left text-sm font-medium uppercase">Currency</th>
                <th className="py-3 px-4 text-left text-sm font-medium uppercase">Final Amount ($)</th>
                <th className="py-3 px-4 text-left text-sm font-medium uppercase">Type</th>
                <th className="py-3 px-4 text-left text-sm font-medium uppercase">Status</th>
                <th className="py-3 px-4 text-left text-sm font-medium uppercase">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <TransactionComponent transaction={transaction}/>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center text-gray-500">No Transactions</div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
type TransactionProps = {
  transaction:any;
}


const TransactionComponent = ({transaction}:TransactionProps)=>{
  const [tooltip, setTooltip] = useState<{ id: string | null; visible: boolean }>({
    id: null,
    visible: false,
  });
  const copyTransactionId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      setTooltip({ id, visible: true });
      setTimeout(() => setTooltip({ id: null, visible: false }), 2000); // Hide after 2 seconds
    } catch (err) {
      console.error("Failed to copy transaction ID:", err);
    }
  };


  return <tr key={transaction.id} className="border-t hover:bg-gray-50 transition duration-200">
  <td 
    className="py-3 px-4 text-sm text-gray-600 cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis relative" 
    onClick={() => copyTransactionId(transaction.id)}
    title={transaction.id} // Optional: Show the full ID on hover
  >
    <span className="text-gray-400">Click to copy ID</span>
    {tooltip.visible && tooltip.id === transaction.id && (
      <span className="absolute left-1/2 transform -translate-x-1/3bg-black text-white text-xs rounded py-1 px-2 mt-1">
        Copied!
      </span>
    )}
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
  <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap">
    {new Date(transaction.createdAt).toLocaleDateString()}{" "}
    {new Date(transaction.createdAt).toLocaleTimeString()}
  </td>
</tr>
}