import dotenv from "dotenv";

dotenv.config();

export const INTASEND_PUBLISHABLE_KEY = process.env.INTASEND_PUBLISHABLE_KEY ?? "";
export const INTASEND_SECRET_KEY = process.env.INTASEND_SECRET_KEY ?? "";
export const INTASEND_IS_TEST = process.env.INTASEND_IS_TEST ? true : false; // Test ? Set true for test environment
export const INSTASEND_DEPOSIT_PERCENT = process.env.INSTASEND_DEPOSIT_PERCENT ? Number(process.env.INSTASEND_DEPOSIT_PERCENT) : 0.035
export const INSTASEND_WITHDRAWAL_CHARGE = process.env.INSTASEND_WITHDRAWAL_CHARGE ? Number(process.env.INSTASEND_WITHDRAWAL_CHARGE) : 10 // In USD
export const CURRENCY_RATE_URL = "https://open.er-api.com/v6/latest"
export const INSTASEND_WITHDRAWAL_LIMIT = process.env.INSTASEND_WITHDRAWAL_LIMIT ? Number(process.env.INSTASEND_WITHDRAWAL_LIMIT) : 10;

export const CURRENCY = process.env.INSTASEND_CURRENCY ?? "USD";
export const REDIRECT_URL = process.env.FRONTEND_URL ? `${process.env.FRONTEND_URL}/payment` : "http://localhost:3000/payment";
export const HOST = process.env.FRONTEND_URL ?? "http://localhost:3000";