import express from "express";
import { depositMoney, withdrawMoney,transactionHistory } from "../../controllers/payments";
import { authenticateJWT } from "../../middlewares/auth";

const router = express.Router();

router.post("/deposit-money", authenticateJWT, depositMoney);
router.post("/withdraw-money", authenticateJWT, withdrawMoney);
router.get("/transaction-history",authenticateJWT,transactionHistory);
export default router;
