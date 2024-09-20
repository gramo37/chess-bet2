import { Request, Response } from "express";
import { db } from "../../db";
import { bigIntReviver } from "../../utils";
import { depositMoneyToCompany,withdrawMoneyToUser } from "../../utils/payment";

export const depositMoney = async (req: Request, res: Response) => {
    try {
        console.log("Deposit Money: ", req.body);
        let { amount } = req.body;
        amount = Math.floor(amount);

        if (!amount || amount <= 0) {
            return res.status(400).json({
                message: "Please provide a valid amount to be deposited"
            });
        }

        const user: any = ((req?.user) as any)?.user;
        const currentBalance = bigIntReviver(user?.balance);

        // Initiate the transaction and set its status to 'PENDING'
        const transaction = await db.transaction.create({
            data: {
                userId: user.id,
                amount: amount,
                type: 'DEPOSIT',  
                status: 'PENDING', 
                // TODO: Temporary change
                signature: "",
                checkout_id: ""
            }
        });

        // Attempt to send the amount to the company's account
        const depositSuccess = await depositMoneyToCompany(amount, user);

        if (!depositSuccess) {
            // If sending to the company failed, update transaction status to 'CANCELLED'
            await db.transaction.update({
                where: { id: transaction.id },
                data: {
                    status: 'CANCELLED',
                }
            });
            return res.status(404).json({
                message: "Something went wrong when sending money to the company's account"
            });
        }

        // If sending to the company succeeded, update balance and mark transaction as 'COMPLETED'
        await db.$transaction([
            db.user.update({
                where: {
                    email: user.email
                },
                data: {
                    balance: currentBalance + BigInt(amount)
                }
            }),
            db.transaction.update({
                where: { id: transaction.id },
                data: {
                    status: 'COMPLETED',  // Mark transaction as completed
                }
            })
        ]);

        res.status(200).json({
            message: "Money deposited successfully!",
            transaction,  
        });
    } catch (error) {
        console.error("Error Depositing Money:", error);
        res.status(500).json({ message: "Internal server error", status: "error" });
    }
};

export const withdrawMoney = async (req: Request, res: Response) => {
    try {
        let { amount } = req.body;
        amount = Math.floor(amount);
        if (!amount || amount <= 0) {
            return res.status(400).json({
                message: "Please provide a valid amount to be withdrawn",
            });
        }

        const user: any = ((req?.user) as any)?.user;
        const currentBalance = bigIntReviver(user?.balance);
        
        if (BigInt(amount) > currentBalance) {
            return res.status(400).json({
                message: "Insufficient funds",
            });
        }

        // Initiate the transaction and set its status to 'PENDING'
        const transaction = await db.transaction.create({
            data: {
                userId: user.id,
                amount: amount,
                type: 'WITHDRAWAL',
                status: 'PENDING',
                // TODO: Temporary change
                signature: "",
                checkout_id: ""
            },
        });

        // Attempt to send the amount to the user's account
        const withdrawSuccess = await withdrawMoneyToUser(amount, user);

        if (!withdrawSuccess) {
            // If sending to the user failed, update transaction status to 'CANCELLED'
            await db.transaction.update({
                where: { id: transaction.id },
                data: {
                    status: 'CANCELLED',
                },
            });
            return res.status(500).json({
                message: "Something went wrong when sending money to the user's account",
            });
        }

        // If sending to the user succeeded, update balance and mark transaction as 'COMPLETED'
        await db.$transaction([
            db.user.update({
                where: {
                    email: user.email,
                },
                data: {
                    balance: currentBalance - BigInt(amount),
                },
            }),
            db.transaction.update({
                where: { id: transaction.id },
                data: {
                    status: 'COMPLETED',
                },
            }),
        ]);

        res.status(200).json({
            message: "Money withdrawn successfully!",
            transaction, // Return the transaction object
        });
    } catch (error) {
        console.error("Error withdrawing Money:", error);
        res.status(500).json({ message: "Internal server error", status: "error" });
    }
};


export const transactionHistory = async (req: Request, res: Response) => {
    try {
        const user: any = ((req?.user) as any)?.user; 
        console.log('working2');

        const transactions = await db.transaction.findMany({
            where: {
                userId: user.id,              },
            orderBy: {
                createdAt: 'desc',  
            },
        });
console.log('working1');

        res.status(200).json({
            message: "Transaction history retrieved successfully!",
            transactions,
        });
    } catch (error) {
        console.error("Error fetching transaction history:", error);
        res.status(500).json({ message: "Internal server error", status: "error" });
    }
};
