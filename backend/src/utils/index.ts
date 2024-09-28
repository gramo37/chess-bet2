import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { randomUUID } from "crypto";
import axios from "axios";
import { BCRYPT_SECRET_KEY, CURRENCY_RATE_URL } from "../constants";
import bcrypt from 'bcrypt';

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

// Function to create a hash
export async function createHash(password: string): Promise<string> {
  const saltRounds = 10;
  const passwordWithSecret = password + BCRYPT_SECRET_KEY;
  
  try {
    const hash = await bcrypt.hash(passwordWithSecret, saltRounds);
    return hash;
  } catch (error) {
    throw new Error('Error creating hash');
  }
}

// Function to compare a password with the stored hash
export async function compareHash(password: string, storedHash: string): Promise<boolean> {
  const passwordWithSecret = password + BCRYPT_SECRET_KEY;

  try {
    const isMatch = await bcrypt.compare(passwordWithSecret, storedHash);
    console.log("IS Matching", isMatch)

    return isMatch;
  } catch (error) {
    console.error('Error comparing hash');
    return false;
  }
}