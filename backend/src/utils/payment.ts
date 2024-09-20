import { db } from "../db";

type TUser = {
    id: string;
    name: string | null;
    email: string;
    rating: number;
    balance: bigint;
} | null

// Function to send money from user -> company account
export const depositMoneyToCompany = async (amount: number, user: TUser) => {
    try {
        if (!user || !user?.id) return false;
        console.log("Deposit Money to company", amount, "Received from", user)
        const status = C2B();
        await db.transaction.create({
            data: {
                user: {
                    connect: { id: user.id }
                },
                amount,
                type: "DEPOSIT",
                status: status ? "COMPLETED" : "CANCELLED",
                // TODO: Temporary change
                signature: "",
                checkout_id: ""
            }
        })
        return true;
    } catch (error) {
        console.log("Error in payment to company", error);
        return false;
    }
}

// Function to send money from company -> user
export const withdrawMoneyToUser = async (amount: number, user: TUser) => {
    try {
        if (!user || !user?.id) return false;
        console.log("Deposit Money to user", amount, "Received from", user)
        const status = B2C();
        await db.transaction.create({
            data: {
                user: {
                    connect: { id: user.id }
                },
                amount,
                type: "WITHDRAWAL",
                status: status ? "COMPLETED" : "CANCELLED",
                // TODO: Temporary change
                signature: "",
                checkout_id: ""
            }
        })
        return true;
    } catch (error) {
        console.log("Error in payment to user", error);
        return false;
    }
}

function C2B() {
    try {
        return true;
    } catch (error) {
        console.log("Something went wrong in Customer to Business transaction", error);
        return false;
    }
}

function B2C() {
    try {
        return true;
    } catch (error) {
        console.log("Something went wrong in Business to Customer transaction", error);
        return false;
    }
}