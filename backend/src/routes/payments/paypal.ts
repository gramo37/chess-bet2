import express from "express";
import { authenticateJWT } from "../../middlewares/auth";
import {
  getOrders,
  getOrderStatus,
  getPaypentPage,
  getToken,
  getURL,
} from "../../controllers/payments/paypal";
import { verifySignature } from "../../utils/paypal";

const router = express.Router();

router.post("/get-url", getURL);
router.get("/get-payment-page", getPaypentPage);

router.post("/token", getToken);
router.post("/orders/:orderID/capture", getOrderStatus);
router.post("/orders/", getOrders);

// Create webhook to update the user balance and add a transaction
// http://localhost:3000/api/payments/paypal/validate/transactions

router.post("/validate/transactions", async (req, res) => {
  try {
    console.log(
      "--------------------------------------------Triggering Paypal webhook------------------------------------"
    );
    const headers = req.headers;
    const event = req.body;
    const data = JSON.parse(event);

    console.log(`headers`, headers);
    console.log(`parsed json`, JSON.stringify(data, null, 2));
    console.log(`raw event: ${event}`);

    const isSignatureValid = await verifySignature(event, headers);

    console.log(isSignatureValid, "isSignatureValid");
    if (isSignatureValid) {
      console.log('Signature is valid.');
   
      // Successful receipt of webhook, do something with the webhook data here to process it, e.g. write to database
      console.log(`Received event`, JSON.stringify(data, null, 2));
   
    } else {
      console.log(`Signature is not valid for ${data?.id} ${headers?.['correlation-id']}`);
      // Reject processing the webhook event. May wish to log all headers+data for debug purposes.
    }
   
    // Return a 200 response to mark successful webhook delivery
    res.status(200).json({
      success: "true",
      message: "Webhook success"
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: "false",
      message: "internal Server Error",
    });
  }
});

export default router;
