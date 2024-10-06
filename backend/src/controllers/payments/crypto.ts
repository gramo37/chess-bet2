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
  BINANCE_API_KEY,
  BINANCE_SECRET_KEY,
  PLATFORM_FEES,
} from "../../constants";
import { generateUniqueId, getFinalAmountInUSD } from "../../utils";
import axios from "axios";
import { db } from "../../db";
import { BACKEND_ROUTE } from "../..";
import { cloneDeep } from "lodash";

// Function to get the USD price of a cryptocurrency (BTC, ETH)
export async function convertCryptoToUSD(symbol: string, amount: number) {
  try {
    // Get the latest price for the symbol (e.g., BTCUSDT, ETHUSDT)
    console.log("NODE_ENV", NODE_ENV, NODE_ENV === "development");

    if (NODE_ENV === "development")
      console.log("Secret Token", BINANCE_API_KEY, BINANCE_SECRET_KEY);

    const Binance = require("binance-api-node").default;
    const client = Binance({
      apiKey: BINANCE_API_KEY,
      apiSecret: BINANCE_SECRET_KEY,
    });

    const prices = await client.prices();

    // Symbol example: 'BTCUSDT' for Bitcoin to USD, 'ETHUSDT' for Ethereum to USD
    const cryptoSymbol = `${symbol.toUpperCase()}USDT`; // e.g., 'BTCUSDT' or 'ETHUSDT'

    // Get the current price in USD
    const usdPrice = parseFloat(prices[cryptoSymbol]);

    if (!usdPrice) {
      throw new Error(`Price not available for ${symbol}`);
    }

    // Calculate the equivalent USD value for the given crypto amount
    const usdValue = usdPrice * amount;

    console.log(
      `${amount} ${symbol} is equivalent to $${usdValue.toFixed(2)} USD`
    );
    return usdValue;
  } catch (error: any) {
    console.error("Error fetching price:", error.message);
  }
}

function matchTransactions(dbTransactions: any[], transactions: any[]) {
  // Create a copy of transactions array to keep track of used transactions
  const availableTransactions = cloneDeep(transactions); // [...transactions];

  // Iterate over each dbTransaction
  dbTransactions.forEach((dbTransaction) => {
    // Find the first matching transaction
    const matchingIndex = availableTransactions.findIndex(
      (transaction) =>
        transaction.address === dbTransaction.wallet_address &&
        transaction.amount === dbTransaction.amount &&
        transaction.coin === dbTransaction.currency
    );

    // If a matching transaction is found
    if (matchingIndex !== -1) {
      // Assign the txId to the dbTransaction
      dbTransaction.txId = availableTransactions[matchingIndex].txId;

      // Remove the used transaction from the availableTransactions array
      availableTransactions.splice(matchingIndex, 1);
    }
  });

  return dbTransactions;
}

export const checkTransactionStatus = async () => {
  try {
    // Get all successful transactions for past 15 mins
    const currentTime = Date.now();
    // Set the start time to 15 minutes ago
    const fifteenMinutesAgo = currentTime - 15 * 60 * 1000;

    if (NODE_ENV === "development")
      console.log("Secret Token", BINANCE_API_KEY, BINANCE_SECRET_KEY);

    const Binance = require("binance-api-node").default;
    const client = Binance({
      apiKey: BINANCE_API_KEY,
      apiSecret: BINANCE_SECRET_KEY,
    });
    const transactions = await client.depositHistory({
      status: 1,
      startTime: fifteenMinutesAgo,
      endTime: currentTime,
    });
    console.log(
      `Success Transactions between ${new Date(
        fifteenMinutesAgo
      )} and ${new Date(currentTime)}`
    );
    console.log(transactions);
    console.log("Transaction Count: ", transactions.length);

    if (!transactions || transactions.length === 0) {
      return;
    }

    const conditions = transactions.map((transaction: any) => {
      return {
        wallet_address: transaction.address,
        amount: transaction.amount,
        mode: "crypto",
        currency: transaction.coin,
        status: "PENDING",
      };
    });

    let dbTransactions = await db.transaction.findMany({
      where: {
        OR: conditions,
      },
    });

    if (!dbTransactions || dbTransactions.length === 0) {
      console.log("No pending transactions found in DB");
      return;
    }

    dbTransactions = matchTransactions(dbTransactions, transactions);

    console.log("Combined Transactions", dbTransactions);

    for (let i = 0; i < dbTransactions.length; i++) {
      const dbTransaction = transactions[i];
      console.log(dbTransaction);

      await db.$transaction([
        db.transaction.update({
          where: {
            id: dbTransaction.id,
          },
          data: {
            status: "COMPLETED",
            api_ref: dbTransaction.txId,
          },
        }),
        db.user.update({
          where: {
            id: dbTransaction.userId,
          },
          data: {
            balance: {
              increment: dbTransaction.finalamountInUSD,
            },
          },
        }),
      ]);

      console.log("Transaction for ", dbTransaction, "updated");
      console.log(
        "Balance updated for User -> ",
        dbTransaction?.userId,
        "with $",
        dbTransaction?.finalamountInUSD
      );
    }
  } catch (error) {
    console.error("Currency conversion error:", error);
    throw new Error("Unable to convert currency.");
  }
};

export const getId = async (req: Request, res: Response) => {
  try {
    let { address, amount, currency } = req.body;
    const user: any = (req?.user as any)?.user;
    const mode = "crypto";

    amount = Number(amount);

    if (NODE_ENV === "development")
      console.log("Secret Token", BINANCE_API_KEY, BINANCE_SECRET_KEY);

    const Binance = require("binance-api-node").default;
    const client = Binance({
      apiKey: BINANCE_API_KEY,
      apiSecret: BINANCE_SECRET_KEY,
    });

    if (!amount || !currency || !address)
      return res.status(404).json({
        status: "error",
        message: "Please provide amount, currency, address",
      });

    const finalamountInUSD = await convertCryptoToUSD(currency, amount);

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

    await db.transaction.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        amount,
        type: "DEPOSIT",
        status: "PENDING",
        signature: "",
        checkout_id: "",
        mode,
        currency,
        platform_charges: finalamountInUSD * PLATFORM_FEES,
        finalamountInUSD,
        wallet_address: address,
      },
    });

    const depositAddress = await client.depositAddress({
      coin: currency,
      // network: network,
    });

    console.log(`Deposit Address for ${currency}: ${depositAddress.address}`);

    res.status(200).json({
      message: "success",
      wallet_address: depositAddress.address,
    });
  } catch (error) {
    console.error("Error Sending Crypto Payment URL2:", error);
    res.status(500).json({ message: "Internal server error", status: "error" });
  }
};

export const withdrawCrypto = async (req: Request, res: Response) => {
  try {
    let { amount, address, currency } = req.body;
    amount = Number(amount);
    const user: any = (req?.user as any)?.user;
    const currentBalance = user?.balance;

    if (!amount || !currency || !address)
      return res.status(404).json({
        status: "error",
        message: "Please provide amount, currency, address",
      });

    const finalamountInUSD = await convertCryptoToUSD(currency, amount);

    if (!finalamountInUSD)
      return res
        .status(500)
        .json({ message: "Invalid currency", status: "error" });

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

    const platform_charges = finalamountInUSD * PLATFORM_FEES;
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
        mode: "crypto",
      },
    });

    try {
      if (NODE_ENV === "development")
        console.log("Secret Token", BINANCE_API_KEY, BINANCE_SECRET_KEY);

      const Binance = require("binance-api-node").default;
      const client = Binance({
        apiKey: BINANCE_API_KEY,
        apiSecret: BINANCE_SECRET_KEY,
      });
      const result = await client.withdraw({
        asset: currency, // e.g., BTC, ETH, USDT
        address: address,
        amount: amount,
      });
      // TODO: Store the result in txn id column
      const txn_id = result.id;

      await db.$transaction([
        db.user.update({
          where: {
            id: transaction.userId,
          },
          data: {
            balance: currentBalance - finalamountInUSD,
          },
        }),
        db.transaction.update({
          where: { id: transaction.id },
          data: {
            status: "COMPLETED",
            api_ref: txn_id,
          },
        }),
      ]);
      res.status(200).json({
        message: "Money withdrawal successfull!",
        transaction, // Return the transaction object
      });
    } catch (error) {
      console.log(error);
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
  } catch (error) {
    console.error("Error Sending Crypto Payment URL2:", error);
    res.status(500).json({ message: "Internal server error", status: "error" });
  }
};

// Not used
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
      (finalamountInUSD * PLATFORM_FEES).toFixed(2)
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

// Not used
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

// Not used
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
    const platform_charges = finalamountInUSD * PLATFORM_FEES;
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
// Not used
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
