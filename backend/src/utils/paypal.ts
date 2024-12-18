import {
  CACHE_DIR,
  PAYPAL_BASE,
  PAYPAL_CLIENT_ID,
  PAYPAL_CLIENT_SECRET,
  WEBHOOK_ID,
} from "../constants";
import crypto from "crypto";
import crc32 from "buffer-crc32";
import fs from "fs/promises";
import axios from "axios";

const base = PAYPAL_BASE;

/**
 * Generate an OAuth 2.0 access token for authenticating with PayPal REST APIs.
 * @see https://developer.paypal.com/api/rest/authentication/
 */
export const generateAccessToken = async () => {
  try {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error("MISSING_API_CREDENTIALS");
    }
    const auth = Buffer.from(
      PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET
    ).toString("base64");
    const response = await fetch(`${base}/v1/oauth2/token`, {
      method: "POST",
      body: "grant_type=client_credentials",
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Failed to generate Access Token:", error);
  }
};

/**
 * Generate a client token for rendering the hosted card fields.
 * @see https://developer.paypal.com/docs/checkout/advanced/integrate/#link-integratebackend
 */
export const generateClientToken = async () => {
  const accessToken = await generateAccessToken();
  const url = `${base}/v1/identity/generate-token`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Accept-Language": "en_US",
      "Content-Type": "application/json",
    },
  });

  return handleResponse(response);
};

/**
 * Create an order to start the transaction.
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_create
 */
export const createOrder = async (cart: any) => {
  // use the cart information passed from the front-end to calculate the purchase unit details
  console.log(
    "shopping cart information passed from the frontend createOrder() callback:",
    cart
  );

  if(!cart || !cart?.currency_code || !cart?.value) throw new Error("Cart values not provided")

  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders`;
  const payload = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: cart?.currency_code ?? "USD",
          value: cart?.value,
        },
      },
    ],
  };

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
      // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
      // "PayPal-Mock-Response": '{"mock_application_codes": "MISSING_REQUIRED_PARAMETER"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "PERMISSION_DENIED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
    },
    method: "POST",
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
};

/**
 * Capture payment for the created order to complete the transaction.
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_capture
 */
export const captureOrder = async (orderID: any) => {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders/${orderID}/capture`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
        // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
        // "PayPal-Mock-Response": '{"mock_application_codes": "INSTRUMENT_DECLINED"}'
        // "PayPal-Mock-Response": '{"mock_application_codes": "TRANSACTION_REFUSED"}'
        // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
      },
    });
    return handleResponse(response);
  } catch(err) {
    console.log(err)
    throw err
  }

};

export async function handleResponse(response: any) {
  try {
    const jsonResponse = await response.json();
    return {
      jsonResponse,
      httpStatusCode: response.status,
    };
  } catch (err) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }
}

async function downloadAndCache(url?: any, cacheKey?: any) {
  if(!cacheKey) {
    cacheKey = url.replace(/\W+/g, '-')
  }
  const filePath = `${CACHE_DIR}/${cacheKey}`;
 
  // Check if cached file exists
  const cachedData = await fs.readFile(filePath, 'utf-8').catch(() => null);
  if (cachedData) {
    return cachedData;
  }
 
  // Download the file if not cached
  const response = await fetch(url);
  const data = await response.text()
  await fs.writeFile(filePath, data);
 
  return data;
}

export async function verifySignature(event: any, headers: any) {
  const transmissionId = headers['paypal-transmission-id']
  const timeStamp = headers['paypal-transmission-time']
  const crc = parseInt("0x" + crc32(JSON.stringify(event, null, 2)).toString('hex')); // hex crc32 of raw event data, parsed to decimal form
 
  const message = `${transmissionId}|${timeStamp}|${WEBHOOK_ID}|${crc}`
  console.log(`Original signed message ${message}`);
 
  const certPem = await downloadAndCache(headers['paypal-cert-url']);
 
  // Create buffer from base64-encoded signature
  const signatureBuffer = Buffer.from(headers['paypal-transmission-sig'], 'base64');
 
  // Create a verification object
  const verifier = crypto.createVerify('SHA256');
 
  // Add the original message to the verifier
  verifier.update(message);
 
  return verifier.verify(certPem, signatureBuffer);
}

export async function createPayout(
  recipientEmail: string,
  amount: string,
  currency: string
) {
  try {
    const accessToken = await generateAccessToken();
  
    const payoutData = {
      sender_batch_header: {
        email_subject: 'You have a payout!',
      },
      items: [
        {
          recipient_type: 'EMAIL',
          amount: {
            value: amount,
            currency: currency,
          },
          receiver: recipientEmail,
        },
      ],
    };
  
    const response = await axios.post(
      `${PAYPAL_BASE}/v1/payments/payouts`,
      payoutData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  
    return response?.data;
  } catch (error) {
    console.log(error)
    throw error
  }
}