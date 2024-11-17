import express from "express";
import {
  getOrders,
  getOrderStatus,
  getPaypentPage,
  getToken,
  getURL,
  handlePaypalPayout,
  handlePayPalWebhook,
} from "../../controllers/payments/paypal";
import { authenticateJWT } from "../../middlewares/auth";

const router = express.Router();

router.post("/get-url", getURL);
router.get("/get-payment-page", getPaypentPage);

router.post("/token", getToken);
router.post("/orders/:orderID/capture", getOrderStatus);
router.post("/orders/", authenticateJWT, getOrders);

// Create webhook to update the user balance and add a transaction
// http://localhost:3000/api/payments/paypal/validate/transactions
router.post("/validate/transactions", handlePayPalWebhook);

// Paypal payout
router.post("/payout", authenticateJWT, handlePaypalPayout);


export default router;
