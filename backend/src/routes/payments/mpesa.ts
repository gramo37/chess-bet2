import express from "express";
import {
  getURL,
  successTransaction,
  withdraw,
  approveWithdrawal,
  validateTransaction
} from "../../controllers/payments/mpesa";
import { authenticateJWT, emailVerifiedMiddleware } from "../../middlewares/auth";

const router = express.Router();

router.post("/get-url", authenticateJWT,emailVerifiedMiddleware, getURL);
router.post("/success-transaction", successTransaction);
router.post("/validate/transaction", validateTransaction)
router.post("/withdraw", authenticateJWT,emailVerifiedMiddleware, withdraw);
router.post("/approve/withdraw", authenticateJWT, approveWithdrawal);

export default router;
