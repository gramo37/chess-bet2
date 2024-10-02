import express from "express";
import {
  approveWithdrawal,
  getId,
  getURL,
  successTransaction,
  withdraw,
} from "../../controllers/payments/crypto";
import { authenticateJWT } from "../../middlewares/auth";

const router = express.Router();

router.post("/get-url", authenticateJWT, getURL);
router.post("/success/transaction", successTransaction);
router.post("/withdraw", authenticateJWT, withdraw);
router.post("/approve/withdraw", approveWithdrawal);

router.post("/get-wallet-address", authenticateJWT, getId);

export default router;
