import dotenv from "dotenv";

dotenv.config();

// General constants
export const REDIRECT_URL = process.env.FRONTEND_URL ? `${process.env.FRONTEND_URL}/payment` : "http://localhost:3000/payment";
export const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:3000";
export const BCRYPT_SECRET_KEY = process.env.BCRYPT_SECRET_KEY ?? "fsudckkncsdkjbvkjbkjsdbvjsdnvjsndjvn483984378hfewuibf2fjBHIYLDUCVHADJSKBHAGFLASHFKJHKKKKKKKKKKKdbhvsdigskdkvjsdkjvbisdvhhh"
export const NODE_ENV = process.env.NODE_ENV ?? "development"
export const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:5000" 

// Instasend related constants
export const INTASEND_PUBLISHABLE_KEY = process.env.INTASEND_PUBLISHABLE_KEY ?? "";
export const INTASEND_SECRET_KEY = process.env.INTASEND_SECRET_KEY ?? "";
export const INTASEND_IS_TEST = process.env.INTASEND_IS_TEST ? true : false; // Test ? Set true for test environment
export const INSTASEND_DEPOSIT_PERCENT = process.env.INSTASEND_DEPOSIT_PERCENT ? Number(process.env.INSTASEND_DEPOSIT_PERCENT) : 0.035
export const INSTASEND_WITHDRAWAL_CHARGE = process.env.INSTASEND_WITHDRAWAL_CHARGE ? Number(process.env.INSTASEND_WITHDRAWAL_CHARGE) : 10 // In USD
export const INSTASEND_WITHDRAWAL_LIMIT = process.env.INSTASEND_WITHDRAWAL_LIMIT ? Number(process.env.INSTASEND_WITHDRAWAL_LIMIT) : 5;

// Crpto related constants
export const CRYPTO_DEPOSIT_PERCENT = process.env.CRYPTO_DEPOSIT_PERCENT ? Number(process.env.CRYPTO_DEPOSIT_PERCENT) : 0.035;
export const CRYPTO_MERCHANT_ID = process.env.CRYPTO_MERCHANT_ID ?? ""
export const CRYPTO_PAYMENT_API_KEY = process.env.CRYPTO_PAYMENT_API_KEY ?? ""
export const CRYPTO_PAYOUT_API_KEY = process.env.CRYPTO_PAYOUT_API_KEY ?? ""
export const CRYTPOMUS_URI = process.env.CRYTPOMUS_URI ?? "https://api.cryptomus.com/v1"

// Currency related constants
export const CURRENCY_RATE_URL = "https://open.er-api.com/v6/latest"