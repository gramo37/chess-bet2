import { Request, Response } from "express";
import axios from "axios";
import crypto from "crypto";

import {
  BACKEND_URL,
  INSTASEND_DEPOSIT_PERCENT,
  NOWPAYMENTS_API_KEY,
  NOWPAYMENTS_API_URL,
  NOWPAYMENTS_IPN_KEY,
  PLATFORM_FEES,
} from "../../constants";
import { BACKEND_ROUTE } from "../..";
import { processWebhook } from "../../queue/cryptoWebhookQueue";
import {
  createTransaction,
  depositChecks,
  updateCryptoTransactionChecks,
  withdrawalChecks,
  withdrawCryptoToUser,
} from "../../utils/payment";
import { db } from "../../db";
import { processCommissionDeposit } from "./mpesa";
import { generateUniqueId } from "../../utils";
import { sendWithdrawalRequestNotification } from "../auth/verify";

export const createPaymentUrl = async (coin: string, amount: number) => {
  const paymentData = {
    price_amount: amount,
    price_currency: "usd", // Adjust as needed
    pay_currency: coin,
    order_id: `order_${Date.now()}`,
    ipn_callback_url: `${BACKEND_URL}/${BACKEND_ROUTE}/payments/crypto/validate/transaction`,
  };

  console.log(NOWPAYMENTS_API_KEY, NOWPAYMENTS_API_URL, paymentData);

  const response = await axios.post(
    `${NOWPAYMENTS_API_URL}/invoice`,
    paymentData,
    {
      headers: {
        "x-api-key": NOWPAYMENTS_API_KEY,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

export const getNOWPaymentsURL = async (req: Request, res: Response) => {
  try {
    console.log("Deposit Money: ", req.body);
    let { currency, amount, platform_charges } = req.body;
    const mode = "crypto";
    amount = Number(amount);
    platform_charges = Number(platform_charges);

    if (!amount || !platform_charges) {
      console.log(amount, platform_charges);
      return res.status(400).json({
        status: false,
        message: "Please provide a valid amount to be deposited",
      });
    }

    if (!currency) {
      return res.status(400).json({
        status: false,
        message: "Please provide a valid currency",
      });
    }

    const finalamountInUSD = Number(amount);

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

    // const platform_charges = parseFloat(
    //   (finalamountInUSD * PLATFORM_FEES).toFixed(2)
    // );

    const user: any = (req?.user as any)?.user;

    try {
      const resp = await createPaymentUrl(currency, amount);
      console.log(
        "Payment Details ->",
        amount,
        finalamountInUSD,
        INSTASEND_DEPOSIT_PERCENT
      );
      const createRecord = await createTransaction({
        userID: user.id,
        amount,
        signature: resp.token_id,
        checkout_id: resp.id,
        api_ref: resp.order_id,
        currency,
        finalamountInUSD,
        platform_charges,
        secret_token: resp.token_id,
        mode,
      });

      if (!createRecord) {
        console.error("Something went wrong while creating a transaction");
        return res.status(500).json({
          message: "Something went wrong in adding data to transaction table",
          status: "error",
        });
      }

      res.json({
        message: "Payment request successful",
        paymentDetails: resp.invoice_url,
        resp,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to create payment" });
    }
  } catch (error) {
    console.error("Error Sending Crypto Payment URL:", error);
    res.status(500).json({ message: "Internal server error", status: "error" });
  }
};

function sortObject(obj: any) {
  return Object.keys(obj)
    .sort()
    .reduce((result: any, key) => {
      result[key] =
        obj[key] && typeof obj[key] === "object"
          ? sortObject(obj[key])
          : obj[key];
      return result;
    }, {});
}

export const verifySignature = (payload: any, signature: string): boolean => {
  const payloadString = JSON.stringify(sortObject(payload));
  const hmac = crypto.createHmac("sha512", NOWPAYMENTS_IPN_KEY);
  hmac.update(payloadString);
  const calculatedSignature = hmac.digest("hex");
  console.log(
    "Signature calculations",
    NOWPAYMENTS_IPN_KEY,
    calculatedSignature,
    signature,
    calculatedSignature === signature
  );
  return calculatedSignature === signature;
};

// Add process to queue
export const addWebhook = async (req: Request, res: Response) => {
  try {
    // Verify signature before adding the process to queue
    const signature = req.headers["x-nowpayments-sig"] as string;
    const body = req.body;

    if (!verifySignature(body, signature)) {
      console.log(
        "Webhook addition Failed: Invalid signature",
        body,
        signature
      );
      return res.status(401).json({ error: "Invalid signature" });
    }

    const fullUrl = "https" + "://" + req.get("host") + req.originalUrl;
    // const fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
    console.log("Building the full URL", fullUrl);

    const webhookData = {
      url: `${fullUrl}/webhook`, // Webhook target URL
      payload: req.body, // Data from the request body
    };

    await processWebhook(webhookData);

    res.status(200).json({
      status: "success",
      message: "Webhook added successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Webhook handling failed" });
  }
};

export const validateTransaction = async (req: Request, res: Response) => {
  try {
    const { payment_status, invoice_id, order_id } = req.body;
    // Invoice_id is checkout_id in DB
    // order_id is api_ref in DB

    console.log(
      "--------------------------------------------------------------------------------Triggering webhook for crypto deposits --------------------------------------------------------------------------------------------"
    );
    console.log(payment_status, invoice_id, order_id);

    // Check for api_ref and match it
    const transaction = await db.transaction.findFirst({
      where: {
        api_ref: order_id,
        checkout_id: String(invoice_id),
        type: "DEPOSIT",
      },
      select: {
        id: true,
        userId: true,
        finalamountInUSD: true,
        status: true,
        platform_charges: true,
        secret_token: true,
      },
    });

    if (!transaction) {
      console.log("Transaction not found");
      return res
        .status(404)
        .json({ message: "Transaction not found", status: "error" });
    }

    console.log("Transaction for deposit found -> ", transaction);

    try {
      if (payment_status === "failed") {
        console.log(
          "Updating DB..",
          "Transaction",
          transaction.id,
          "has been CANCELLED"
        );

        await db.transaction.update({
          where: { id: transaction.id },
          data: {
            status: "CANCELLED",
          },
        });

        return res.status(400).json({
          message: `Status is ${payment_status}`,
          status: "error",
        });
      }

      if (payment_status !== "finished") {
        console.log("Payment is", payment_status);

        return res.status(400).json({
          message: `Status is ${payment_status}`,
          status: "error",
        });
      }

      // Check for if the transaction is pending
      if (transaction.status !== "PENDING") {
        console.log(
          "Transaction already completed with status -> ",
          transaction.status
        );
        return res.status(401).json({
          message: "Transaction already completed or cancelled",
          status: "error",
        });
      }

      // Update transaction it as successful
      console.log(
        "Updating DB and balance by",
        transaction.finalamountInUSD,
        "Transaction",
        transaction.id,
        "has been COMPLETED"
      );
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
        ...((await processCommissionDeposit(
          transaction.userId,
          transaction.finalamountInUSD - transaction.platform_charges
        )) || []), // Process the commission if there's a referrer
      ]);

      console.log("Payment Completed");
      res.status(200).json({
        message: "Payment Successful",
      });
    } catch (error) {
      console.log("Something went wrong in updating the balances", error);
      await db.transaction.update({
        where: { id: transaction.id },
        data: {
          status: "ERROR",
        },
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Webhook handling failed" });
  }
};

export const updateTransaction = async (req: Request, res: Response) => {
  try {
    const { invoice_id } = req.body;
    try {
      const transactionCheck = await updateCryptoTransactionChecks(invoice_id);

      if (!transactionCheck.status) {
        return res.status(400).json({
          status: false,
          message: transactionCheck.message,
        });
      }
    } catch (error) {
      console.log(
        "Something went wrong while fetching the transaction from Instasend",
        error
      );
      res.status(500).json({ message: "Instasend error", status: "error" });
    }
  } catch (error) {
    console.error("Error Fetching Transaction:", error);
    res.status(500).json({ message: "Internal server error", status: "error" });
  }
};

export const withdraw = async (req: Request, res: Response) => {
  try {
    let { amount, address, coin, platform_charges } = req.body;
    amount = Number(amount);
    const user: any = (req?.user as any)?.user;
    const currentBalance = user?.balance;
    const finalamountInUSD = amount;

    const withdrawalCheck = await withdrawalChecks(
      amount,
      finalamountInUSD,
      address,
      currentBalance,
      user
    );

    if (!withdrawalCheck.status) {
      return res.status(400).json({
        status: false,
        message: withdrawalCheck.message,
      });
    }

    // Check for balance in user's account
    // const url = `${NOWPAYMENTS_API_URL}/balance`;

    // const { data } = await axios.get(url, {
    //   headers: {
    //     "x-api-key": NOWPAYMENTS_API_KEY,
    //     "Content-Type": "application/json",
    //   },
    // });

    // console.log("Pending balance ->", data)
    // if(data.amount < amount) {
    //   return res.status(400).json({ message: "NOWPayments balance are insufficient. Kindly connect the support.", status: "error" })
    // }

    // Validate address
    try {
      const url = `${NOWPAYMENTS_API_URL}/payout/validate-address`;
  
      const { data } = await axios.post(url, {
        address,
        currency: coin
      }, {
        headers: {
          "x-api-key": NOWPAYMENTS_API_KEY,
          "Content-Type": "application/json",
        },
      });
  
      console.log("Address validation", data)
    } catch (error) {
      console.log(error)
      return res.status(400).json({
        success: "error",
        message: "Wrong wallet address given"
      })
    }

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
        mode: "crypto",
        api_ref: checkout_id, // Prevent api_ref should be unique error
        currency: coin,
      },
    });

    // Attempt to send the amount to the user's account
    const withdrawSuccess = await withdrawCryptoToUser(
      amount,
      address,
      coin,
      user
    );

    if (!withdrawSuccess.status) {
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
          status: "COMPLETED",
          api_ref: withdrawSuccess.message.tracking_id,
        },
      }),
    ]);

    // try {
    //   sendWithdrawalRequestNotification(
    //     transaction.finalamountInUSD,
    //     transaction.id
    //   );
    // } catch (error) {
    //   console.log(error);
    // }
    res.status(200).json({
      message: "Your money withdrawal is successful",
      transaction, // Return the transaction object
    });
  } catch (error) {
    console.error("Error Fetching Transaction:", error);
    res.status(500).json({ message: "Internal server error", status: "error" });
  }
};
