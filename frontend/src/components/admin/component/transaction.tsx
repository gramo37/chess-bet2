import { useState } from "react";
import { format } from "date-fns";
import { TransactionsListProps } from "../schema";

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
                <TransactionsComponent transaction={transaction}/>
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
  
  type TransactionsProps = {
    transaction:any;
  }
  const TransactionsComponent = ({transaction}:TransactionsProps)=>{

    function onViewProfile(id:string): void {
      console.log(id);
      window.location.href = `/player/${id}`
        }
      
    return <li
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
  <p className="font-semibold text-yellow-600 cursor-pointer hover:underline" onClick={() => onViewProfile(transaction.user.id)}>View User</p>

  </li>
  }