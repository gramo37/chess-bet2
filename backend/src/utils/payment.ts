type TUser = {
    id: string;
    name: string | null;
    email: string;
    rating: number;
    balance: bigint;
} | null

// Function to send money from user -> company account
export const depositMoney = async (amount: number, user: TUser) => {
    try {
        console.log("Deposit Money to company", amount, "Received from", user)
        return true;
    } catch (error) {
        console.log("Error in payment to company", error);
        return false;
    }
}

// Function to send money from company -> user
export const withdrawMoney = async (amount: number, user: TUser) => {
    try {
        console.log("Deposit Money to user", amount, "Received from", user)
        return true;
    } catch (error) {
        console.log("Error in payment to user", error);
        return false;
    }
}