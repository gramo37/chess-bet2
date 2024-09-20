import express from "express";
import { CURRENCY, HOST, INTASEND_IS_TEST, INTASEND_PUBLISHABLE_KEY, INTASEND_SECRET_KEY, REDIRECT_URL } from "../../constants";
import { transactionHistory } from "../../controllers/payments";
import { authenticateJWT } from "../../middlewares/auth";
import { db } from "../../db";

const router = express.Router();

// router.post("/deposit-money", authenticateJWT, depositMoney);
// router.post("/withdraw-money", authenticateJWT, withdrawMoney);

router.post("/get-payment-url", authenticateJWT, (req, res) => {
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
                api_ref: 'test', // Generate and store in transaction table
                redirect_url: REDIRECT_URL // Create a route like this in frotend
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
                }).then((data) => {
                    // Redirect user to URL to complete payment
                    res.status(200).json({
                        message: "Payment request successful",
                        paymentDetails: resp.url
                    })
                }).catch((err) => {
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
})

router.post("/success-transaction", authenticateJWT, async (req, res) => {
    try {
        const user: any = ((req?.user) as any)?.user;
        const { signature, checkout_id } = req.body;
        console.log(signature, checkout_id)
        // Check for the transaction using signature and checkout_id
        const transaction = await db.transaction.findFirst({
            where: {
                signature,
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
                        increment: BigInt(transaction.amount)
                    }
                },
                // data: {
                //     balance: currentBalance + BigInt(amount)
                // }
            }),
            db.transaction.update({
                where: { id: transaction.id },
                data: {
                    status: 'COMPLETED',  // Mark transaction as completed
                }
            })
        ]);

        await db.transaction.update({
            where: {
                id: transaction.id
            },
            data: {
                status: "COMPLETED"
            }
        })

        res.status(200).json({
            message: "Payment Successful",
        })

    } catch (error) {
        console.error("Internal Error:", error);
        res.status(500).json({ message: "Internal server error", status: "error" });
    }
})

router.get("/transaction-history",authenticateJWT,transactionHistory);
export default router;
