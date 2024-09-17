import { Request, Response } from "express";
import { db } from "../../db";
import { bigIntReviver } from "../../utils";

export const depositMoney = async (req: Request, res: Response) => {
    try {
        const { amount } = req.body;

        if (!amount) return res.status(400).json({
            message: "Please Provide amount to be deposited"
        })

        const user: any = ((req?.user) as any)?.user;
        const currentBalance = bigIntReviver(user?.balance);
        // Send the amount to the company's account
        if (!(await depositMoney(amount, user))) {
            return res.status(404).json({
                message: "Something went wrong when sending money to companies account"
            })
        }
        // If that succeeds proceed to update the balance amount
        await db.user.update({
            where: {
                email: user.email
            },
            data: {
                balance: currentBalance + BigInt(amount)
            }
        })
        res.status(200).json({
            message: "Money deposited successfully!",
        })
    } catch (error) {
        console.error("Error Depositing Money:", error);
        res.status(500).json({ message: "Internal server error", status: "error" });
    }
}

export const withdrawMoney = async (req: Request, res: Response) => {
    try {
        const { amount } = req.body;

        if (!amount) return res.status(400).json({
            message: "Please Provide amount to be withdrawn"
        })

        const user: any = ((req?.user) as any)?.user;
        const currentBalance = bigIntReviver(user?.balance);
        if (BigInt(amount) > currentBalance) return res.status(404).json({
            message: "In-sufficient funds"
        })

        // Send the amount to the company's account
        if (!(await withdrawMoney(amount, user))) {
            return res.status(404).json({
                message: "Something went wrong when sending money to user's account"
            })
        }

        // If that succeeds proceed to update the balance amount
        await db.user.update({
            where: {
                email: user.email
            },
            data: {
                balance: currentBalance - BigInt(amount)
            }
        })
        res.status(200).json({
            message: "Money withdrawed successfully!",
        })
    } catch (error) {
        console.error("Error withdrawing Money:", error);
        res.status(500).json({ message: "Internal server error", status: "error" });
    }
}