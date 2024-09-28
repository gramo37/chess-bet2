import express from "express";
import {
  getURL,
  successTransaction,
  // withdraw,
} from "../../controllers/payments/crypto";
import { authenticateJWT } from "../../middlewares/auth";

const router = express.Router();

router.post("/get-url", authenticateJWT, getURL);
router.post("/success/transaction", successTransaction);
// router.post("/withdraw", authenticateJWT, withdrawMPesa);

export default router;
