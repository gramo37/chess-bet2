import { Request, Response } from "express";
import path from "path";
import { captureOrder, createOrder, generateAccessToken, generateClientToken } from "../../utils/paypal";
import axios from "axios";
import { PAYPAL_BASE, PLATFORM_FEES, WEBHOOK_ID } from "../../constants";
import { db } from "../../db";

export const getURL = async (req: Request, res: Response) => {
  try {
    res.status(200).json({
      message: "Success",
    });
  } catch (error) {
    console.error("Error Sending Paypal URL:", error);
    res.status(500).json({ message: "Internal server error", status: "error" });
  }
};

export const getPaypentPage = async (req: Request, res: Response) => {
  res.sendFile(path.resolve("./client/index.html"));
};

// return client token for hosted-fields component
export const getToken = async (req: Request, res: Response) => {
  try {
    const { jsonResponse, httpStatusCode } = await generateClientToken();
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to generate client token:", error);
    res.status(500).send({ error: "Failed to generate client token." });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    // use the cart information passed from the front-end to calculate the order amount detals
    const { cart } = req.body;
    const user: any = (req?.user as any)?.user;
    const { jsonResponse, httpStatusCode } = await createOrder(cart);
    console.log("jsonResponse", jsonResponse);
    console.log("httpStatusCode", httpStatusCode);
    try {
      const orderId = jsonResponse?.id;
      const finalamountInUSD = Number(cart?.value);
      const platform_charges = parseFloat(
        (finalamountInUSD * PLATFORM_FEES).toFixed(2)
      );

      await db.transaction.create({
        data: {
          user: {
            connect: {
              id: user.id,
            },
          },
          amount: Number(cart?.value),
          type: "DEPOSIT",
          status: "PENDING",
          signature: "",
          checkout_id: "",
          api_ref: orderId,
          currency: "USD",
          finalamountInUSD: finalamountInUSD - platform_charges,
          platform_charges,
          // secret_token: encrpted_secret_token, // TODO: Bcrypt this before saving
          mode: "paypal",
      }});
      
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error: "Failed to add record in transaction." });
    }
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to create order." });
  }
};

export const getOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderID } = req.params;
    const { jsonResponse, httpStatusCode } = await captureOrder(orderID);

    console.log("jsonResponse", jsonResponse);
    console.log("httpStatusCode", httpStatusCode);

    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to capture order." });
  }
};

export const handlePayPalWebhook = async (req: any, res: any) => {
  try {
      const body = JSON.stringify(req.body);
      console.log("<----------------Triggering Webhooks---------------->");

      // Verify the webhook signature
      const signature = req.headers["paypal-transmission-sig"];
      const transmissionId = req.headers["paypal-transmission-id"];
      const transmissionTime = req.headers["paypal-transmission-time"];
      const webhookId = WEBHOOK_ID;

      if (!signature || !transmissionId || !transmissionTime || !webhookId) {
          return res.status(400).send({ error: "Missing PayPal headers" });
      }

      // Verify the signature with PayPal API
      const verificationResponse = await axios.post(
          `${PAYPAL_BASE}/v1/notifications/verify-webhook-signature`,
          {
              auth_algo: req.headers["paypal-auth-algo"],
              cert_url: req.headers["paypal-cert-url"],
              transmission_id: transmissionId,
              transmission_sig: signature,
              transmission_time: transmissionTime,
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

  
      if (verificationResponse.data.verification_status !== "SUCCESS") {
          console.log("not success")
          return res.status(400).send({ error: "Invalid PayPal webhook signature" });
      }
    console.log(verificationResponse);
      const event = req.body;

      console.log(event);

      // if (event.event_type === "PAYMENT.CAPTURE.COMPLETED") {
      //     const capture = event.resource;
      //     const orderId = capture.supplementary_data.related_ids.order_id;

      //     // Update the transaction status in your database
      //   await db.$transaction(async()=>{
      //     const transaction = await db.transaction.update({
      //         where: { apiRef: orderId },
      //         data: { status: "COMPLETED" },
      //     });

      //     // Extend or create the subscription
      //     const subscription = await db.subscription.findFirst({
      //         where: {
      //             userId: transaction.userId,
      //             packageId: transaction.packageId,
      //             status: "ACTIVE",
      //         },
      //     });

      //     if (subscription) {
      //         const extendedEndDate = new Date(subscription.endDate);
      //         extendedEndDate.setMonth(extendedEndDate.getMonth() + 1);

      //         await db.subscription.update({
      //             where: { id: subscription.id },
      //             data: { endDate: extendedEndDate },
      //         });
      //     } else {
      //         const newEndDate = new Date();
      //         newEndDate.setMonth(newEndDate.getMonth() + 1);

      //         await db.subscription.create({
      //             data: {
      //                 userId: transaction.userId,
      //                 packageId: transaction.packageId,
      //                 status: "ACTIVE",
      //                 startDate: new Date(),
      //                 endDate: newEndDate,
      //             },
      //         });
      //     }

      //   })
      //     return res.status(200).send({ message: "Webhook handled successfully" });
      // } else if (event.event_type === "PAYMENT.CAPTURE.DENIED" || event.event_type === "PAYMENT.CAPTURE.REFUNDED") {
      //     const capture = event.resource;
      //     const orderId = capture.supplementary_data.related_ids.order_id;

      //     // Update the transaction status in your database
      //     await db.transaction.update({
      //         where: { apiRef: orderId },
      //         data: { status: "CANCELLED" },
      //     });

      //     return res.status(200).send({ message: "Payment canceled and transaction updated" });
      // }

   return  res.status(200).send({ message: "Event type not handled", event });
  } catch (error: any) {
      console.error("Error handling PayPal webhook:", error);
      res.status(500).send({ error: "Webhook handling failed" });
  }
};
