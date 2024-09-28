import express from "express";
import {
  transactionHistory,
} from "../../controllers/payments";
import { authenticateJWT } from "../../middlewares/auth";

const router = express.Router();

router.get("/transaction-history", authenticateJWT, transactionHistory);

export default router;