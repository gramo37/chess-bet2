import {
  INTASEND_IS_TEST,
  INTASEND_PUBLISHABLE_KEY,
  INTASEND_SECRET_KEY,
} from "../constants";
import crypto from "crypto";
import { db } from "../db";
import { createHash } from ".";

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
