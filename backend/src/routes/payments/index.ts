import express from "express";
import { getPaymentURL, successTransaction, transactionHistory, withdrawMoney } from "../../controllers/payments";
import { CURRENCY, HOST, INTASEND_IS_TEST, INTASEND_PUBLISHABLE_KEY, INTASEND_SECRET_KEY, REDIRECT_URL } from "../../constants";
import { authenticateJWT } from "../../middlewares/auth";

const router = express.Router();


router.post("/get-payment-url", authenticateJWT, getPaymentURL);
router.post("/success-transaction", authenticateJWT, successTransaction);
router.post("/withdraw-money", authenticateJWT, withdrawMoney);

router.get("/transaction-history",authenticateJWT,transactionHistory);
export default router;
