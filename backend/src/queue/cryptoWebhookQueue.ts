import Queue from "bull";
import axios from "axios";
import { db } from "../db";
import { updateCryptoTransactionChecks } from "../utils/payment";

// Interface for webhook data
interface WebhookData {
  url: string;
  payload: any;
}

const webhookQueue = new Queue<WebhookData>("webhookQueueCrypto", {
  redis: {
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
    host: process.env.REDIS_HOST || "redis",
  }, // Redis config, adjust as needed
});

webhookQueue.process(async (job) => {
  console.log("Processing webhook:", job.data, job.id);
  console.log("Adding data in webhooks table for crypto");

  // Add data in webhook table
  try {
    // Adding all the webhook data to DB for debugging purpose
    await db.webhook.upsert({
      where: {
        api_ref: job?.data?.payload?.order_id,
      },
      update: {
        state: job?.data?.payload?.payment_status,
        charges: job?.data?.payload?.burning_percent,
        net_amount: String(job?.data?.payload?.price_amount),
        actually_paid: String(job?.data?.payload?.actually_paid),
      },
      create: {
        url: job.data.url,
        job_id: String(job.id),
        invoice_id: String(job?.data?.payload?.payment_id), // ID to track status in NOWPayments not same as checkout_id in db
        state: job?.data?.payload?.payment_status,
        provider: "NOWPayments",
        charges: job?.data?.payload?.burning_percent,
        net_amount: String(job?.data?.payload?.price_amount),
        currency: job?.data?.payload?.price_currency,
        api_ref: job?.data?.payload?.order_id, // Reference id between webhook and transaction table
        created_at: job?.data?.payload?.created_at, //
        updated_at: job?.data?.payload?.updated_at, //
        checkout_id: String(job?.data?.payload?.invoice_id), // ID for reference also stored in transaction table as checkout_id
        actually_paid: String(job?.data?.payload?.actually_paid), // Required because partial payment is also allowed
        pay_address: job?.data?.payload?.pay_address, // Stored for reference
      },
    });
  } catch (error) {
    console.log("Something went wrong while entering data in webhook", error);
  }

  try {
    const instance = axios.create({
      httpsAgent: new (require("https").Agent)({
        rejectUnauthorized: false, // Disable certificate verification
      }),
    });

    const response = await instance.post(job.data.url, job.data.payload, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("Webhook processed successfully:", response.status);
  } catch (error: any) {
    console.error("Failed to process webhook, retrying...", error.message);
    throw new Error("Failed to process webhook"); // This will trigger a retry
  }
});

// Event listener for failed attempts
webhookQueue.on("failed", async (job: any, err) => {
  console.error(`Job failed: ${job.id}`, err.message);
  await db.webhook_retries.create({
    data: {
      status: "FAILURE",
      error_message: `Webhook failed -> ${err.message}`,
      job_id: String(job.id),
      api_ref: job?.data?.payload?.order_id,
    },
  });
  if (job?.data?.payload?.payment_id) {
    // If the transaction fails check the transaction in instasend
    const transactionCheck = await updateCryptoTransactionChecks(
      job?.data?.payload?.payment_id
    );

    if (!transactionCheck.status) {
      console.log(
        `Transaction Updation failed. Error -> `,
        transactionCheck.message
      );
    } else {
      console.log("Transaction updated successfully");
    }
  }

  console.log(`Retrying ${job.opts.attempts - job.attemptsMade} more times...`);
});

// Event listener for successful job completion
webhookQueue.on("completed", async (job) => {
  await db.webhook_retries.create({
    data: {
      status: "SUCCESS",
      error_message: `Webhook completed`,
      job_id: String(job.id),
      api_ref: job?.data?.payload?.order_id,
    },
  });
  console.log(`Job completed successfully: ${job.id}`);
});

export const processWebhook = async (eventData: any) => {
  await webhookQueue.add(eventData, {
    attempts: 2, // Retry 3 times
    backoff: {
      type: "exponential", // Exponential backoff strategy
      delay: 300000, // Initial delay of 5 minutes (in ms)
    },
  });
};
