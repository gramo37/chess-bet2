import axios from "axios";
import { BACKEND_URL } from "../../constants/routes";
import usePersonStore from "../../contexts/auth";
import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import Spinner from "../spinner";
import { IoMdRefresh } from "react-icons/io";

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
    return <Spinner />;
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
                <th className="py-3 px-4 text-left text-sm font-medium uppercase">
                  ID
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium uppercase">
                  Amount
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium uppercase">
                  Currency
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium uppercase">
                  Final Amount ($)
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium uppercase">
                  Type
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium uppercase">
                  Status
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium uppercase">
                  Date
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium uppercase">
                  Refresh
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <TransactionComponent transaction={transaction} />
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transaction: any;
};

const TransactionComponent = ({ transaction }: TransactionProps) => {
  const [tooltip, setTooltip] = useState<{
    id: string | null;
    visible: boolean;
  }>({
    id: null,
    visible: false,
  });
  const user = usePersonStore((state) => state.user);
  const copyTransactionId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      setTooltip({ id, visible: true });
      setTimeout(() => setTooltip({ id: null, visible: false }), 2000); // Hide after 2 seconds
    } catch (err) {
      console.error("Failed to copy transaction ID:", err);
    }
  };
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const url = `${BACKEND_URL}/payments/mpesa/transaction/status`;
      await axios.post(
        url,
        {
          invoice_id: transaction.webhook.invoice_id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
    },
  });
  const refreshTransaction = async () => {
    if (!transaction || !transaction?.webhook?.invoice_id) {
      return;
    }
    mutate();
  };

  return (
    <tr
      key={transaction.id}
      className="border-t hover:bg-gray-50 transition duration-200"
    >
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
        {transaction.mode === "crypto"
          ? transaction.amount
          : transaction.amount.toFixed(2)}
      </td>
      <td className="py-3 px-4 text-sm text-gray-600">
        {transaction.currency}
      </td>
      <td className="py-3 px-4 text-sm text-gray-600">
        ${transaction.finalamountInUSD.toFixed(2)}
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
      <td>
        <button className="text-black" onClick={refreshTransaction}>
          {isPending ? (
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-yellow-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          ) : (
            <IoMdRefresh />
          )}
        </button>
      </td>
    </tr>
  );
};
