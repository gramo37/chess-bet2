import { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../constants/routes";
import usePersonStore from "../../contexts/auth";

export default function WithdrawMoney() {
  const user = usePersonStore((state) => state.user);
  const [amount, setAmount] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleWithdrawal = async () => {
    const url = `${BACKEND_URL}/payments/withdraw-money`;

    try {
      const response = await axios.post(
        url,
        {
          amount,
          account: phoneNumber,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      const data = response.data;
      alert(data.message);
    } catch (error) {
      console.error("Error during Withdrawal:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div>
      <h3>Withdraw Money</h3>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
        placeholder="Enter amount"
      />
      <input
        type="number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
        placeholder="Enter phone number"
      />
      <button
        onClick={handleWithdrawal}
        className="px-4 py-2 bg-red-600 text-white rounded"
        disabled={phoneNumber.length !== 12}
      >
        Withdraw
      </button>
    </div>
  );
}
