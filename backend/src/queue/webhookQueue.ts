import Bull from "bull";
import axios from "axios";
import { db } from "../db";

// Interface for webhook data
interface WebhookData {
  url: string;
  payload: any;
}

// Create a Bull queue
const webhookQueue = new Bull<WebhookData>("webhookQueue", {
  redis: {
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
    host: process.env.REDIS_HOST || "redis",
  }, // Redis config, adjust as needed
});

// Function to add a webhook to the queue
export const addWebhookToQueue = (webhookData: WebhookData): void => {
  webhookQueue.add(webhookData, {
    attempts: 1, // Retry 2 times
    backoff: {
      type: "exponential", // Exponential backoff strategy
      delay: 300000, // Initial delay of 5 minutes (in ms)
    },
  });
};

// Process jobs in the queue
webhookQueue.process(async (job) => {
  console.log("Processing webhook:", job.data, job.id);
  console.log("Adding data in webhooks table");
  await db.webhook.create({
    data: {
      url: job.data.url,
      job_id: String(job.id),
      invoice_id: job?.data?.payload?.invoice_id,
      state: job?.data?.payload?.state,
      provider: job?.data?.payload?.provider,
      charges: job?.data?.payload?.charges,
      net_amount: job?.data?.payload?.net_amount,
      currency: job?.data?.payload?.currency,
      account: job?.data?.payload?.account,
      api_ref: job?.data?.payload?.api_ref,
      host: job?.data?.payload?.host,
      failed_reason: job?.data?.payload?.failed_reason,
      failed_code: job?.data?.payload?.failed_code,
      created_at: job?.data?.payload?.created_at,
      updated_at: job?.data?.payload?.updated_at,
    },
  });

  try {
    const response = await axios.post(job.data.url, job.data.payload, {
      headers: { "Content-Type": "application/json" },
    });
    // Add the webhook in DB for later use
    await db.webhook_retries.create({
      data: {
        status: "SUCCESS",
        error_message: `Webhook completed`,
        job_id: String(job.id),
      },
    });
    console.log("Webhook processed successfully:", response.status);
  } catch (error: any) {
    console.error("Failed to process webhook, retrying...", error.message);
    await db.webhook_retries.create({
      data: {
        status: "FAILURE",
        error_message: `Webhook not processed ${error.message}`,
        job_id: String(job.id),
      },
    });
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
    },
  });
  console.log(`Retrying ${job.opts.attempts - job.attemptsMade} more times...`);
});

// Event listener for successful job completion
webhookQueue.on("completed", async (job) => {
  await db.webhook_retries.create({
    data: {
      status: "SUCCESS",
      error_message: `Webhook completed`,
      job_id: String(job.id),
    },
  });
  console.log(`Job completed successfully: ${job.id}`);
});
