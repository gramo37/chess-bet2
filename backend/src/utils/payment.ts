import { CURRENCY, INTASEND_IS_TEST, INTASEND_PUBLISHABLE_KEY, INTASEND_SECRET_KEY } from "../constants";


type TUser = {
    id: string;
    name: string | null;
    email: string;
    rating: number;
    balance: number;
} | null

export const withdrawMoneyToUser = async (amount: number, account: string, user: TUser) => {
    try {
        if (!user || !user?.id) return false;
        console.log("Deposit Money to user", amount, "Received from", user)

        const IntaSend = require('intasend-node');

        console.log(
            "INSTASEND Details",
            INTASEND_PUBLISHABLE_KEY,
            INTASEND_SECRET_KEY,
            INTASEND_IS_TEST,
            typeof INTASEND_IS_TEST
          );

        let intasend = new IntaSend(
            INTASEND_PUBLISHABLE_KEY,
            INTASEND_SECRET_KEY,
            INTASEND_IS_TEST,
        );

        let payouts = intasend.payouts();

        console.log("User Details", user?.name, account, amount)

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