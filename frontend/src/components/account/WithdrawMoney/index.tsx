import { useState } from "react";
import Mpesa from "./Mpesa";
import Crypto from "./Crypto";

export default function WithdrawMoney() {
  const [paymentMethod, setPaymentMethod] = useState("mpesa");

  return (
    <div>
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
        {paymentMethod === "mpesa" && <Mpesa />}
        {paymentMethod === "crypto" && <Crypto />}
      </div>
    </div>
  );
}
