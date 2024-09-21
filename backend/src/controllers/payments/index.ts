import { Request, Response } from "express";
import { db } from "../../db";
import { withdrawMoneyToUser } from "../../utils/payment";
import { CURRENCY, HOST, INSTASEND_PLATFORM_PERCENT, INTASEND_IS_TEST, INTASEND_PUBLISHABLE_KEY, INTASEND_SECRET_KEY, REDIRECT_URL } from "../../constants";

export const getPaymentURL = async (req: Request, res: Response) => {
    try {
        console.log(INTASEND_PUBLISHABLE_KEY, INTASEND_SECRET_KEY);
        console.log("Deposit Money: ", req.body);
        let { amount } = req.body;
        amount = Math.floor(amount);

        if (!amount || amount <= 0) {
            return res.status(400).json({
                message: "Please provide a valid amount to be deposited"
            });
        }

        const IntaSend = require('intasend-node');
        const user: any = ((req?.user) as any)?.user;


        let intasend = new IntaSend(
            INTASEND_PUBLISHABLE_KEY,
            INTASEND_SECRET_KEY,
            INTASEND_IS_TEST,
        );

        let collection = intasend.collection();
        collection
            .charge({
                host: HOST,
                amount,
                currency: CURRENCY,
                api_ref: 'test', // TODO: Generate and store in transaction table
                redirect_url: REDIRECT_URL 
            })
            .then((resp: any) => {
                // Create a transaction entry as PENDING in db
                console.log(`Charge Resp:`, resp);
                // TODO: GET the deducted amount and add that in the transaction table
                if (!resp ?? !resp?.url ?? !resp?.signature ?? !resp?.id) {
                    console.error(`Charge details Not Found!!`, resp);
                    res.status(500).json({ message: "URL Not Found", status: "error" });
                }
                db.transaction.create({
                    data: {
                        user: {
                            connect: {
                                id: user.id
                            }
                        },
                        amount,
                        type: "DEPOSIT",
                        status: "PENDING",
                        signature: resp.signature,
                        checkout_id: resp.id
                    }
                }).then(() => {
                    // Redirect user to URL to complete payment
                    res.status(200).json({
                        message: "Payment request successful",
                        paymentDetails: resp.url
                    })
                }).catch((err: any) => {
                    console.error(`Charge error:`, err);
                    res.status(500).json({ message: "Something went wrong in adding data to transaction table", status: "error" });
                })
            })
            .catch((err: any) => {
                console.error(`Charge error:`, err);
                res.status(500).json({ message: "Invalid Request", status: "error" });
            });
    } catch (error) {
        console.error("Error Sending Payment URL:", error);
        res.status(500).json({ message: "Internal server error", status: "error" });
    }
}

export const successTransaction = async (req: Request, res: Response) => {
    try {
        const user: any = ((req?.user) as any)?.user;
        const { signature, checkout_id } = req.body;
        console.log(signature, checkout_id)
        // Check for the transaction using signature and checkout_id
        const transaction = await db.transaction.findFirst({
            where: {
                checkout_id
            },
            select: {
                id: true,
                amount: true
            }
        })

        console.log(transaction, "Transactions")

        if (!transaction) return res.status(404).json({ message: "Transaction not found", status: "error" })
        // Update transaction it as successful
        await db.$transaction([
            db.user.update({
                where: {
                    email: user.email
                },
                data: {
                    balance: {
                        increment: transaction.amount * (1 - INSTASEND_PLATFORM_PERCENT)
                    }
                },
            }),
            db.transaction.update({
                where: { id: transaction.id },
                data: {
                    status: 'COMPLETED',  // Mark transaction as completed
                }
            })
        ]);

        res.status(200).json({
            message: "Payment Successful",
        })

    } catch (error) {
        console.error("Internal Error:", error);
        res.status(500).json({ message: "Internal server error", status: "error" });
    }
}

export const withdrawMoney = async (req: Request, res: Response) => {
    try {
        let { amount, account } = req.body;
        amount = Math.floor(amount);

        if (!amount || amount <= 0) {
            return res.status(400).json({
                message: "Please provide a valid amount to be withdrawn",
            });
        }

        if (!account) {
            return res.status(400).json({
                message: "Please provide a valid account for sending amount",
            });
        }

        const user: any = ((req?.user) as any)?.user;
        const currentBalance = user?.balance;

        if (amount > currentBalance) {
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
        const withdrawSuccess = await withdrawMoneyToUser(amount, account, user);

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
                    balance: currentBalance - amount,
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
                userId: user.id,
            },
            orderBy: {
                createdAt: 'desc',
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
