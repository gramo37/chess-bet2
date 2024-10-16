import { useState } from "react";
import usePersonStore from "../../../contexts/auth";
import axios from "axios";
import { BACKEND_URL } from "../../../constants/routes";
import { useGlobalStore } from "../../../contexts/global.context";

const Mpesa = () => {
  const [amount, setAmount] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const user = usePersonStore((state) => state.user);
  const { alertPopUp } = useGlobalStore(["alertPopUp"]);
  const [loading, setLoading] = useState(false);

  const successPayment = async () => {
    const url = `${BACKEND_URL}/payments/mpesa/withdraw`;
    setLoading(true);
    try {
      const response = await axios.post(
        url,
        {
          amount: 0.97 * Number(amount),
          account: phoneNumber,
          currency: "KES",
          mode: "mpesa",
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
      //   message: "Withdrawal Successful",
      //   type: "success",
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

  const handleMpesaWithdrawal = async () => {
    if (phoneNumber.length !== 9)
      return alertPopUp({
        message: "Error",
        type: "error",
        showPopUp: true,
        body: (
          <div className="p-2">
            {"Kindly enter a 12 digit number starting with 254."}
          </div>
        ),
      });

    if (!amount)
      return alertPopUp({
        message: "Error",
        type: "error",
        showPopUp: true,
        body: <div className="p-2">{"Please provide a amount"}</div>,
      });

    if (Number(amount) < 700)
      return alertPopUp({
        message: "Final amount less than the required limit.",
        type: "error",
        showPopUp: true,
        body: <div className="p-2">The amount should be above KES 700.</div>,
      });

    const url = `${BACKEND_URL}/payments/get-amount-in-USD`;
    const finalamountInUSD = await axios.post(url, {
      currency: "KES",
      amount: Number(amount),
    });

    const amtInUSD = finalamountInUSD.data.finalamountInUSD;
    let finalBalance = amtInUSD;
    finalBalance = Number(finalBalance.toFixed(2));

    alertPopUp({
      message: "Final Amount",
      type: "confirm",
      showPopUp: true,
      body: (
        <div className="p-2">
          <p>
            Kindly note that KES {0.03 * Number(amount)} will be considered as
            instasend fees. Therefore you will receive KES{" "}
            {0.97 * Number(amount)}. Your balance will be reduced by $
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
        <h3>Withdraw Money using Mpesa</h3>
        <div className="flex gap-2 mt-2 mb-4">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
            placeholder="Enter amount"
          />
          <div className="flex items-center pl-2 rounded bg-gray-700 text-white">
            <span className="pr-0">254</span>
            <input
              type="tel"
              value={phoneNumber}
              maxLength={9}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full p-2 pl-1 rounded bg-gray-700 text-white outline-none"
              placeholder="Phone number"
            />
          </div>
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
        >
          {loading ? "Loading..." : "Withdraw"}
        </button>
      </div>
    </>
  );
};

export default Mpesa;
