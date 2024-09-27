import { Request, Response } from "express";
import { db } from "../../db";
import { generateSignature, withdrawMPesaToUser } from "../../utils/payment";
import {
  CURRENCY_RATE_URL,
  HOST,
  INSTASEND_DEPOSIT_PERCENT,
  INSTASEND_WITHDRAWAL_CHARGE,
  INTASEND_IS_TEST,
  INTASEND_PUBLISHABLE_KEY,
  INTASEND_SECRET_KEY,
  REDIRECT_URL,
  INSTASEND_WITHDRAWAL_LIMIT,
  BINANCE_SECRET_KEY,
  BINANCE_API_KEY,
} from "../../constants";
import { generateUniqueId, isValidEmail } from "../../utils";
import axios from "axios";
import crypto from "crypto";

export const getMPesaURL = async (req: Request, res: Response) => {
  try {
    console.log(
      "INSTA SEND Details",
      INTASEND_PUBLISHABLE_KEY,
      INTASEND_SECRET_KEY,
      INTASEND_IS_TEST,
      typeof INTASEND_IS_TEST
    );
    console.log("Deposit Money: ", req.body);
    let { amount } = req.body;
    const currency = "KES"; // All Mpesa payments are in KES
    amount = Math.floor(amount);

    let rates: any = {};
    try {
      const response = await axios.get(`${CURRENCY_RATE_URL}/USD`);
      rates = response.data;
    } catch (error) {
      console.log("Error fetching currency rates", error);
      return res
        .status(500)
        .json({ message: "Internal server error", status: "error" });
    }

    if (!rates || !rates?.rates || !rates?.rates?.[currency]) {
      console.log(
        `Currency "${currency}" not found in ->`,
        rates,
        rates?.rates,
        rates?.rates?.[currency]
      );
      return res
        .status(500)
        .json({ message: "Invalid currency", status: "error" });
    }

    const finalamountInUSD = parseFloat(
      (amount / rates.rates[currency]).toFixed(2)
    );

    if (!amount || finalamountInUSD <= 5 || !currency) {
      return res.status(400).json({
        message: "Please provide a valid amount to be deposited and currency",
      });
    }

    const IntaSend = require("intasend-node");
    const user: any = (req?.user as any)?.user;

    let intasend = new IntaSend(
      INTASEND_PUBLISHABLE_KEY,
      INTASEND_SECRET_KEY,
      INTASEND_IS_TEST
    );

    let collection = intasend.collection();
    let api_ref = generateUniqueId();
    const first_name = user && user?.name ? user?.name?.split(" ")?.[0] : "";
    const last_name =
      user && user?.name && user?.name?.split(" ")?.[1]
        ? user?.name?.split(" ")?.[1]
        : " ";
    const email = user?.email && isValidEmail(user?.email) ? user?.email : " ";
    const secret_token = generateUniqueId();
    console.log(
      "User Details",
      first_name,
      last_name,
      email,
      HOST,
      amount,
      currency,
      api_ref,
      `${REDIRECT_URL}/${secret_token}`
    );
    collection
      .charge({
        first_name,
        last_name,
        email,
        host: HOST,
        method: "M-PESA",
        amount,
        currency,
        api_ref,
        redirect_url: `${REDIRECT_URL}/${secret_token}`, // Add some secret key here which will be stored in the transaction table and it will checked again in the success-transaction route
      })
      .then((resp: any) => {
        // Create a transaction entry as PENDING in db
        console.log(`Charge Resp:`, resp);
        // TODO: GET the deducted amount and add that in the transaction table
        // if (!resp ?? !resp?.url ?? !resp?.signature ?? !resp?.id) {
        //   console.error(`Charge details Not Found!!`, resp);
        //   res.status(500).json({ message: "URL Not Found", status: "error" });
        // }
        // Store the currency in the transaction table
        // Store the amount as well in the transaction table
        const platform_charges = parseFloat(
          (finalamountInUSD * INSTASEND_DEPOSIT_PERCENT).toFixed(2)
        );
        console.log(
          "Payment Details ->",
          amount,
          finalamountInUSD,
          INSTASEND_DEPOSIT_PERCENT
        );
        db.transaction
          .create({
            data: {
              user: {
                connect: {
                  id: user.id,
                },
              },
              amount,
              type: "DEPOSIT",
              status: "PENDING",
              signature: resp.signature,
              checkout_id: resp.id,
              api_ref,
              currency,
              finalamountInUSD: finalamountInUSD - platform_charges,
              platform_charges,
              secret_token,
            },
          })
          .then(() => {
            // Redirect user to URL to complete payment
            res.status(200).json({
              message: "Payment request successful",
              paymentDetails: resp.url,
            });
          })
          .catch((err: any) => {
            console.error(`Charge error 1:`, "" + err, JSON.parse("" + err));
            res.status(500).json({
              message:
                "Something went wrong in adding data to transaction table",
              status: "error",
            });
          });
      })
      .catch((err: any) => {
        console.error(`Charge error 2:`, "" + err, JSON.parse("" + err));
        res.status(500).json({ message: "Invalid Request", status: "error" });
      });
  } catch (error) {
    console.error("Error Sending Payment URL:", error);
    res.status(500).json({ message: "Internal server error", status: "error" });
  }
};

export const successTransaction = async (req: Request, res: Response) => {
  try {
    const { secret_token } = req.body;
    console.log(secret_token);
    if (!secret_token) {
      return res.status(401).json({
        message: "Unauthorized Payment",
      });
    }
    // Check for the transaction using signature and checkout_id
    const transaction = await db.transaction.findFirst({
      where: {
        secret_token,
      },
      select: {
        id: true,
        userId: true,
        finalamountInUSD: true,
        status: true,
      },
    });

    console.log(transaction, "Transactions");

    if (!transaction)
      return res
        .status(404)
        .json({ message: "Transaction not found", status: "error" });

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

export const withdrawMPesa = async (req: Request, res: Response) => {
  try {
    let { amount, account } = req.body;
    amount = Math.floor(amount);
    const currency = "KES"; // All Mpesa withdrawals are in KES

    let rates: any = {};
    try {
      const response = await axios.get(`${CURRENCY_RATE_URL}/USD`);
      rates = response.data;
    } catch (error) {
      console.log("Error fetching currency rates", error);
      return res
        .status(500)
        .json({ message: "Internal server error", status: "error" });
    }

    if (!rates || !rates?.rates || !rates?.rates?.[currency]) {
      console.log(
        `Currency "${currency}" not found in ->`,
        rates,
        rates?.rates,
        rates?.rates?.[currency]
      );
      return res
        .status(500)
        .json({ message: "Invalid currency", status: "error" });
    }

    const finalamountInUSD = parseFloat(
      (amount / rates.rates[currency]).toFixed(2)
    );

    console.log("Converted KES ", amount, "in $", finalamountInUSD);

    if (!amount || finalamountInUSD <= 5) {
      return res.status(400).json({
        message: "Please provide a valid amount to be withdrawn",
      });
    }

    if (!account) {
      return res.status(400).json({
        message: "Please provide a valid account for sending amount",
      });
    }

    const user: any = (req?.user as any)?.user;
    const currentBalance = user?.balance;

    if (finalamountInUSD > currentBalance) {
      return res.status(400).json({
        message: "Insufficient funds",
      });
    }

    if (finalamountInUSD <= INSTASEND_WITHDRAWAL_LIMIT) {
      return res.status(400).json({
        message: "Amount less than minimum withdrawal amount",
      });
    }

    const games = await db.game.count({
      where: {
        OR: [{ blackPlayerId: user.id }, { whitePlayerId: user.id }],
      },
    });

    console.log("Games played by user ->", games);
    if (games < 3) {
      console.log("Less number of games played by user -> ", games);
      return res.status(401).json({
        message: "Please play atleast 3 games before withdrawing money.",
      });
    }

    // Initiate the transaction and set its status to 'PENDING'
    // const platform_charges = INSTASEND_WITHDRAWAL_CHARGE;
    const platform_charges = finalamountInUSD * 0.1;
    const transaction = await db.transaction.create({
      data: {
        userId: user.id,
        amount: amount,
        type: "WITHDRAWAL",
        status: "PENDING",
        // TODO: Temporary change
        signature: "",
        checkout_id: "",
        finalamountInUSD: finalamountInUSD - platform_charges,
        platform_charges,
      },
    });

    // Attempt to send the amount to the user's account
    const withdrawSuccess = await withdrawMPesaToUser(amount, account, user);

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
          status: "COMPLETED",
        },
      }),
    ]);

    res.status(200).json({
      message: "Money withdrawal initiated! Kindly wait till it is approved.",
      transaction, // Return the transaction object
    });
  } catch (error) {
    console.error("Error withdrawing Money:", error);
    res.status(500).json({ message: "Internal server error", status: "error" });
  }
};

export const transactionHistory = async (req: Request, res: Response) => {
  try {
    const user: any = (req?.user as any)?.user;
    console.log("working2");

    const transactions = await db.transaction.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        amount: true,
        currency: true,
        finalamountInUSD: true,
        type: true,
        status: true,
        createdAt: true,
      },
    });

    res.status(200).json({
      message: "Transaction history retrieved successfully!",
      transactions,
    });
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    res.status(500).json({ message: "Internal server error", status: "error" });
  }
};

export const getCryptoURL = async (req: Request, res: Response) => {
  try {
    const { amount, currency } = req.body;
    const user: any = (req?.user as any)?.user;
    const userId = user?.id;

    if (!amount || !currency || !userId) {
      console.log(amount, currency, userId);
      return res.status(400).json({ error: "Missing required fields" });
    }

    const binanceApiUrl =
      "https://bpay.binanceapi.com/binancepay/openapi/v3/order";
    const payload = {
      merchantTradeNo: `TXN-${Date.now()}`, // Unique transaction number
      amount,
      currency,
      goods: {
        goodsType: "01",
        goodsCategory: "0000",
        referenceGoodsId: "123456",
        goodsName: "Crypto Payment",
        goodsDetail: "Payment for services",
      },
      returnUrl: "http://localhost:3000/payments", // Redirect after successful payment
      cancelUrl: "http://yourdomain.com/cancelled",
      userId, // Custom user ID for tracking
    };

    // Generate signature
    const signature = generateSignature(
      JSON.stringify(payload),
      BINANCE_SECRET_KEY
    );
    // return res.status(200).json({
    //   message: "Payment success",
    //   signature
    // })
    try {
      const response = await axios.post(binanceApiUrl, payload, {
        headers: {
          "Content-Type": "application/json",
          "BinancePay-Timestamp": `${Date.now()}`,
          "BinancePay-Certificate-SN": BINANCE_API_KEY,
          "BinancePay-Signature": signature,
        },
      });

      if (response.data && response.data.status === "SUCCESS") {
        const paymentLink = response.data.data.checkoutUrl;
        const secretToken = crypto.randomBytes(16).toString("hex"); // Create a secret token

        // Store the transaction and secretToken in your database

        res.json({
          message: "Payment link created",
          paymentLink,
          secretToken,
        });
      } else {
        res.status(400).json({ error: "Failed to create payment link" });
      }
    } catch (error) {
      console.error("Error Sending Crypto Payment URL1:", error);
      res
        .status(500)
        .json({ message: "Internal server error", status: "error" });
    }
  } catch (error) {
    console.error("Error Sending Crypto Payment URL2:", error);
    res.status(500).json({ message: "Internal server error", status: "error" });
  }
};
