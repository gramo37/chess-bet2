import axios from "axios";
import { BACKEND_URL } from "../../../constants/routes";
import usePersonStore from "../../../contexts/auth";
import { useState } from "react";
import { useGlobalStore } from "../../../contexts/global.context";

const Mpesa = () => {
  const user = usePersonStore((state) => state.user);
  const [amount, setAmount] = useState("");
  const {alertPopUp} = useGlobalStore(["alertPopUp"]);
  const [loading, setLoading] = useState(false);

  const handleMpesaDeposit = async () => {
    const url = `${BACKEND_URL}/payments/mpesa/get-url`;
    setLoading(true);
    try {
      const response = await axios.post(
        url,
        {
          amount: Number(amount),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      setLoading(false)
      const data = response.data;
      window.location.href = data.paymentDetails;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error during Deposit:", error);
      setLoading(false)
      alertPopUp({
        message: "Error",
        type: "error",
        showPopUp: true,
        body: <div className="p-2">{error?.response?.data.message ?? "Something went wrong. Please try again."}</div>
      })
    }
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
          <option value="KES">KES</option>
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
