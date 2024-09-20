import { CURRENCY, INTASEND_IS_TEST, INTASEND_PUBLISHABLE_KEY, INTASEND_SECRET_KEY } from "../constants";


type TUser = {
    id: string;
    name: string | null;
    email: string;
    rating: number;
    balance: number;
} | null

// Function to send money from company -> user
export const withdrawMoneyToUser = async (amount: number, account: string, user: TUser) => {
    try {
        if (!user || !user?.id) return false;
        console.log("Deposit Money to user", amount, "Received from", user)

        const IntaSend = require('intasend-node');

        let intasend = new IntaSend(
            INTASEND_PUBLISHABLE_KEY,
            INTASEND_SECRET_KEY,
            INTASEND_IS_TEST,
        );

        let payouts = intasend.payouts();

        await payouts
            .mpesa({
                currency: CURRENCY,
                transactions: [{
                    name: user?.name ?? "",
                    account,
                    amount,
                    narrative: 'Withdrawal of Money by User'
                }]
            })
        return true;
    } catch (error) {
        console.log("Error in payment to user", error);
        return false;
    }
}