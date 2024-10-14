import { Request, Response } from "express";
import { db } from "../../db";
import {
  createTransaction,
  depositChecks,
  updateTransactionChecks,
  withdrawalChecks,
  withdrawMPesaToUser,
} from "../../utils/payment";
import {
  FRONTEND_URL,
  INSTASEND_DEPOSIT_PERCENT,
  INTASEND_IS_TEST,
  INTASEND_PUBLISHABLE_KEY,
  INTASEND_SECRET_KEY,
  REDIRECT_URL,
  NODE_ENV,
  INSTASEND_CHALLENGE,
  PLATFORM_FEES,
} from "../../constants";
import {
  compareHash,
  generateUniqueId,
  getFinalAmountInUSD,
  isValidEmail,
} from "../../utils";
import { sendWithdrawalRequestNotification } from "../auth/verify";

export const getURL = async (req: Request, res: Response) => {
  try {
    console.log("Deposit Money: ", req.body);
    let { amount } = req.body;
    const currency = "KES"; // All Mpesa payments are in KES
    const mode = "mpesa";
    amount = Number(amount);

    if (!amount) {
      return res.status(400).json({
        status: false,
        message: "Please provide a valid amount to be deposited",
      });
    }

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
        host: FRONTEND_URL,
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

      // await processCommissionDeposit(
      //   user.id,
      //   finalamountInUSD - platform_charges
      // ); //for referal commission it should work when payment is successful

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
        platform_charges: true,
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
    if (transaction.status === "COMPLETED") {
      return res.status(200).json({
        message: "Payment Successful",
      });
    }

    if (transaction.status === "CANCELLED") {
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
      ...((await processCommissionDeposit(
        transaction.userId,
        transaction.finalamountInUSD - transaction.platform_charges
      )) || []), // Process the commission if there's a referrer
    ]);

    res.status(200).json({
      message: "Payment Successful",
    });
  } catch (error) {
    console.error("Internal Error:", error);
    res.status(500).json({ message: "Internal server error", status: "error" });
  }
};

export const processCommissionDeposit = async (
  userId: string,
  amount: number
) => {
  try {
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        referredBy: true,
      },
    });

    if (
      !user ||
      !user.referredBy.length ||
      !user.referredBy[0].referredUserId
    ) {
      return null;
    }

    const referrerId = user.referredBy[0].referredUserId;
    const referalId = user.referredBy[0].id;
    const commission = amount * 0.03;
    const finalamountInUSD = await getFinalAmountInUSD(amount, "KES");
    if (!finalamountInUSD) return;

    await db.user.update({
      where: { id: referrerId },
      data: {
        totalcommission: {
          increment: commission,
        },
      },
    });

    await db.commissionDeposit.create({
      data: {
        userId: referrerId,
        amount: commission,
        deposit: amount,
        status: "COMPLETED",
        referralId: referalId,
      },
    });
  } catch (error) {
    console.error("Error processing deposit:", error);
    throw new Error("Failed to process deposit");
  }
};

export const withdraw = async (req: Request, res: Response) => {
  try {
    let { amount, account } = req.body;
    amount = Number(amount);
    const currency = "KES"; // All Mpesa withdrawals are in KES
    const user: any = (req?.user as any)?.user;
    const currentBalance = user?.balance;

    const finalamountInUSD = await getFinalAmountInUSD(amount, currency);

    if (!finalamountInUSD)
      return res
        .status(500)
        .json({ message: "Invalid currency or amount", status: "error" });

    console.log("Converted KES ", amount, "in $", finalamountInUSD);

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
    // const platform_charges = INSTASEND_WITHDRAWAL_CHARGE;
    const platform_charges = finalamountInUSD * PLATFORM_FEES;
    parseFloat((finalamountInUSD * PLATFORM_FEES).toFixed(2));
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
        api_ref: checkout_id, // Prevent api_ref should be unique error
      },
    });

    // Attempt to send the amount to the user's account
    const withdrawSuccess = await withdrawMPesaToUser(amount, account, user);

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
          status: "REQUESTED",
          api_ref: withdrawSuccess.message.tracking_id,
        },
      }),
    ]);

    sendWithdrawalRequestNotification(
      transaction.finalamountInUSD,
      transaction.id
    );
    res.status(200).json({
      message: "Money withdrawal initiated! Kindly wait till it is approved.",
      transaction, // Return the transaction object
    });
  } catch (error) {
    console.error("Error withdrawing Money:", error);
    res.status(500).json({ message: "Internal server error", status: "error" });
  }
};

export const approveWithdrawal = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;

    if (!id)
      return res.status(404).json({
        status: "error",
        message: "Transaction ID is required",
      });

    const user: any = (req?.user as any)?.user;

    if (!user || !user?.role || user.role !== "ADMIN") {
      return res.status(404).json({
        status: "error",
        message: "User Unauthorized",
      });
    }

    await db.transaction.update({
      where: { id },
      data: {
        status: "COMPLETED",
      },
    });

    res.status(200).json({
      status: true,
      message: "Withdrawal Approved",
    });
  } catch (error) {
    console.error("Error withdrawing Money:", error);
    res.status(500).json({ message: "Internal server error", status: "error" });
  }
};

// Webhook route
export const validateTransaction = async (req: Request, res: Response) => {
  try {
    const { api_ref, challenge, state } = req.body;

    console.log(
      "--------------------------------------------------------------------------------Triggering webhook for deposits--------------------------------------------------------------------------------------------"
    );

    console.log(challenge, api_ref, state, INSTASEND_CHALLENGE);

    // Check for challenge and match it
    if (challenge !== INSTASEND_CHALLENGE) {
      console.log("User not authorized");
      return res.status(400).json({
        status: "error",
        message: "User is unauthorized",
      });
    }

    // Check for api_ref and match it
    const transaction = await db.transaction.findFirst({
      where: {
        api_ref,
        type: "DEPOSIT",
      },
      select: {
        id: true,
        userId: true,
        finalamountInUSD: true,
        status: true,
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
      if (state !== "COMPLETE") {
        console.log("Payment is", state);
        await db.transaction.update({
          where: { id: transaction.id },
          data: {
            status: ["PROCESSING", "PENDING"].includes(state)
              ? "PENDING"
              : "CANCELLED",
          },
        });

        return res.status(400).json({
          message: `Status is ${state}`,
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
    console.error("Error Validating Deposit:", error);
    res.status(500).json({ message: "Internal server error", status: "error" });
  }
};

export const updateTransaction = async (req: Request, res: Response) => {
  try {
    const { invoice_id } = req.body;
    try {
      const transactionCheck = await updateTransactionChecks(invoice_id);

      if (!transactionCheck.status) {
        return res.status(400).json({
          status: false,
          message: transactionCheck.message,
        });
      }

      return res.status(200).json({
        message: "Success",
        resp: transactionCheck.message,
      });
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

// Webhook route
export const updateWithdrawal = async (req: Request, res: Response) => {
  try {
    const { tracking_id, challenge, status } = req.body;

    console.log(
      "--------------------------------------------------------------------------------Triggering webhook for withdrawals--------------------------------------------------------------------------------------------"
    );

    console.log(tracking_id, challenge, status, INSTASEND_CHALLENGE);

    // Check for challenge and match it
    if (challenge !== INSTASEND_CHALLENGE) {
      console.log("User not authorized");
      return res.status(400).json({
        status: "error",
        message: "User is unauthorized",
      });
    }

    // Check for api_ref and match it
    const transaction = await db.transaction.findFirst({
      where: {
        api_ref: tracking_id,
        type: "WITHDRAWAL",
      },
      select: {
        id: true,
        userId: true,
        finalamountInUSD: true,
        status: true,
        secret_token: true,
      },
    });

    if (!transaction) {
      console.log("Transaction not found");
      return res
        .status(404)
        .json({ message: "Transaction not found", status: "error" });
    }

    console.log("Transaction for withdrawal found -> ", transaction);

    try {
      if (status !== "Preview and approve") {
        console.log("Payment is", status);
        await db.transaction.update({
          where: { id: transaction.id },
          data: {
            status: [
              "Confirming balance",
              "Processing (FLT)",
              "Processing",
              "Processing (FLTRSLT)",
              "Sending payment",
              "Processing payment",
            ].includes(status)
              ? "PENDING"
              : "CANCELLED",
          },
        });

        return res.status(400).json({
          message: `Status is ${status}`,
          status: "error",
        });
      }

      // Check for if the transaction is requested
      if (transaction.status !== "REQUESTED") {
        console.log(
          "Transaction already completed with status -> ",
          transaction.status
        );
        return res.status(401).json({
          message: "Transaction already completed or cancelled",
          status: "error",
        });
      }

      // Update the status to Success
      await db.transaction.update({
        where: {
          // email: user.email,
          id: transaction.id,
        },
        data: {
          status: "COMPLETED",
        },
      });

      console.log("Withdrawal Completed");
      res.status(200).json({
        message: "Withdraw Successful",
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
    console.error("Error Fetching Transaction:", error);
    res.status(500).json({ message: "Internal server error", status: "error" });
  }
};
