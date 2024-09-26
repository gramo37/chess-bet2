import { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../constants/routes";
import usePersonStore from "../../contexts/auth";

export default function DepositMoney() {
  const user = usePersonStore((state) => state.user);
  const [amount, setAmount] = useState(0);
  const [currency, setCurrency] = useState("USD");
//   const [paymentMethod, setPaymentMethod] = useState("choose");

  const handleDeposit = async () => {
    const url = `${BACKEND_URL}/payments/get-payment-url`;

    try {
      const response = await axios.post(
        url,
        {
          amount,
          currency,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      const data = response.data;
      window.location.href = data.paymentDetails;
    } catch (error) {
      console.error("Error during Deposit:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="p-2">
      <h3>Deposit Money</h3>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
        placeholder="Enter amount"
      />
      <select
        name="currency"
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        className="px-4 py-2 rounded bg-gray-700 text-white"
      >
        <option value="USD">USD</option>
        <option value="KES">KES</option>
      </select>
      <button onClick={handleDeposit} className="px-4 py-2 bg-green-600 text-white rounded">
        Deposit
      </button>
    </div>
  );
}
