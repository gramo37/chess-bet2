import express from "express";
import {
  getOrders,
  getOrderStatus,
  getPaypentPage,
  getToken,
  getURL,
} from "../../controllers/payments/paypal";
import { generateAccessToken, verifySignature } from "../../utils/paypal";
import { PAYPAL_BASE, WEBHOOK_ID } from "../../constants";
import axios from "axios";
import { authenticateJWT } from "../../middlewares/auth";
import { db } from "../../db";
import { processCommissionDeposit } from "../../controllers/payments/mpesa";

const router = express.Router();

router.post("/get-url", getURL);
router.get("/get-payment-page", getPaypentPage);

router.post("/token", getToken);
router.post("/orders/:orderID/capture", getOrderStatus);
router.post("/orders/", authenticateJWT, getOrders);
// router.post("/validate/transactions", handlePayPalWebhook);

// Create webhook to update the user balance and add a transaction
// http://localhost:3000/api/payments/paypal/validate/transactions

router.post("/validate/transactions", async (req, res) => {
  try {
    console.log(
      "--------------------------------------------Triggering Paypal webhook------------------------------------"
    );

    // Verify the webhook signature
    const signature = req.headers["paypal-transmission-sig"];
    const transmissionId = req.headers["paypal-transmission-id"];
    const transmissionTime = req.headers["paypal-transmission-time"];
    const webhookId = WEBHOOK_ID;

    if (!signature || !transmissionId || !transmissionTime || !webhookId) {
      console.log("Missing PayPal headers");
      console.log("signature", signature);
      console.log("transmissionId", transmissionId);
      console.log("transmissionTime", transmissionTime);
      console.log("webhookId", webhookId);
      return res.status(400).send({ error: "Missing PayPal headers" });
    }

    if (!req.body) {
      console.log(JSON.stringify(req.body, null, 2));
      return res.status(400).send({ error: "Missing PayPal body" });
    }

    const headers = req.headers;
    const event = req.body;
    // const data = JSON.parse(event);

    console.log(`headers`, headers);
    console.log(`parsed json`, JSON.stringify(event, null, 2));
    console.log(`raw event: ${event}`);

    // const isSignatureValid = await verifySignature(event, headers);

    const verificationResponse = await axios.post(
      `${PAYPAL_BASE}/v1/notifications/verify-webhook-signature`,
      {
        transmission_id: transmissionId,
        transmission_time: transmissionTime,
        cert_url: req.headers["paypal-cert-url"],
        auth_algo: req.headers["paypal-auth-algo"],
        transmission_sig: signature,
        webhook_id: webhookId,
        webhook_event: req.body,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await generateAccessToken()}`,
        },
      }
    );

    console.log("verificationResponse", verificationResponse);

    const isSignatureValid =
      verificationResponse.data.verification_status === "SUCCESS";

    console.log(isSignatureValid, "isSignatureValid");
    if (isSignatureValid) {
      console.log("Signature is valid.");

      // Successful receipt of webhook, do something with the webhook data here to process it, e.g. write to database
      console.log(`Received event`, JSON.stringify(event, null, 2));
      // Write logic to update the balance of the user if not updated already

      // Check for api_ref and match it
      const capture = event.resource;
      const orderId = capture.supplementary_data.related_ids.order_id;

      const transaction = await db.transaction.findFirst({
        where: {
          api_ref: orderId,
          type: "DEPOSIT",
        },
        select: {
          id: true,
          userId: true,
          finalamountInUSD: true,
          status: true,
          platform_charges: true,
          secret_token: true,
        },
      });

      if (!transaction) {
        console.log("Transaction not found");
        return res
          .status(404)
          .json({ message: "Transaction not found", status: "error" });
      }

      console.log("Transaction for deposit found -> ", transaction);

      if (
        event.event_type === "PAYMENT.CAPTURE.DENIED" ||
        event.event_type === "PAYMENT.CAPTURE.REFUNDED"
      ) {
        console.log(
          "Updating DB..",
          "Transaction",
          transaction.id,
          "has been CANCELLED"
        );

        await db.transaction.update({
          where: { id: transaction.id },
          data: {
            status: "CANCELLED",
          },
        });

        return res.status(400).json({
          message: `Status is ${event.event_type}`,
          status: "error",
        });
      }

      if (event.event_type !== "PAYMENT.CAPTURE.COMPLETED") {
        console.log("Payment is", event.event_type);

        return res.status(400).json({
          message: `Status is ${event.event_type}`,
          status: "error",
        });
      }

      // Check for if the transaction is pending
      if (transaction.status !== "PENDING") {
        console.log(
          "Transaction already completed with status -> ",
          transaction.status
        );
        return res.status(401).json({
          message: "Transaction already completed or cancelled",
          status: "error",
        });
      }

      // Update transaction it as successful
      console.log(
        "Updating DB and balance by",
        transaction.finalamountInUSD,
        "Transaction",
        transaction.id,
        "has been COMPLETED"
      );

      await db.$transaction([
        db.user.update({
          where: {
            // email: user.email,
            id: transaction.userId,
          },
          data: {
            balance: {
              increment: transaction.finalamountInUSD,
            },
          },
        }),
        db.transaction.update({
          where: { id: transaction.id },
          data: {
            status: "COMPLETED", // Mark transaction as completed
          },
        }),
        ...((await processCommissionDeposit(
          transaction.userId,
          transaction.finalamountInUSD - transaction.platform_charges
        )) || []), // Process the commission if there's a referrer
      ]);

      console.log("Payment Completed");
      res.status(200).json({
        message: "Payment Successful",
      });
    } else {
      console.log(
        `Signature is not valid for ${req.body?.id} ${headers?.["correlation-id"]}`
      );
      console.log("User not authorized");
      return res.status(400).json({
        status: "error",
        message: "User is unauthorized",
      });
      // Reject processing the webhook event. May wish to log all headers+data for debug purposes.
    }

    // Return a 200 response to mark successful webhook delivery
    res.status(200).json({
      success: "true",
      message: "Webhook success",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: "false",
      message: "internal Server Error",
      event,
    });
  }
});

export default router;
