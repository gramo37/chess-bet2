import React, { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../constants/routes";

type Currency = "BTC" | "ETH";

const CurrencyConverter: React.FC = () => {
  const [usdAmount, setUsdAmount] = useState<number>(0);
  const [currency, setCurrency] = useState<Currency>("BTC");
  const [conversionResult, setConversionResult] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleConvert = async () => {
    try {
      setLoading(true);
      // Assuming your API endpoint looks something like /convert?amount=usdAmount&currency=BTC
      const response = await axios.post(
        `${BACKEND_URL}/payments/get-USD-in-crypto`,
        {
            currency,
            amount: usdAmount
        }
      );
      setConversionResult(response.data.finalamountInCrypto.toFixed(7));
    } catch (error) {
      console.error("Error fetching conversion data", error);
      alert("Error fetching conversion data")
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-900 text-white p-5 w-[500px] m-auto">
      <h1 className="text-2xl font-bold mb-6">USD to {currency} Converter</h1>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="mb-4">
          <label htmlFor="usdAmount" className="block text-lg font-medium">
            USD Amount
          </label>
          <input
            id="usdAmount"
            type="number"
            value={usdAmount}
            onChange={(e) => setUsdAmount(parseFloat(e.target.value))}
            className="w-full mt-2 p-3 bg-gray-700 rounded-md text-white border border-gray-600 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="currency" className="block text-lg font-medium">
            Select Currency
          </label>
          <select
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value as Currency)}
            className="w-full mt-2 p-3 bg-gray-700 rounded-md text-white border border-gray-600 focus:outline-none focus:border-indigo-500"
          >
            <option value="BTC">BTC (Bitcoin)</option>
            <option value="ETH">ETH (Ethereum)</option>
          </select>
        </div>
        <button
          onClick={handleConvert}
          disabled={loading}
          className="w-full p-3 bg-indigo-600 rounded-md text-white font-semibold hover:bg-indigo-500 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Converting..." : "Convert"}
        </button>
      </div>

      {conversionResult !== null && (
        <div className="mt-6 bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md text-center">
          <h2 className="text-xl font-bold">
            {usdAmount} USD = {conversionResult} {currency}
          </h2>
        </div>
      )}
    </div>
  );
};

export default CurrencyConverter;
