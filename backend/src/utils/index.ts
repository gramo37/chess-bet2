import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { randomUUID } from "crypto";
import axios from "axios";
import { CURRENCY_RATE_URL } from "../constants";

dotenv.config();

const JWT_SECRET = process.env.SECRET_KEY ?? "SECRET_KEY";

export const generateToken = (obj: Object, expiresIn: string = "10h") => {
  const token = jwt.sign(obj, JWT_SECRET, {
    expiresIn,
  });
  return token;
};

export const verifyToken = (token: string) => {
  const decoded = jwt.verify(token, JWT_SECRET);
  return decoded;
};

export function generateUniqueId(): string {
  return randomUUID();
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

export function generateRandomPassword(length = 12) {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}

export async function getFinalAmountInUSD(amount: number, currency: string) {
  let rates: any = {};
  try {
    const response = await axios.get(`${CURRENCY_RATE_URL}/USD`);
    rates = response.data;
  } catch (error) {
    console.log("Error fetching currency rates", error);
    return false;
  }

  if (!rates || !rates?.rates || !rates?.rates?.[currency]) {
    console.log(
      `Currency "${currency}" not found in ->`,
      rates,
      rates?.rates,
      rates?.rates?.[currency]
    );
    return false;
  }

  return parseFloat((amount / rates.rates[currency]).toFixed(2));
}
