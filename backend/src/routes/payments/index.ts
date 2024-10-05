import express from "express";
import {
  cryptoToUSD,
  getConvertedValue,
  transactionHistory,
} from "../../controllers/payments";
import { authenticateJWT } from "../../middlewares/auth";

const router = express.Router();

router.get("/transaction-history", authenticateJWT, transactionHistory);
router.post("/get-amount-in-USD", getConvertedValue);
router.post("/get-crypto-in-USD", cryptoToUSD);

export default router;