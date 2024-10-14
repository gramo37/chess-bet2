import {
  CRYPTO_MERCHANT_ID,
  CRYPTO_PAYOUT_API_KEY,
  CRYTPOMUS_URI,
  BACKEND_URL,
  INTASEND_IS_TEST,
  INTASEND_PUBLISHABLE_KEY,
  INTASEND_SECRET_KEY,
  INSTASEND_WITHDRAWAL_LIMIT,
} from "../constants";
import crypto from "crypto";
import { db } from "../db";
import { createHash } from ".";
import axios from "axios";
import { BACKEND_ROUTE } from "..";

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
    if (!user || !user?.id) return {
      status: false,
      message: "User Not Found"
    };
    console.log("Deposit Money to user", amount, "Received from", user);

    const IntaSend = require("intasend-node");

    let intasend = new IntaSend(
      INTASEND_PUBLISHABLE_KEY,
      INTASEND_SECRET_KEY,
      INTASEND_IS_TEST
    );

    let payouts = intasend.payouts();

    console.log("User Details", user?.name, account, amount);

    const resp = await payouts.mpesa({
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
    console.log("Payments", resp);

    // Sample response
    // {
    //   file_id: 'MRLJ08Q',
    //   device_id: null,
    //   tracking_id: '163172da-ddd2-4ca7-bb07-a965e1179c1c',
    //   batch_reference: null,
    //   status: 'Preview and approve',
    //   status_code: 'BP103',
    //   nonce: '657b2f',
    //   wallet: {
    //     wallet_id: 'Q6470JY',
    //     label: 'default',
    //     can_disburse: false,
    //     currency: 'KES',
    //     wallet_type: 'SETTLEMENT',
    //     current_balance: 133568.49,
    //     available_balance: 98668.49,
    //     updated_at: '2024-10-13T16:34:56.584884+03:00'
    //   },
    //   transactions: [
    //     {
    //       status: 'Pending',
    //       status_code: 'TP101',
    //       request_reference_id: 'e63f92a9-ea58-4242-bac6-1b3dae1cf569',
    //       name: 'Prasanna',
    //       account: '254342423423',
    //       id_number: null,
    //       bank_code: null,
    //       amount: 1000,
    //       narrative: 'Withdrawal of Money by User'
    //     }
    //   ],
    //   charge_estimate: 15,
    //   total_amount_estimate: 1015,
    //   total_amount: 1000,
    //   transactions_count: 1,
    //   created_at: '2024-10-14T07:26:22.928732+03:00',
    //   updated_at: '2024-10-14T07:26:23.040350+03:00'
    // }

    return {
      status: true,
      message: resp
    };
  } catch (error) {
    console.log("Error in payment to user", error, "" + error);
    return {
      status: false,
      message: `Error in payment to user", ${error}, ${"" + error}`
    };
  }
};

export const generateSignature = (data: string) => {
  return crypto.createHash("md5").update(data).digest("hex");
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
      url_callback: `${BACKEND_URL}/${BACKEND_ROUTE}/payments/crypto/approve/withdraw`,
      is_subtract: "1",
      order_id: checkout_id,
    };

    const bufferData = Buffer.from(JSON.stringify(payload))
      .toString("base64")
      .concat(CRYPTO_PAYOUT_API_KEY);

    const signature = generateSignature(bufferData);

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

export async function withdrawalChecks(
  amount: number,
  finalamountInUSD: number,
  account: string,
  currentBalance: number,
  user: TUser
) {
  try {
    if (!user || !user?.id)
      return {
        status: false,
        message: "Unauthorized",
      };
    if (!amount || finalamountInUSD <= 5) {
      return {
        status: false,
        message: "Please provide a valid amount to be withdrawn",
      };
    }

    if (!account) {
      return {
        status: false,
        message: "Please provide a valid account for sending amount",
      };
    }

    if (finalamountInUSD > currentBalance) {
      return {
        status: false,
        message: "Insufficient funds",
      };
    }

    if (finalamountInUSD <= INSTASEND_WITHDRAWAL_LIMIT) {
      return {
        status: false,
        message: "Amount less than minimum withdrawal amount",
      };
    }

    const games = await db.game.count({
      where: {
        OR: [{ blackPlayerId: user.id }, { whitePlayerId: user.id }],
      },
    });

    console.log("Games played by user ->", games);
    if (games < 3) {
      console.log("Less number of games played by user -> ", games);
      return {
        status: false,
        message: "Please play atleast 3 games before withdrawing money.",
      };
    }

    return {
      status: true,
    };
  } catch (error) {
    console.log(error);
    return {
      status: false,
      message: "Internal Server Error",
    };
  }
}

export async function depositChecks(
  amount: number,
  currency: string,
  finalamountInUSD: number
) {
  try {
    if (!amount || !currency) {
      return {
        status: false,
        message: "Please provide a valid amount to be deposited and currency",
      };
    }

    if (finalamountInUSD <= 5) {
      return {
        status: false,
        message: "Please provide a amount more than 5 dollars",
      };
    }
    return {
      status: true,
    };
  } catch (error) {
    console.log(error);
    return {
      status: false,
      message: "Internal Server Error",
    };
  }
}

export async function updateTransactionChecks(invoice_id: string) {
  try {
    if(!invoice_id) return {
      status: false,
      message: "Invoice ID not provided"
    }
    const IntaSend = require("intasend-node");

    let intasend = new IntaSend(
      INTASEND_PUBLISHABLE_KEY,
      INTASEND_SECRET_KEY,
      INTASEND_IS_TEST
    );

    let collection = intasend.collection();
    let resp = await collection.status(invoice_id);

    if (!resp || !resp?.invoice?.state) {
      return {
        status: false,
        message: "Transaction not found in Instasend",
      };
    }

    if (resp.invoice.state !== "COMPLETE") {
      // Don't update the DB and send a error message
      return {
        status: false,
        message: "Transaction is imcomplete in instasend",
      };
    }

    // If it is complete
    // Check in DB if the status is PENDING
    const transaction = await db.webhook.findFirst({
      where: {
        invoice_id,
      },
      select: {
        invoice_id: true,
        transaction: {
          select: {
            api_ref: true,
            status: true,
            userId: true,
            finalamountInUSD: true,
            id: true,
          },
        },
      },
    });

    if (!transaction || !transaction.transaction) {
      return {
        status: false,
        message: "Transaction not found",
      };
    }

    // If status not pending return error
    if (
      !transaction.transaction.status ||
      transaction.transaction.status !== "PENDING"
    ) {
      return {
        status: false,
        message: "Transaction already completed or cancelled",
      };
    }

    // Update transaction it as successful
    await db.$transaction([
      db.user.update({
        where: {
          // email: user.email,
          id: transaction.transaction.userId,
        },
        data: {
          balance: {
            increment: transaction.transaction.finalamountInUSD,
          },
        },
      }),
      db.transaction.update({
        where: { id: transaction.transaction.id },
        data: {
          status: "COMPLETED", // Mark transaction as completed
        },
      }),
    ]);

    return {
      status: true,
      message: resp
    };
  } catch (error) {
    console.log(error);
    return {
      status: false,
      message: "Internal Server Error",
    };
  }
}
