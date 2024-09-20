import express from "express";
import { getPaymentURL, successTransaction, transactionHistory, withdrawMoney } from "../../controllers/payments";
import { authenticateJWT } from "../../middlewares/auth";

const router = express.Router();

router.post("/withdraw-money", authenticateJWT, withdrawMoney);
router.post("/get-payment-url", authenticateJWT, getPaymentURL);
router.post("/success-transaction", authenticateJWT, successTransaction);

router.get("/transaction-history",authenticateJWT,transactionHistory);
export default router;
