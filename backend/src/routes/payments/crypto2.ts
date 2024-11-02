import express, { Request, Response } from "express";
import { authenticateJWT, authorizeAdmin } from "../../middlewares/auth";
import { generateUniqueId } from "../../utils";
import { db } from "../../db";
import { sendWithdrawalRequestNotification } from "../../controllers/auth/verify";
import { withdrawalChecks } from "../../utils/payment";

const router = express.Router();

// API to create a withdrawal request and notify the admin
router.post(
  "/withdraw",
  authenticateJWT,
  async (req: Request, res: Response) => {
    // Amount in dollars but required currency is coin
    let { address, coin, platform_charges, finalamountInUSD } =
      req.body;

    if (
      !address ||
      !coin ||
      !platform_charges ||
      !finalamountInUSD
    ) {
      return res.status(500).json({
        success: "error",
        message: "Please provide all details",
      });
    }

    const user: any = (req?.user as any)?.user;
    const currentBalance = user?.balance;

    const withdrawalCheck = await withdrawalChecks(
      finalamountInUSD,
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

    try {
      const checkout_id = generateUniqueId();
      let transaction = await db.$transaction([
        db.user.update({
          where: {
            email: user.email,
          },
          data: {
            balance: currentBalance - finalamountInUSD,
          },
        }),
        db.transaction.create({
          data: {
            userId: user.id,
            amount: finalamountInUSD,
            type: "WITHDRAWAL",
            status: "REQUESTED",
            // TODO: Temporary change
            signature: "",
            checkout_id,
            finalamountInUSD: finalamountInUSD - platform_charges,
            platform_charges,
            mode: "crypto",
            api_ref: checkout_id, // Prevent api_ref should be unique error
            currency: coin,
            wallet_address: address,
          },
        }),
      ]);

      console.log(transaction);

      const newTransaction = transaction?.[1];

      // Notify admin about new withdrawal
      try {
        sendWithdrawalRequestNotification(
          newTransaction.finalamountInUSD,
          newTransaction.id,
          `
      <p>A new withdrawal request has been submitted with the following details:</p>
      <p>Request ID: <strong>${newTransaction.id}</strong></p>
      <p>Wallet Address: <strong>${newTransaction.wallet_address}</strong></p>
      <p>Wallet Type: <strong>${newTransaction.currency}</strong></p>
      <p>Amount: <strong>${newTransaction.finalamountInUSD}</strong></p>
      <p>Please review this request at your earliest convenience.</p>
    `
        );
      } catch (error) {
        console.log(error);
        return res.status(500).json({
          success: "error",
          message: "Error message sending failed",
        });
      }

      res.status(200).json({
        success: "true",
        message:
          "Your money withdrawal has been initiated! Expect to receive your funds within 24 hours.",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: "error",
        message: "Something went wrong",
      });
    }
  }
);

// API to mark the transaction as success
router.post(
  "/withdraw/success",
  authenticateJWT,
  authorizeAdmin,
  async (req: Request, res: Response) => {
    const { txId } = req.body;

    try {
      await db.transaction.update({
        where: { id: txId },
        data: {
          status: "COMPLETED",
        },
      });

      res.status(200).json({
        message: "Money withdrawal is approved",
        success: "true",
      });
    } catch (error) {
      console.log(error);
      res.status(200).json({
        message: "Something went wrong",
        success: "error",
      });
    }
  }
);

// API to mark the transaction as failure
router.post(
  "/withdraw/failure",
  authenticateJWT,
  authorizeAdmin,
  async (req: Request, res: Response) => {
    try {
      const { txId } = req.body;
      await db.transaction.update({
        where: { id: txId },
        data: {
          status: "CANCELLED",
        },
      });

      res.status(200).json({
        success: "true",
        message: "Withdrawal cancelled",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: "error",
        message: "Something went wrong",
      });
    }
  }
);

export default router;
