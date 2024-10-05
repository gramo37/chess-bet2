import { Request, Response } from "express";
import { db } from "../../db";
import { getFinalAmountInUSD } from "../../utils";

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
