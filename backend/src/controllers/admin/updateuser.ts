import { Request,Response } from "express";
import { db } from "../../db";
import { SendUserActivationNotification, SendUserBannedNotification, SendUserSuspentionNotification } from "../auth/verify";

export async function UpdateUserRating(req:Request,res:Response){
    const { id } = req.params;

    const { amount } = req.body;

    if (!id || !amount) {
        return res.status(400).json({ error: "userId and amount are required" });
    }

    try {
        const user = await db.user.findUnique({
            where: { id: id },
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const updatedUser = await db.user.update({
            where: { id: id },
            data: { rating: amount },
        });

        res.status(200).json({ message: "User rating updated", user: updatedUser });
    } catch (error) {
        res.status(500).json({ error: "Failed to update user rating", details: error });
    }
}

export async function UpdateGameResult(req: Request, res: Response) {
    const { id } = req.params; // Game ID from the URL parameters
    const { result } = req.body; // New result from the request body

    if (!id || !result) {
        return res.status(400).json({ error: "Game ID and result are required" });
    }

    // Check if the provided result is a valid GameResult enum value
    if (!["WHITE_WINS","BLACK_WINS","DRAW"].includes(result)) {
        return res.status(400).json({ error: "Invalid game result" });
    }

    try {
        // Find the game in the database
        const game = await db.game.findUnique({
            where: { id: id },
        });

        if (!game) {
            return res.status(404).json({ error: "Game not found" });
        }

        // Update the game's result
        const updatedGame = await db.game.update({
            where: { id: id },
            data: { result: result ,gameOutCome:"ADMIN"},
        });

        res.status(200).json({ message: "Game result updated", game: updatedGame });
    } catch (error) {
        res.status(500).json({ error: "Failed to update game result", details: error });
    }
}
export async function UpdateUserBalance(req: Request, res: Response) {
    const { id } = req.params;

    const {  amount } = req.body;

    if (!id || !amount) {
        return res.status(400).json({ error: "userId and amount are required" });
    }

    try {
        const user = await db.user.findUnique({
            where: { id: id },
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const updatedUser = await db.user.update({
            where: { id: id },
            data: { balance:  amount },
        });

        res.status(200).json({ message: "User balance updated", user: updatedUser });
    } catch (error) {
        res.status(500).json({ error: "Failed to update user balance", details: error });
    }
}

export async function SuspendUserAccount(req: Request, res: Response) {
    const {id}=req.params

    if (!id) {
        return res.status(400).json({ error: "userId is required" });
    }
       
    try {
        const user = await db.user.findUnique({
            where: { id: id },
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if (user.status!=='ACTIVE') {
            return res.status(404).json({ error: "This user has been banned" });
        }

        const updatedUser = await db.user.update({
            where: { id: id },
            data: { status: "SUSPENDED" }, // Change this to a dedicated SUSPENDED role if needed
        });
        SendUserSuspentionNotification(updatedUser.email);

        res.status(200).json({ message: "User account suspended", user: updatedUser });
    } catch (error) {
        res.status(500).json({ error: "Failed to suspend user account", details: error });
    }
}

export async function ActiveUserAccount(req: Request, res: Response) {
    const {id}=req.params
    if (!id) {
        return res.status(400).json({ error: "userId is required" });
    }

    try {
        const user = await db.user.findUnique({
            where: { id: id },
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if (user.status!=='SUSPENDED') {
            return res.status(404).json({ error: "This user has been banned" });
        }
        const updatedUser = await db.user.update({
            where: { id: id },
            data: { status: "ACTIVE" }, // Change this to a dedicated SUSPENDED role if needed
        });
        SendUserActivationNotification(updatedUser.email);
        

        res.status(200).json({ message: "User account Activated", user: updatedUser });
    } catch (error) {
        res.status(500).json({ error: "Failed to suspend user account", details: error });
    }
}



export async function BannedUserAccount(req: Request, res: Response) {
    const { id } = req.params;
    const {message}=req.body;

    if (!id) {
        return res.status(400).json({ error: "userId is required" });
    }

    try {
        // Find the user by ID
        const user = await db.user.findUnique({
            where: { id: id },
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const updatedUser = await db.user.update({
            where: { id: id },
            data: { status: "BANNED" }, 
        });
        
        SendUserBannedNotification(updatedUser.email,message);

        res.status(200).json({ message: "User account Banned" });
    } catch (error) {
        res.status(500).json({ error: "Failed to ban user account", details: error });
    }
}


