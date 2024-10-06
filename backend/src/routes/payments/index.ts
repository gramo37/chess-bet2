import express from "express";
import {
  cryptoToUSD,
  getConvertedValue,
  transactionHistory,
  USDTocrypto
} from "../../controllers/payments";
import { authenticateJWT } from "../../middlewares/auth";

const router = express.Router();

router.get("/transaction-history/", authenticateJWT, transactionHistory);
router.post("/get-amount-in-USD", getConvertedValue);
router.post("/get-crypto-in-USD", cryptoToUSD);
router.post("/get-USD-in-crypto", USDTocrypto);

export default router;