import { useState } from "react";
import usePersonStore from "../contexts/auth"; 
import { BACKEND_URL } from "../constants/routes";
import axios from "axios";

export default function Account() {
    const user = usePersonStore((state) => state.user);
    const [transactionType, setTransactionType] = useState("choose");
    const [paymentMethod, setPaymentMethod] = useState("choose");
    const [amount, setAmount] = useState("");
console.log(user)
    const handleTransaction = async (action: string) => {
        const url = action === "Deposit"
            ? `${BACKEND_URL}/payments/deposit-money`
            : `${BACKEND_URL}/payments/withdraw-money`;
  
        try {
 const response = await axios.post(url, 
      { amount }, // Body of the request
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`, // Token for authorization
        }
      }
    );

    // Axios automatically parses JSON for you
    const data = response.data; 

            alert(data.message);
        } catch (error) {
            console.error(`Error during ${action}:`, error);
            alert("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="text-white text-center max-w-full w-[700px] m-auto">
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
        </div>
    );
}
