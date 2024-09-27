import express from "express";
import { getCryptoURL, getMPesaURL, successTransaction, transactionHistory, withdrawMPesa } from "../../controllers/payments";
import { authenticateJWT } from "../../middlewares/auth";

const router = express.Router();


router.post("/get-mpesa-url", authenticateJWT, getMPesaURL);
router.post("/success-transaction", successTransaction);
router.post("/withdraw-mpesa", authenticateJWT, withdrawMPesa);

router.post("/get-crypto-url", authenticateJWT, getCryptoURL);

router.get("/transaction-history", authenticateJWT, transactionHistory);
export default router;
