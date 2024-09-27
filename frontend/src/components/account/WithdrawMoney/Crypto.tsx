import { useState } from "react";

const Crypto = () => {
  const [amount, setAmount] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [currency, setCurrency] = useState("USD");

  const handleCryptoWithdrawal = () => {};

  return (
    <>
      <div>
        <h3>Withdraw Money using Crypto</h3>
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
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="px-4 rounded bg-gray-700 text-white"
          >
            <option value="USD">USD</option>
            <option value="KES">KES</option>
          </select>
        </div>
        <button
          onClick={handleCryptoWithdrawal}
          className="px-4 py-2 bg-red-600 text-white rounded"
          disabled={phoneNumber.length !== 12}
        >
          Withdraw
        </button>
      </div>
    </>
  );
};

export default Crypto;
