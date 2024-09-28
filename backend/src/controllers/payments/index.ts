import { Request, Response } from "express";
import { db } from "../../db";
import {
  createTransaction,
  generateSignature,
  withdrawMPesaToUser,
} from "../../utils/payment";
import {
  CURRENCY_RATE_URL,
  HOST,
  INSTASEND_DEPOSIT_PERCENT,
  INTASEND_IS_TEST,
  INTASEND_PUBLISHABLE_KEY,
  INTASEND_SECRET_KEY,
  REDIRECT_URL,
  INSTASEND_WITHDRAWAL_LIMIT,
  CRYPTO_DEPOSIT_PERCENT,
  CRYTPOMUS_URI,
  CRYPTO_MERCHANT_ID,
  CRYPTO_API_KEY,
  NODE_ENV,
} from "../../constants";
import {
  compareHash,
  createHash,
  generateUniqueId,
  getFinalAmountInUSD,
  isValidEmail,
} from "../../utils";
import axios from "axios";

export const getMPesaURL = async (req: Request, res: Response) => {
  try {
    console.log("Deposit Money: ", req.body);
    let { amount } = req.body;
    const currency = "KES"; // All Mpesa payments are in KES
    const mode = "mpesa";
    amount = Number(amount);

    const finalamountInUSD = await getFinalAmountInUSD(amount, currency);

    if (!finalamountInUSD)
      return res
        .status(500)
        .json({ message: "Invalid currency", status: "error" });

    if (!amount || !currency) {
      return res.status(400).json({
        message: "Please provide a valid amount to be deposited and currency",
      });
    }

    if (finalamountInUSD <= 5) {
      return res.status(400).json({
        message: "Please provide a amount more than 5 dollars",
      });
    }

    const platform_charges = parseFloat(
      (finalamountInUSD * INSTASEND_DEPOSIT_PERCENT).toFixed(2)
    );

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
    console.log("NODE_ENV", NODE_ENV, NODE_ENV === "development");
    if (NODE_ENV === "development")
      console.log("Secret Token", secret_token, mode, api_ref);
    try {
      let resp = await collection.charge({
        first_name,
        last_name,
        email,
        host: HOST,
        method: "M-PESA",
        amount,
        currency,
        api_ref,
        redirect_url: `${REDIRECT_URL}/${secret_token}/${api_ref}/${mode}`, // Add some secret key here which will be stored in the transaction table and it will checked again in the success-transaction route
      });
      // console.log(`Charge Resp:`, resp);
      // TODO: GET the deducted amount and add that in the transaction table
      // if (!resp ?? !resp?.url ?? !resp?.signature ?? !resp?.id) {
      //   console.error(`Charge details Not Found!!`, resp);
      //   res.status(500).json({ message: "URL Not Found", status: "error" });
      // }
      // Store the currency in the transaction table
      // Store the amount as well in the transaction table
      console.log(
        "Payment Details ->",
        amount,
        finalamountInUSD,
        INSTASEND_DEPOSIT_PERCENT
      );
      const createRecord = await createTransaction({
        userID: user.id,
        amount,
        signature: resp.signature,
        checkout_id: resp.id,
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
        paymentDetails: resp.url,
      });
    } catch (error) {
      console.error(`Charge error 2:`, "" + error, JSON.parse("" + error));
      return res
        .status(500)
        .json({ message: "Invalid Request", status: "error" });
    }
  } catch (error) {
    console.error("Error Sending Payment URL:", error);
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

export const withdrawMPesa = async (req: Request, res: Response) => {
  try {
    let { amount, account } = req.body;
    amount = Number(amount);
    const currency = "KES"; // All Mpesa withdrawals are in KES

    const finalamountInUSD = await getFinalAmountInUSD(amount, currency);

    if (!finalamountInUSD)
      return res
        .status(500)
        .json({ message: "Invalid currency", status: "error" });

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
        .concat(CRYPTO_API_KEY);

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

export const withdrawCrypto = async (req: Request, res: Response) => {
  try {
    // const {} = req.body;
  } catch (error) {
    console.error("Error Withdrawing Crypto:", error);
    res.status(500).json({ message: "Internal server error", status: "error" });
  }
};
