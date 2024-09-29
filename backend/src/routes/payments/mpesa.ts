import express from "express";
import {
  getURL,
  successTransaction,
  withdraw,
  approveWithdrawal
} from "../../controllers/payments/mpesa";
import { authenticateJWT } from "../../middlewares/auth";

const router = express.Router();

router.post("/get-url", authenticateJWT, getURL);
router.post("/success-transaction", successTransaction);
router.post("/withdraw", authenticateJWT, withdraw);
router.post("/approve/withdraw", authenticateJWT, approveWithdrawal);

export default router;
