import {
  CRYPTO_MERCHANT_ID,
  CRYPTO_PAYOUT_API_KEY,
  CRYTPOMUS_URI,
  BACKEND_URL,
  INTASEND_IS_TEST,
  INTASEND_PUBLISHABLE_KEY,
  INTASEND_SECRET_KEY,
} from "../constants";
import crypto from "crypto";
import { db } from "../db";
import { createHash } from ".";
import axios from "axios";

type TUser = {
  id: string;
  name: string | null;
  email: string;
  rating: number;
  balance: number;
} | null;

export const withdrawMPesaToUser = async (
  amount: number,
  account: string,
  user: TUser
) => {
  try {
    if (!user || !user?.id) return false;
    console.log("Deposit Money to user", amount, "Received from", user);

    const IntaSend = require("intasend-node");

    let intasend = new IntaSend(
      INTASEND_PUBLISHABLE_KEY,
      INTASEND_SECRET_KEY,
      INTASEND_IS_TEST
    );

    let payouts = intasend.payouts();

    console.log("User Details", user?.name, account, amount);

    await payouts.mpesa({
      currency: "KES",

      transactions: [
        {
          name: user?.name ?? "",
          account,
          amount,
          narrative: "Withdrawal of Money by User",
        },
      ],
    });
    return true;
  } catch (error) {
    console.log("Error in payment to user", error, "" + error);
    return false;
  }
};

export const withdrawCryptoToUser = async (
  amount: number,
  account: string,
  user: TUser,
  checkout_id: string
) => {
  try {
    const url = `${CRYTPOMUS_URI}/payout`;

    const payload = {
      amount,
      currency: "USDT",
      network: "TRON",
      address: account,
      url_callback: `${BACKEND_URL}/payments/update-withdrawal`,
      is_subtract: "1",
      order_id: checkout_id,
    };

    const bufferData = Buffer.from(JSON.stringify(payload))
      .toString("base64")
      .concat(CRYPTO_PAYOUT_API_KEY);

      const signature = generateSignature(bufferData);
      console.log("Payout details", CRYPTO_PAYOUT_API_KEY, CRYPTO_MERCHANT_ID, url, signature);

    const { data } = await axios.post(url, payload, {
      headers: {
        merchant: CRYPTO_MERCHANT_ID,
        sign: signature,
        "Content-Type": "application/json",
      },
    });

    if (
      !data ||
      !data?.result ||
      !data?.result?.url ||
      !data?.result?.order_id
    ) {
      console.error("Data not received from cryptomus");
      return false;
    }

    return true;
  } catch (error) {
    console.log("Error in payment to user", error, "" + error);
    return false;
  }
};

export const generateSignature = (data: string) => {
  return crypto.createHash("md5").update(data).digest("hex");
};

export async function createTransaction({
  userID,
  amount,
  signature,
  checkout_id,
  api_ref,
  currency,
  finalamountInUSD,
  platform_charges,
  secret_token,
  mode,
}: {
  userID: string;
  amount: number;
  signature: string;
  checkout_id: string;
  api_ref: string;
  currency: string;
  finalamountInUSD: number;
  platform_charges: number;
  secret_token: string;
  mode: string;
}) {
  try {
    const encrpted_secret_token = await createHash(secret_token);
    await db.transaction.create({
      data: {
        user: {
          connect: {
            id: userID,
          },
        },
        amount,
        type: "DEPOSIT",
        status: "PENDING",
        signature,
        checkout_id,
        api_ref,
        currency,
        finalamountInUSD: finalamountInUSD - platform_charges,
        platform_charges,
        secret_token: encrpted_secret_token, // TODO: Bcrypt this before saving
        mode,
      },
    });
    return true;
  } catch (error) {
    console.error(`Charge error 1:`, "" + error, JSON.parse("" + error));
    return false;
  }
}
