import { Request, Response } from "express";
import {
  createTransaction,
  depositChecks,
  generateSignature,
  withdrawalChecks,
  withdrawCryptoToUser,
} from "../../utils/payment";
import {
  CRYPTO_DEPOSIT_PERCENT,
  CRYTPOMUS_URI,
  CRYPTO_MERCHANT_ID,
  CRYPTO_PAYMENT_API_KEY,
  NODE_ENV,
  BACKEND_URL,
  FRONTEND_URL,
} from "../../constants";
import { generateUniqueId, getFinalAmountInUSD } from "../../utils";
import axios from "axios";
import { db } from "../../db";
import { BACKEND_ROUTE } from "../..";

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

    const depositCheck = await depositChecks(
      amount,
      currency,
      finalamountInUSD
    );

    if (!depositCheck.status) {
      return res.status(400).json({
        status: false,
        message: depositCheck.message,
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
        url_callback: `${BACKEND_URL}/${BACKEND_ROUTE}/payments/crypto/success/transaction`,
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
        checkout_id: data.result.order_id,
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

export const successTransaction = async (req: any, res: Response) => {
  try {
    const { order_id, sign } = req.body;

    console.log("NODE_ENV", NODE_ENV, NODE_ENV === "development");
    if (NODE_ENV === "development") console.log("Order id", order_id);

    if (!sign) {
      return res.status(401).json({
        status: false,
        message: "Unauthorized User",
      });
    }

    const data = JSON.parse(req.rawBody);

    delete data.sign;

    const bufferData = Buffer.from(JSON.stringify(data))
      .toString("base64")
      .concat(CRYPTO_PAYMENT_API_KEY);

    const hash = generateSignature(bufferData);

    if (hash !== sign) {
      return res.status(401).json({
        message: "Unauthorized Transaction",
        status: "error",
      });
    }

    // Check for the transaction using signature and checkout_id
    const transaction = await db.transaction.findFirst({
      where: {
        checkout_id: order_id,
        mode: "crypto",
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

    // Check for if the transaction is pending
    if (transaction.status !== "PENDING") {
      return res.status(401).json({
        message: "Transaction already completed, cancelled or requested",
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

    res.redirect(`${FRONTEND_URL}/account`);
  } catch (error) {
    console.error("Internal Error:", error);
    res.status(500).json({ message: "Internal server error", status: "error" });
  }
};

export const withdraw = async (req: Request, res: Response) => {
  try {
    let { amount, account, currency } = req.body;
    amount = Number(amount);
    const user: any = (req?.user as any)?.user;
    const currentBalance = user?.balance;

    const finalamountInUSD = await getFinalAmountInUSD(amount, currency);

    if (!finalamountInUSD)
      return res
        .status(500)
        .json({ message: "Invalid currency or amount", status: "error" });

    const withdrawalCheck = await withdrawalChecks(
      amount,
      finalamountInUSD,
      account,
      currentBalance,
      user
    );

    if (!withdrawalCheck.status) {
      return res.status(400).json({
        status: false,
        message: withdrawalCheck.message,
      });
    }

    // Initiate the transaction and set its status to 'PENDING'
    const platform_charges = finalamountInUSD * 0.1;
    const checkout_id = generateUniqueId();
    const transaction = await db.transaction.create({
      data: {
        userId: user.id,
        amount: amount,
        type: "WITHDRAWAL",
        status: "PENDING",
        // TODO: Temporary change
        signature: "",
        checkout_id,
        finalamountInUSD: finalamountInUSD - platform_charges,
        platform_charges,
        mode: "mpesa",
      },
    });

    const withdrawSuccess = await withdrawCryptoToUser(
      amount,
      account,
      user,
      checkout_id
    );

    if (!withdrawSuccess) {
      // If sending to the user failed, update transaction status to 'CANCELLED'
      await db.transaction.update({
        where: { id: transaction.id },
        data: {
          status: "CANCELLED",
        },
      });
      return res.status(500).json({
        message:
          "Something went wrong when sending money to the user's account",
      });
    }

    // If sending to the user succeeded, update balance and mark transaction as 'COMPLETED'
    await db.$transaction([
      db.user.update({
        where: {
          email: user.email,
        },
        data: {
          balance: currentBalance - finalamountInUSD,
        },
      }),
      db.transaction.update({
        where: { id: transaction.id },
        data: {
          status: "REQUESTED",
        },
      }),
    ]);

    res.status(200).json({
      message: "Money withdrawal initiated! Kindly wait till it is approved.",
      transaction, // Return the transaction object
    });
  } catch (error) {
    console.log(error),
      res
        .status(500)
        .json({ message: "Internal server error", status: "error" });
  }
};

// Callback for approving crypto withdrawals
// Update the status of transaction to COMPLETED
export const approveWithdrawal = async (req: any, res: Response) => {
  try {
    const { order_id, sign } = req.body;

    console.log("NODE_ENV", NODE_ENV, NODE_ENV === "development");
    if (NODE_ENV === "development") console.log("Order id", order_id);

    if (!sign) {
      return res.status(401).json({
        status: false,
        message: "Unauthorized User",
      });
    }

    const data = JSON.parse(req.rawBody);

    delete data.sign;

    const bufferData = Buffer.from(JSON.stringify(data))
      .toString("base64")
      .concat(CRYPTO_PAYMENT_API_KEY);

    const hash = generateSignature(bufferData);

    if (hash !== sign) {
      return res.status(401).json({
        message: "Unauthorized Transaction",
        status: "error",
      });
    }

    // Check for the transaction using signature and checkout_id
    const transaction = await db.transaction.findFirst({
      where: {
        checkout_id: order_id,
        mode: "crypto",
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

    // Check for if the transaction is pending
    if (transaction.status !== "REQUESTED") {
      return res.status(401).json({
        message: "Transaction is pending, completed or cancelled",
        status: "error",
      });
    }

    // Update transaction it as successful
    await db.transaction.update({
      where: { id: transaction.id },
      data: {
        status: "COMPLETED", // Mark transaction as completed
      },
    }),
      res.redirect(`${FRONTEND_URL}/account`);
  } catch (error) {
    console.error("Error Approving Crypto Withdrawal:", error);
    res.status(500).json({ message: "Internal server error", status: "error" });
  }
};
