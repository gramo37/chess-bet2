import { Request,Response } from "express";
import { db } from "../../db";

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
        const updatedUser = await db.user.update({
            where: { id: id },
            data: { status: "SUSPENDED" }, // Change this to a dedicated SUSPENDED role if needed
        });

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
        const updatedUser = await db.user.update({
            where: { id: id },
            data: { status: "ACTIVE" }, // Change this to a dedicated SUSPENDED role if needed
        });

        res.status(200).json({ message: "User account Activated", user: updatedUser });
    } catch (error) {
        res.status(500).json({ error: "Failed to suspend user account", details: error });
    }
}

export async function DeleteUserAccount(req: Request, res: Response) {
    const { id } = req.params;

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

        await db.transaction.deleteMany({
            where: { userId: id },
          });
        // Store the deleted user's email in DeletedUser model
        await db.deletedUser.create({
            data: {
                email: user.email,
            },
        });

        // Delete the user
        await db.user.delete({
            where: { id: id },
        });

        res.status(200).json({ message: "User account and related data deleted" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete user account", details: error });
    }
}

export async function MarkIssueCompleted(req: Request, res: Response) {
    const {id}=req.params

    if (!id) {
        return res.status(400).json({ error: "reportId is required" });
    }
console.log(id);

    try {
        const updatedReport = await db.userReport.update({
            where: { id: id },
            data: { status: "RESOLVED" },
        });

        res.status(200).json({ message: "Report marked as completed", report: updatedReport });
    } catch (error) {
        res.status(500).json({ error: "Failed to update report status", details: error });
    }
}