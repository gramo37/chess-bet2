import { useState } from "react";

const Crypto = () => {
  const [amount, setAmount] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleCryptoWithdrawal = () => {};

  return (
    <>
      <div>
        <h3>Withdraw Money using Crypto</h3>
        <div className="flex gap-2 mt-2 mb-4">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
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
