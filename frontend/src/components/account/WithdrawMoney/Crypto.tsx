import { useState } from "react";
import { BACKEND_URL } from "../../../constants/routes";
import axios from "axios";
import usePersonStore from "../../../contexts/auth";

const Crypto = () => {
  const [amount, setAmount] = useState("");
  const [walletId, setWalletId] = useState("");
  const [currency, setCurrency] = useState("USD");
  const user = usePersonStore((state) => state.user);

  const handleCryptoWithdrawal = () => {};

  return (
    <>
      <div>
        <h3>Withdraw Money using Crypto</h3>
        <div className="flex gap-2 mt-2 mb-4">
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
            placeholder="Enter amount"
          />
          <input
            type="text"
            value={walletId}
            onChange={(e) => setWalletId(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
            placeholder="Enter Wallet ID"
          />
          <select
            name="currency"
            value={currency}
            disabled
            onChange={(e) => setCurrency(e.target.value)}
            className="px-4 rounded bg-gray-700 text-white"
          >
            <option value="USD">USD</option>
          </select>
        </div>
        <button
          onClick={handleCryptoWithdrawal}
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          Withdraw
        </button>
      </div>
    </>
  );
};

export default Crypto;
