import express from "express";
// import {
// approveWithdrawal,
// checkTransactionStatus2,
// getId,
// getURL,
// successTransaction,
// withdrawCrypto,
// } from "../../controllers/payments/crypto";
import { authenticateJWT } from "../../middlewares/auth";
import {
  getNOWPaymentsURL,
  addWebhook,
  validateTransaction,
} from "../../controllers/payments/crypto2";

const router = express.Router();

// router.post("/get-url", authenticateJWT, getURL);  // Not used
// router.post("/success/transaction", successTransaction);  // Not used
// // router.post("/withdraw", authenticateJWT, withdraw);
// router.post("/approve/withdraw", approveWithdrawal);  // Not used

// router.post("/get-wallet-address", authenticateJWT, getId);
// router.post("/withdraw", authenticateJWT, withdrawCrypto);

// router.post("/check-transaction-status", authenticateJWT, checkTransactionStatus2);

// NOW payment routes
router.post("/get-url", authenticateJWT, getNOWPaymentsURL);

// Add a webhook
router.post("/validate/transaction", addWebhook);

// The webhook will call this periodically.
// Flow remains similar to mpesa
router.post("/validate/transaction/webhook", validateTransaction);

export default router;
