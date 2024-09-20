import { useState } from "react";
import usePersonStore from "../../contexts/auth";
import { BACKEND_URL } from "../../constants/routes";
import TransactionHistory from "./transactions";
import axios from "axios";
import GameHistory from "./gamehistory";
import { IoMdArrowBack } from "react-icons/io";
import { Report } from "./report";
export default function Account() {
  const user = usePersonStore((state) => state.user);
  const [transactionType, setTransactionType] = useState("choose");
  const [paymentMethod, setPaymentMethod] = useState("choose");
  const [amount, setAmount] = useState("");
  const [activeTab, setActiveTab] = useState("transactions");
  

  const handleTransaction = async (action: string) => {
    const url =
      action === "Deposit"
        ? `${BACKEND_URL}/payments/get-payment-url`
        : `${BACKEND_URL}/payments/withdraw-money`;

    try {
      const response = await axios.post(
        url,
        { amount },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      const data = response.data;

      console.log(data, data.url)

      window.location.href = data.paymentDetails;

    //   alert(data.message);
    } catch (error) {
      console.error(`Error during ${action}:`, error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="text-white text-center max-w-full w-[900px] m-auto">
      <a className="absolute top-10 left-10" href="/">
        <IoMdArrowBack />
      </a>
      <Report />
      <h1 className="text-3xl mb-4">Account</h1>

      <h3 className="mb-2">Username: {user?.email || "Guest"}</h3>
      <h3 className="mb-2">Name: {user?.name || "Anonymous"}</h3>

      <div className="flex justify-between items-center my-4">
        <p>Balance: {user?.balance ? `${user.balance}$` : "0$"}</p>

        <select
          name="transactionType"
          value={transactionType}
          onChange={(e) => setTransactionType(e.target.value)}
          className="px-4 py-2 rounded bg-gray-700 text-white"
        >
          <option value="choose">Choose Transaction</option>
          <option value="Deposit">Deposit</option>
          <option value="Withdrawal">Withdrawal</option>
        </select>
      </div>

      {transactionType !== "choose" && (
        <div className="my-4">
          <label className="block mb-2 text-left">Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
            placeholder="Enter amount"
          />

          {transactionType === "Deposit" && (
            <div className="flex gap-2 justify-between">
              <select
                name="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="px-4 py-2 rounded bg-gray-700 text-white"
              >
                <option value="choose">Deposit Options</option>
                <option value="Instasend">Instasend</option>
                <option value="Paypal">Paypal</option>
              </select>
              <button
                onClick={() => handleTransaction("Deposit")}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Deposit
              </button>
            </div>
          )}

          {transactionType === "Withdrawal" && (
            <>
              <button
                onClick={() => handleTransaction("Withdrawal")}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Withdrawal
              </button>
              <p className="mt-4">Minimum amount: 5$</p>
            </>
          )}
        </div>
      )}
      <div className="flex space-x-3 w-full">
        <div
          className={`py-2 border-b-4 transition-colors cursor-pointer w-[48%] duration-300 ${
            "transactions" === activeTab
              ? "border-teal-500"
              : "border-transparent hover:border-gray-200"
          }`}
          onClick={() => setActiveTab("transactions")}
        >
          Transactions
        </div>

        <div
          className={`py-2 border-b-4 transition-colors cursor-pointer w-[48%] duration-300 ${
            "gamesplayed" === activeTab
              ? "border-teal-500"
              : "border-transparent hover:border-gray-200"
          }`}
          onClick={() => setActiveTab("gamesplayed")}
        >
          Games Played
        </div>
      </div>

      <div className="mt-4">
        {"gamesplayed" === activeTab ? <GameHistory /> : <TransactionHistory />}
      </div>
    </div>
  );
}
