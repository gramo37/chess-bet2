import { useState } from "react";
import usePersonStore from "../../../contexts/auth";
import axios from "axios";
import { BACKEND_URL } from "../../../constants/routes";
import { useGlobalStore } from "../../../contexts/global.context";

const Mpesa = () => {
  const [amount, setAmount] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const user = usePersonStore((state) => state.user);
  const {alertPopUp} = useGlobalStore(["alertPopUp"])

  const handleMpesaWithdrawal = async () => {
    const url = `${BACKEND_URL}/payments/mpesa/withdraw`;

    try {
      const response = await axios.post(
        url,
        {
          amount: Number(amount),
          account: phoneNumber,
          currency: "KES",
          mode: "mpesa"
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      const data = response.data;
      alertPopUp({
        message: "Withdrawal Successfull",
        type: "error",
        showPopUp: true,
        body: <div className="p-2">{data.message ?? ""}</div>
      })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error during Withdrawal:", error);
      alertPopUp({
        message: "Error",
        type: "error",
        showPopUp: true,
        body: <div className="p-2">{error?.response?.data.message ?? "Something went wrong. Please try again."}</div>
      })
    }
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
          <input
            type="number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
            placeholder="Enter phone number"
          />
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
          disabled={phoneNumber.length !== 12}
        >
          Withdraw
        </button>
      </div>
    </>
  );
};

export default Mpesa;
