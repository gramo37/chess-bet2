import { useState } from "react";
import Mpesa from "./mpesa";
import Crypto from "./crypto";
import usePersonStore from "../../../contexts/auth";

export default function DepositMoney() {
  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const user = usePersonStore((state) => state.user);

  return (
    <div className="p-2">
  <div className="flex my-2">
    <div className="space-y-2">
    <button
        onClick={() => {
          if (user&&!user.emailVerified) {
            alert("Please verify your email to use Mpesa.");
            return;
          }
          setPaymentMethod("card");
        }}
        className={`btn m-2 p-2 ${
          paymentMethod === "card"
            ? "bg-yellow-500 text-white"
            : "bg-gray-200 text-blue-800"
        }`}
        disabled={(!user||!user.emailVerified)} // Optional: Disable button if not verified
      >
        Card
      </button>

      <button
        onClick={() => {
          if (user&&!user.emailVerified) {
            alert("Please verify your email to use Mpesa.");
            return;
          }
          setPaymentMethod("apple");
        }}
        className={`btn m-2 p-2 ${
          paymentMethod === "apple"
            ? "bg-yellow-500 text-white"
            : "bg-gray-200 text-blue-800"
        }`}
        disabled={(!user||!user.emailVerified)} // Optional: Disable button if not verified
      >
        Apple Pay
      </button>

      <button
        onClick={() => {
          if (user&&!user.emailVerified) {
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
        disabled={(!user||!user.emailVerified)} // Optional: Disable button if not verified
      >
        Mpesa
      </button>
      <button
        onClick={() => {
          if (user&&!user.emailVerified) {
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
        disabled={!user||!user.emailVerified} // Optional: Disable button if not verified
      >
        Crypto
      </button>
    </div>
  </div>
  {user&&!user.emailVerified && (
    <p className="text-red-500">
      Please verify your email to use payment options.
    </p>
  )}
  {["apple", "mpesa", "card"].includes(paymentMethod) && user && user.emailVerified && <Mpesa />}
  {paymentMethod === "crypto" && user && user.emailVerified && <Crypto />}
</div>

  );
}
