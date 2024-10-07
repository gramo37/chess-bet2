import { Request, Response } from "express";
import { db } from "../../db";
import { getFinalAmountInUSD } from "../../utils";
import { convertCryptoToUSD } from "./crypto";
import { BINANCE_API_KEY, BINANCE_SECRET_KEY, NODE_ENV } from "../../constants";

export const transactionHistory = async (req: Request, res: Response) => {
  try {
    const user: any = (req?.user as any)?.user;

    const transactions = await db.transaction.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        amount: true,
        currency: true,
        finalamountInUSD: true,
        type: true,
        status: true,
        createdAt: true,
        mode: true
      },
    });

    res.status(200).json({
      message: "Transaction history retrieved successfully!",
      transactions,
    });
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    res.status(500).json({ message: "Internal server error", status: "error" });
  }
};

export const getConvertedValue = async (req: Request, res: Response) => {
  try {
    let { amount, currency } = req.body;
    amount = Number(amount);
    if (!amount || !currency)
      return res.status(400).json({
        status: "error",
        message: "Please provide Amount and currency",
      });
    const finalamountInUSD = await getFinalAmountInUSD(amount, currency);
    res.status(200).json({
      status: "success",
      finalamountInUSD,
    });
  } catch (error) {
    console.log("error while conversion", error);
    res.status(500).json({
      status: "error",
      message: "Conversion error",
    });
  }
};

export const cryptoToUSD = async (req: Request, res: Response) => {
  try {
    let { amount, currency } = req.body;
    amount = Number(amount);
    if (!amount || !currency)
      return res.status(400).json({
        status: "error",
        message: "Please provide Amount and currency",
      });
    const finalamountInUSD = await convertCryptoToUSD(currency, amount);
    res.status(200).json({
      status: "success",
      finalamountInUSD,
    });
  } catch (error) {
    console.log("error while conversion", error);
    res.status(500).json({
      status: "error",
      message: "Conversion error",
    });
  }
};

export async function convertUSDToCrypto(symbol: string, amount: number) {
  try {
    // Get the latest price for the symbol (e.g., BTCUSDT, ETHUSDT)
    console.log("NODE_ENV", NODE_ENV, NODE_ENV === "development");

    if (NODE_ENV === "development")
      console.log("Secret Token", BINANCE_API_KEY, BINANCE_SECRET_KEY);

    const Binance = require("binance-api-node").default;
    const client = Binance({
      apiKey: BINANCE_API_KEY,
      apiSecret: BINANCE_SECRET_KEY,
    });

    const prices = await client.prices();

    // Symbol example: 'BTCUSDT' for Bitcoin to USD, 'ETHUSDT' for Ethereum to USD
    const cryptoSymbol = `${symbol.toUpperCase()}USDT`; // e.g., 'BTCUSDT' or 'ETHUSDT'

    // Get the current price in USD
    const usdPrice = parseFloat(prices[cryptoSymbol]);

    if (!usdPrice) {
      throw new Error(`Price not available for ${symbol}`);
    }

    // Calculate the equivalent USD value for the given crypto amount
    const usdValue = amount / usdPrice;

    console.log(
      `${amount} ${symbol} is equivalent to $${usdValue.toFixed(2)} USD`
    );
    return usdValue;
  } catch (error: any) {
    console.error("Error fetching price:", error.message);
  }
}

export const USDTocrypto = async (req: Request, res: Response) => {
  try {
    let { amount, currency } = req.body;
    amount = Number(amount);
    if (!amount || !currency)
      return res.status(400).json({
        status: "error",
        message: "Please provide Amount and currency",
      });
    const finalamountInCrypto = await convertUSDToCrypto(currency, amount);
    res.status(200).json({
      status: "success",
      finalamountInCrypto,
    });
  } catch (error) {
    console.log("error while conversion", error);
    res.status(500).json({
      status: "error",
      message: "Conversion error",
    });
  }
};
