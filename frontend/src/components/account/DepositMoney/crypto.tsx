import { useState } from "react";

const Crypto = () => {
  const [amount, setAmount] = useState(0);
  const [currency, setCurrency] = useState("USD");

  const handleCryptoDeposit = async () => {};

  return (
    <div>
      <h3>Deposit Money using Crypto</h3>
      <div className="flex gap-2 mt-2 mb-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full p-2 rounded bg-gray-700 text-white"
          placeholder="Enter amount"
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
        onClick={handleCryptoDeposit}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Deposit
      </button>
    </div>
  );
};

export default Crypto;
