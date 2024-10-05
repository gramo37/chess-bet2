import express from "express";
import {
  getConvertedValue,
  transactionHistory,
} from "../../controllers/payments";
import { authenticateJWT } from "../../middlewares/auth";

const router = express.Router();

router.get("/transaction-history", authenticateJWT, transactionHistory);
router.post("/get-amount-in-USD", getConvertedValue)

export default router;