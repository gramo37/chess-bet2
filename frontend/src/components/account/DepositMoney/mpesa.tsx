import axios from "axios";
import { BACKEND_URL } from "../../../constants/routes";
import usePersonStore from "../../../contexts/auth";
import { useState } from "react";
import { useGlobalStore } from "../../../contexts/global.context";

const Mpesa = ({ paymentMethod }: { paymentMethod: string }) => {
  const user = usePersonStore((state) => state.user);
  const [amount, setAmount] = useState("");
  const { alertPopUp } = useGlobalStore(["alertPopUp"]);
  const [loading, setLoading] = useState(false);

  const successPayment = async () => {
    const url = `${BACKEND_URL}/payments/mpesa/get-url`;
    setLoading(true);
    try {
      const response = await axios.post(
        url,
        {
          amount: 1.03 * Number(amount),
          currency: ["card", "apple"].includes(paymentMethod) ? "USD" : "KES"
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
      //   body: (
      //     <div className="p-2">
      //       {error?.response?.data.message ??
      //         "Something went wrong. Please try again."}
      //     </div>
      //   ),
      // });
    }
  };

  const handleMpesaDeposit = async () => {
    if (!amount)
      return alertPopUp({
        message: "Error",
        type: "error",
        showPopUp: true,
        body: <div className="p-2">{"Please provide a amount"}</div>,
      });

    if (paymentMethod === "mpesa" && Number(amount) < 700)
      return alertPopUp({
        message: "Final amount less than the required limit.",
        type: "error",
        showPopUp: true,
        body: <div className="p-2">The amount should be above KES 700.</div>,
      });

    if (["card", "apple"].includes(paymentMethod) && Number(amount) < 5)
      return alertPopUp({
        message: "Final amount less than the required limit.",
        type: "error",
        showPopUp: true,
        body: <div className="p-2">The amount should be above $5.</div>,
      });

    const url = `${BACKEND_URL}/payments/get-amount-in-USD`;
    const finalamountInUSD = await axios.post(url, {
      currency: ["card", "apple"].includes(paymentMethod) ? "USD" : "KES",
      amount: 1.03 * Number(amount),
    });

    const amtInUSD = finalamountInUSD.data.finalamountInUSD;
    let finalBalance = amtInUSD - 0.03 * amtInUSD;
    finalBalance = Number(finalBalance.toFixed(2));

    alertPopUp({
      message: "Final Amount",
      type: "confirm",
      showPopUp: true,
      body: (
        <div className="p-2">
          <p>
            Kindly note that {["card", "apple"].includes(paymentMethod) ? "$" : "KES "}{0.03 * Number(amount)} will be considered as
            instasend fees. Therefore the final amount will be {["card", "apple"].includes(paymentMethod) ? "$" : "KES "}
            {1.03 * Number(amount)}. Your balance will be updated by $
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
    <div>
      <h3>Deposit Money using Mpesa</h3>
      <div className="flex gap-2 mt-2 mb-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white"
          placeholder="Enter amount"
        />
        <select
          name="currency"
          value="KES"
          disabled
          className="px-4 rounded bg-gray-700 text-white"
        >
          {["card", "apple"].includes(paymentMethod) ? <option value="USD">USD</option> : <option value="KES">KES</option> }
        </select>
      </div>
      <button
        onClick={handleMpesaDeposit}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        {loading ? "Loading..." : "Deposit"}
      </button>
    </div>
  );
};

export default Mpesa;
