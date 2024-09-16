import { useState } from "react";
import usePersonStore from "../contexts/auth"; // Import your store

export default function Account() {
    const user = usePersonStore((state) => state.user);
    const [choose, setChoose] = useState("choose");
    const [amount, setAmount] = useState("");

    const handleSubmit = (action:string) => {
        if (action === "Deposit") {
            console.log(`Depositing ${amount}$`);
            // Handle deposit logic here
        } else if (action === "Withdrawal") {
            console.log(`Withdrawing ${amount}$`);
            // Handle withdrawal logic here
        }
    };

    return (
        <div className="text-white text-center max-w-full w-[700px] m-auto">
            <h1 className="text-3xl mb-4">Account</h1>

            <h3 className="mb-2">Username: {user?.email || "Guest"}</h3>
            <h3 className="mb-2">Name: {user?.name || "Anonymous"}</h3>

            <div className="flex justify-between items-center my-4">
                <p>Balance: {user?.balance ? `${user.balance}$` : "0$"}</p>

                <div className="flex gap-2 items-center">
                    <select
                        name="paymentMethod"
                        value={choose}
                        onChange={(e) => setChoose(e.target.value)}
                        className="px-2 py-1 rounded bg-gray-700 text-white"
                    >
                        <option value="choose">Choose Transaction</option>
                        <option value="Deposit">Deposit</option>
                        <option value="Withdrawal">Withdrawal</option>
                    </select>
                </div>
            </div>

            {choose !== "choose" && (
                <div className="my-4">
                    <label className="block mb-2 text-left">Amount:</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
                        placeholder="Enter amount"
                    />

                    {choose === "Deposit" ? (
                        <button
                            onClick={() => handleSubmit("Deposit")}
                            className="px-4 py-2 bg-green-600 text-white rounded"
                        >
                            Deposit
                        </button>
                    ) : (
                        <button
                            onClick={() => handleSubmit("Withdrawal")}
                            className="px-4 py-2 bg-red-600 text-white rounded"
                        >
                            Withdrawal
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
