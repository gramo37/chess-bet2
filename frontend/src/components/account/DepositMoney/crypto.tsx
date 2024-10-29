import { useState } from "react";
import { BACKEND_URL } from "../../../constants/routes";
import usePersonStore from "../../../contexts/auth";
import axios from "axios";
import { useGlobalStore } from "../../../contexts/global.context";
// import CurrencyConverter from "../../CryptoCurrencyConverter";
import { roundTo8Decimals } from "../../../types/utils/game";

const Crypto = () => {
  const [amount, setAmount] = useState("");
  // const [address, setAddress] = useState("");
  const [currency, setCurrency] = useState("BTC");
  // const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const user = usePersonStore((state) => state.user);
  const { alertPopUp } = useGlobalStore(["alertPopUp"]);
  const [loading, setLoading] = useState(false);

  const successPayment = async () => {
    const url = `${BACKEND_URL}/payments/crypto/get-url`;
    setLoading(true);
    try {
      const response = await axios.post(
        url,
        {
          // address: address, // Create a state variable for this
          amount: roundTo8Decimals(1.03 * Number(amount)),
          currency,
          platform_charges: 0.03 * Number(amount)
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
      window.location.href = data.paymentDetails;
      // setWalletAddress(data.wallet_address);
      // window.location.href = data.paymentDetails;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error during Deposit:", error);
      setLoading(false);
      alert(
        error?.response?.data.message ??
          "Something went wrong. Please try again."
      );
      // alertPopUp({
      //   message: "Error",
      //   type: "error",
      //   showPopUp: true,
      //   body: <div className="p-2">{error?.response?.data.message ?? "Something went wrong. Please try again."}</div>
      // })
    }
  };

  const handleCryptoDeposit = async () => {
    // const url = `${BACKEND_URL}/payments/get-crypto-in-USD`;
    // const finalamountInUSD = await axios.post(url, {
    //   currency,
    //   amount: roundTo8Decimals(1.03 * Number(amount)),
    // });

    // const amtInUSD = finalamountInUSD.data.finalamountInUSD;
    // let finalBalance = amtInUSD - 0.03 * amtInUSD;
    // finalBalance = Number(finalBalance.toFixed(2));

    if (!amount)
      return alertPopUp({
        message: "Error",
        type: "error",
        showPopUp: true,
        body: <div className="p-2">{"Please provide a amount"}</div>,
      });

    if (Number(amount) < 5)
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
            Kindly note that {"$"} {0.03 * Number(amount)} will be
            considered as NOWPayments fees. Therefore the final amount will be{" "}
            {"$"} {roundTo8Decimals(1.03 * Number(amount))}. Your balance will be updated by
            ${Number(amount)}.
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
        <h3>Deposit Money using Crypto</h3>
        <div className="flex gap-2 mt-2 mb-4">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
            placeholder="Enter amount in USD"
          />
          {/* <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
            placeholder="Enter your wallet address"
          /> */}
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
          {loading ? "Loading..." : "Deposit"}
        </button>
        {/* {walletAddress && (
          <div className="mt-5">
            <p className="text-white">Wallet Address - {walletAddress}</p>
            <p className="text-red-500 mt-3">
              Kindly send money to the above address using your wallet address{" "}
              <span className="text-lg font-bold">{address}</span> and select the coin as <span className="text-lg font-bold">{currency}</span> and amount as <span className="text-lg font-bold">{roundTo8Decimals(1.03 * Number(amount))}</span>.
            </p>
            <p className="text-red-500 mt-3">
              Please make sure the wallet address, amount and the currency match as given above. Your
              balance will be updated within 5-10 minutes
            </p>
          </div>
        )} */}
      </div>
      {/* <CurrencyConverter /> */}
    </>
  );
};

export default Crypto;
