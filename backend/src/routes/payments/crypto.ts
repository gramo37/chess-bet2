import express from "express";
import {
  approveWithdrawal,
  getId,
  getURL,
  successTransaction,
  withdrawCrypto,
} from "../../controllers/payments/crypto";
import { authenticateJWT } from "../../middlewares/auth";

const router = express.Router();

router.post("/get-url", authenticateJWT, getURL);  // Not used
router.post("/success/transaction", successTransaction);  // Not used
// router.post("/withdraw", authenticateJWT, withdraw);
router.post("/approve/withdraw", approveWithdrawal);  // Not used

router.post("/get-wallet-address", authenticateJWT, getId);
router.post("/withdraw", authenticateJWT, withdrawCrypto);

export default router;
