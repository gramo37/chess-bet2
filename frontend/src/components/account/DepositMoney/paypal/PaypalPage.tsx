import { useState } from "react";
import { useGlobalStore } from "../../../../contexts/global.context";
import { BACKEND_URL, PAYPALCLIENTID } from "../../../../constants/routes";
import { roundTo8Decimals } from "../../../../types/utils/game";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { PaymentForm } from "./PaymentForm";

const PaypalPage = () => {
  const [amount, setAmount] = useState("");
  // const [address, setAddress] = useState("");
  const [currency, setCurrency] = useState("USD");
  // const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const { alertPopUp } = useGlobalStore(["alertPopUp"]);
  const [loading, setLoading] = useState(false);
  const [clientToken, setClientToken] = useState(undefined);

  const initialOptions = {
    clientId: PAYPALCLIENTID,
    enableFunding: "paylater,venmo",
    disableFunding: "",
    dataSdkIntegrationSource: "integrationbuilder_ac",
    dataClientToken: clientToken,
    components: "hosted-fields,buttons",
    currency: "USD",
  };

  const getPaypalToken = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/payments/paypal/token`, {
        method: "POST",
      });
      const { client_token } = await response.json();
      setClientToken(client_token);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert("Something went wrong. Please try again.");
    }
  };

  const successPayment = async () => {
    await getPaypalToken();
  };

  const handlePaypalDeposit = async () => {
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
            Kindly note that {"$"} {0.03 * Number(amount)} will be considered as
            Paypal fees. Therefore the final amount will be {"$"}{" "}
            {roundTo8Decimals(1.03 * Number(amount))}. Your balance will be
            updated by ${Number(amount)}.
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
        <h3>Deposit Money using Paypal</h3>
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
            <option value="USD">USD</option>
          </select>
        </div>
        <button
          onClick={handlePaypalDeposit}
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
      <div
        style={{
          width: "100%",
          margin: "18px 0px ",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {clientToken ? (
          <PayPalScriptProvider options={initialOptions}>
            <PaymentForm currency_code={currency} value={amount}/>
          </PayPalScriptProvider>
        ) : (
          loading && <h4>WAITING ON CLIENT TOKEN</h4>
        )}
      </div>
    </>
  );
};

export default PaypalPage;
