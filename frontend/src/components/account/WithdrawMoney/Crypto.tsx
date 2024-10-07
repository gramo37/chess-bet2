import { useState } from "react";
import { BACKEND_URL } from "../../../constants/routes";
import axios from "axios";
import usePersonStore from "../../../contexts/auth";
import { useGlobalStore } from "../../../contexts/global.context";
import CurrencyConverter from "../../CryptoCurrencyConverter";
import { roundTo8Decimals } from "../../../types/utils/game";

const Crypto = () => {
  const [amount, setAmount] = useState("");
  const [walletId, setWalletId] = useState("");
  const [currency, setCurrency] = useState("BTC");
  const user = usePersonStore((state) => state.user);
  const { alertPopUp } = useGlobalStore(["alertPopUp"]);
  const [loading, setLoading] = useState(false);

  const successPayment = async () => {
    try {
      const url = `${BACKEND_URL}/payments/crypto/withdraw`;
      setLoading(true);
      const response = await axios.post(
        url,
        {
          amount: Number(amount),
          address: walletId, // Wallet Address
          currency,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      setLoading(false);
      const data = response.data;
      alert(data.message ?? "Withdrawal Successful");
      // alertPopUp({
      //   message: "Withdrawal Successfull",
      //   type: "error",
      //   showPopUp: true,
      //   body: <div className="p-2">{data.message ?? ""}</div>,
      // });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error during Withdrawal:", error);
      setLoading(false);
      alert(
        error?.response?.data.message ??
          "Something went wrong. Please try again."
      );
      // alertPopUp({
      //   message: "Error",
      //   type: "error",
      //   showPopUp: true,
      //   body: (
      //     <div className="p-2">
      //       {error?.response?.data.message ??
      //         "Something went wrong. Please try again."}
      //     </div>
      //   ),
      // });
    }
  };

  const handleCryptoWithdrawal = async () => {
    const url = `${BACKEND_URL}/payments/get-crypto-in-USD`;
    const finalamountInUSD = await axios.post(url, {
      currency,
      amount: Number(amount),
    });

    const amtInUSD = finalamountInUSD.data.finalamountInUSD;
    let finalBalance = amtInUSD;
    finalBalance = Number(finalBalance.toFixed(2));

    if (!amount)
      return alertPopUp({
        message: "Error",
        type: "error",
        showPopUp: true,
        body: <div className="p-2">{"Please provide a amount"}</div>,
      });

    if (amtInUSD < 5)
      return alertPopUp({
        message: "Final amount less than the required limit.",
        type: "error",
        showPopUp: true,
        body: <div className="p-2">The amount should be above $5.</div>,
      });

    alertPopUp({
      message: "Final Amount",
      type: "confirm",
      showPopUp: true,
      body: (
        <div className="p-2">
          <p>
            Kindly note that {currency} {roundTo8Decimals(0.03 * Number(amount))} will be
            considered as platform fees. Therefore you will receive {currency}{" "}
            {roundTo8Decimals(0.97 * Number(amount))}. Your balance will be reduced by $
            {finalBalance}.
          </p>
          <p>Do you want to proceed ?</p>
        </div>
      ),
      success: successPayment,
      failure: () => {},
    });
  };

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
            onChange={(e) => setCurrency(e.target.value)}
            className="px-4 rounded bg-gray-700 text-white"
          >
            <option value="BTC">BTC</option>
            <option value="ETH">ETH</option>
          </select>
        </div>
        <button
          onClick={handleCryptoWithdrawal}
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          {loading ? "Loading..." : "Withdraw"}
        </button>
      </div>
      <CurrencyConverter />
    </>
  );
};

export default Crypto;
