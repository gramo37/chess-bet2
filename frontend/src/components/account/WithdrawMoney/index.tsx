import { useState } from "react";
import Mpesa from "./Mpesa";
import Crypto from "./Crypto";
import usePersonStore from "../../../contexts/auth";

export default function WithdrawMoney() {
  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const user = usePersonStore((state) => state.user);

  return (
    <div>
      <div className="p-2">
        <div className="flex my-2">
          <div className="space-y-2">
            <button
              onClick={() => {
                if (!user || !user.emailVerified) {
                  alert("Please verify your email to use Mpesa.");
                  return;
                }
                setPaymentMethod("mpesa");
              }}
              className={`btn m-2 p-2 ${
                paymentMethod === "mpesa"
                  ? "bg-yellow-500 text-white"
                  : "bg-gray-200 text-blue-800"
              }`}
            >
              M-pesa
            </button>
            <button
              onClick={() => {
                if (!user || !user.emailVerified) {
                  alert("Please verify your email to use Crypto.");
                  return;
                }
                setPaymentMethod("crypto");
              }}
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
        {user && !user.emailVerified && (
          <p className="text-red-500">
            Please verify your email to use payment options.
          </p>
        )}
        {paymentMethod === "mpesa" && user?.emailVerified && <Mpesa />}
        {paymentMethod === "crypto" && user?.emailVerified && <Crypto />}
      </div>
    </div>
  );
}
