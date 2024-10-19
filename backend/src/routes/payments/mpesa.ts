import express from "express";
import {
  getURL,
  successTransaction,
  withdraw,
  approveWithdrawal,
  validateTransaction,
  updateTransaction,
  updateWithdrawal,
} from "../../controllers/payments/mpesa";
import {
  authenticateJWT,
  emailVerifiedMiddleware,
} from "../../middlewares/auth";
import { addWebhookToQueue } from "../../queue/webhookQueue";
import { db } from "../../db";

const router = express.Router();

router.post("/get-url", authenticateJWT, emailVerifiedMiddleware, getURL);
router.post("/success-transaction", successTransaction);
router.post("/validate/transaction/webhook", validateTransaction);
router.post("/transaction/status", authenticateJWT, updateTransaction);
router.post("/withdraw", authenticateJWT, emailVerifiedMiddleware, withdraw);
router.post("/approve/withdraw", authenticateJWT, approveWithdrawal); // Admin route to update withdraw transactions
router.post("/validate/withdrawal/webhook", updateWithdrawal);

// TODO: Function is same for below routes. Can be written nicely
router.post("/validate/transaction", async (req, res) => {
  try {
    const fullUrl = "https" + "://" + req.get("host") + req.originalUrl;
    // const fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
    console.log("Building the full URL", fullUrl);

    const webhookData = {
      url: `${fullUrl}/webhook`, // Webhook target URL
      payload: req.body, // Data from the request body
    };

    // Add the incoming request to the queue for processing
    addWebhookToQueue(webhookData);

    // Send an immediate success response
    res.status(200).json({
      status: "success",
      message: "Webhook added successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Webhook addition failed",
    });
  }
});

router.post("/validate/withdrawal", async (req, res) => {
  try {
    const fullUrl = "https" + "://" + req.get("host") + req.originalUrl;
    // const fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
    console.log("Building the full URL", fullUrl);

    const webhookData = {
      url: `${fullUrl}/webhook`, // Webhook target URL
      payload: req.body, // Data from the request body
    };

    // Add the incoming request to the queue for processing
    addWebhookToQueue(webhookData);

    // Send an immediate success response
    res.status(200).json({
      status: "success",
      message: "Webhook added successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Webhook addition failed",
    });
  }
});

export default router;
