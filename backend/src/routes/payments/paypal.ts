import express from "express";
import { authenticateJWT } from "../../middlewares/auth";
import { getOrderStatus, getPaypentPage, getToken, getURL } from "../../controllers/payments/paypal";

const router = express.Router();

router.post("/get-url", getURL);
router.get("/get-payment-page", getPaypentPage);

router.post("/api/token", getToken);
router.post("/api/orders/:orderID/capture", getOrderStatus)

export default router;