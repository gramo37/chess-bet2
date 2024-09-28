import { Request, Response } from "express";
import { createTransaction, generateSignature } from "../../utils/payment";
import {
  REDIRECT_URL,
  CRYPTO_DEPOSIT_PERCENT,
  CRYTPOMUS_URI,
  CRYPTO_MERCHANT_ID,
  CRYPTO_PAYMENT_API_KEY,
  NODE_ENV,
} from "../../constants";
import {
  compareHash,
  generateUniqueId,
  getFinalAmountInUSD,
} from "../../utils";
import axios from "axios";
import { db } from "../../db";

export const getURL = async (req: Request, res: Response) => {
  try {
    let { amount, currency } = req.body;
    const user: any = (req?.user as any)?.user;
    const mode = "crypto";

    amount = Number(amount);

    const finalamountInUSD = await getFinalAmountInUSD(amount, currency);

    if (!finalamountInUSD)
      return res
        .status(500)
        .json({ message: "Invalid currency", status: "error" });

    if (!amount || finalamountInUSD <= 5 || !currency) {
      return res.status(400).json({
        message: "Please provide a valid amount to be deposited and currency",
        status: "error",
      });
    }

    const platform_charges = parseFloat(
      (finalamountInUSD * CRYPTO_DEPOSIT_PERCENT).toFixed(2)
    );

    // Main Crypto related coding
    const secret_token = generateUniqueId();
    let api_ref = generateUniqueId();
    try {
      const payload = {
        amount: finalamountInUSD,
        currency: "USD",
        order_id: api_ref,
        url_callback: `${REDIRECT_URL}/${secret_token}/${api_ref}/${mode}`,
      };

      const bufferData = Buffer.from(JSON.stringify(payload))
        .toString("base64")
        .concat(CRYPTO_PAYMENT_API_KEY);

      const signature = generateSignature(bufferData);

      const { data } = await axios.post(`${CRYTPOMUS_URI}/payment`, payload, {
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
        return res
          .status(500)
          .json({ message: "Internal server error", status: "error" });
      }

      const createRecord = await createTransaction({
        userID: user.id,
        amount,
        signature,
        checkout_id: data.result.order_id, // We will get this from data
        api_ref,
        currency,
        finalamountInUSD,
        platform_charges,
        secret_token,
        mode,
      });

      if (!createRecord) {
        console.error("Something went wrong while creating a transaction");
        return res.status(500).json({
          message: "Something went wrong in adding data to transaction table",
          status: "error",
        });
      }

      res.status(200).json({
        message: "Payment request successful",
        paymentDetails: data.result.url, // We will get this from data
      });
    } catch (error) {
      console.log(
        "Something went wrong while creating order",
        error,
        "" + error
      );
      return res.status(500).json({
        message: "Something went wrong while creating order",
      });
    }
  } catch (error) {
    console.error("Error Sending Crypto Payment URL2:", error);
    res.status(500).json({ message: "Internal server error", status: "error" });
  }
};

export const successTransaction = async (req: Request, res: Response) => {
  try {
    const { secret_token, mode, api_ref } = req.body;

    console.log("NODE_ENV", NODE_ENV, NODE_ENV === "development");
    if (NODE_ENV === "development")
      console.log("Secret Token", secret_token, mode, api_ref);

    if (!secret_token || !mode) {
      return res.status(401).json({
        message: "Unauthorized Payment",
      });
    }
    // Check for the transaction using signature and checkout_id
    const transaction = await db.transaction.findFirst({
      where: {
        api_ref,
        mode,
      },
      select: {
        id: true,
        userId: true,
        finalamountInUSD: true,
        status: true,
        secret_token: true,
      },
    });

    if (!transaction)
      return res
        .status(404)
        .json({ message: "Transaction not found", status: "error" });

    const isValidTransaction = await compareHash(
      secret_token,
      transaction.secret_token
    );

    if (!isValidTransaction) {
      return res.status(401).json({
        message: "Unauthorized Transaction",
        status: "error",
      });
    }

    // Check for if the transaction is pending
    if (transaction.status !== "PENDING") {
      return res.status(401).json({
        message: "Transaction already completed or cancelled",
        status: "error",
      });
    }

    // Update transaction it as successful
    await db.$transaction([
      db.user.update({
        where: {
          // email: user.email,
          id: transaction.userId,
        },
        data: {
          balance: {
            increment: transaction.finalamountInUSD,
          },
        },
      }),
      db.transaction.update({
        where: { id: transaction.id },
        data: {
          status: "COMPLETED", // Mark transaction as completed
        },
      }),
    ]);

    res.status(200).json({
      message: "Payment Successful",
    });
  } catch (error) {
    console.error("Internal Error:", error);
    res.status(500).json({ message: "Internal server error", status: "error" });
  }
};

// Callback for approving crypto withdrawals
// Update the status of transaction to COMPLETED
export const approveWithdrawal = async (req: Request, res: Response) => {
  try {
    const {} = req.body;
  } catch (error) {
    console.error("Error Approving Crypto Withdrawal:", error);
    res.status(500).json({ message: "Internal server error", status: "error" });
  }
};
