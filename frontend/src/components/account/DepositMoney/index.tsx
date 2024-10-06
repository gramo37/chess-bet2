import { useState } from "react";
import Mpesa from "./mpesa";
import Crypto from "./crypto";

export default function DepositMoney() {
  const [paymentMethod, setPaymentMethod] = useState("mpesa");

  return (
    <div className="p-2">
      <div className="flex my-2">
        <div className="space-y-2">
          <button
            onClick={() => setPaymentMethod("mpesa")}
            className={`btn m-2 p-2 ${
              paymentMethod === "mpesa"
                ? "bg-yellow-500 text-white"
                : "bg-gray-200 text-blue-800"
            }`}
          >
            Mpesa
          </button>
          <button
            onClick={() => setPaymentMethod("crypto")}
            className={`btn m-2 p-2 ${
              paymentMethod === "crypto"
                ? "bg-yellow-500 text-white"
                : "bg-gray-200 text-blue-800"
            }`}
          >
            Crypto
          </button>
        </div>
      </div>
      {paymentMethod === "mpesa" && (
        <Mpesa />
      )}
      {paymentMethod === "crypto" && (
        <Crypto />
      )}
    </div>
  );
}
