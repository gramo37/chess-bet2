import { useState } from "react";
import usePersonStore from "../../../contexts/auth";
import axios from "axios";
import { BACKEND_URL } from "../../../constants/routes";

const Mpesa = () => {
  const [amount, setAmount] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const user = usePersonStore((state) => state.user);

  const handleMpesaWithdrawal = async () => {
    const url = `${BACKEND_URL}/payments/withdraw-mpesa`;

    try {
      const response = await axios.post(
        url,
        {
          amount: Number(amount),
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
    <>
      <div>
        <h3>Withdraw Money using Mpesa</h3>
        <div className="flex gap-2 mt-2 mb-4">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
            placeholder="Enter amount"
          />
          <input
            type="number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
            placeholder="Enter phone number"
          />
          <select
            name="currency"
            value="KES"
            disabled
            className="px-4 rounded bg-gray-700 text-white"
          >
            <option value="KES">KES</option>
          </select>
        </div>
        <button
          onClick={handleMpesaWithdrawal}
          className="px-4 py-2 bg-red-600 text-white rounded"
          disabled={phoneNumber.length !== 12}
        >
          Withdraw
        </button>
      </div>
    </>
  );
};

export default Mpesa;
