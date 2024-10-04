import { useState } from "react";
import { BACKEND_URL } from "../../../constants/routes";
import usePersonStore from "../../../contexts/auth";
import axios from "axios";

const Crypto = () => {
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [currency, setCurrency] = useState("BTC");
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const user = usePersonStore((state) => state.user);

  const handleCryptoDeposit = async () => {
    const url = `${BACKEND_URL}/payments/crypto/get-wallet-address`;

    try {
      const response = await axios.post(
        url,
        {
          address: address, // Create a state variable for this
          amount: Number(amount),
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
      setWalletAddress(data.wallet_address);
      // window.location.href = data.paymentDetails;
    } catch (error) {
      console.error("Error during Deposit:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div>
      <h3>Deposit Money using Crypto</h3>
      <div className="flex gap-2 mt-2 mb-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white"
          placeholder="Enter amount"
        />
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white"
          placeholder="Enter your wallet address"
        />
        <select
          name="currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="px-4 rounded bg-gray-700 text-white"
        >
          <option value="BTC">BTC</option>
          <option value="ETH">ETH</option>
        </select>
      </div>
      <button
        onClick={handleCryptoDeposit}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Deposit
      </button>
      {walletAddress && (
        <div className="mt-5">
          <p className="text-white">Wallet Address - {walletAddress}</p>
          <p className="text-red-500 mt-3">Kindly send money to the above address using your wallet address {address} and select the coin as {currency}.</p>
          <p className="text-red-500 mt-3">Please make sure the wallet address and the currency matches. Your balance will be updated within 10-15 minutes</p>
        </div>
      )}
    </div>
  );
};

export default Crypto;
