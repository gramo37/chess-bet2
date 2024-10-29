import express from "express";
import { authenticateJWT } from "../../middlewares/auth";
import { getOrders, getOrderStatus, getPaypentPage, getToken, getURL } from "../../controllers/payments/paypal";

const router = express.Router();

router.post("/get-url", getURL);
router.get("/get-payment-page", getPaypentPage);

router.post("/token", getToken);
router.post("/orders/:orderID/capture", getOrderStatus);
router.post("/orders/", getOrders);

export default router;