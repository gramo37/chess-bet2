import { Request, Response } from "express";
import { db } from "../../db";

export const createReport = async (req: Request, res: Response) => {
    try {
        const { title, description } = req.body;
        const user: any = ((req?.user) as any)?.user;

        if (!title || !description) {
            return res.status(400).json({
                message: "Please provide both a title and description for the report."
            });
        }

        // Create a new report
        const report = await db.userReport.create({
            data: {
                userId: user.id,
                title,
                description,
            },
        });

        res.status(201).json({
            message: "Report submitted successfully!",
            report,
        });
    } catch (error) {
        console.error("Error creating report:", error);
        res.status(500).json({ message: "Internal server error", status: "error" });
    }
};

export const fetchReports = async (req: Request, res: Response) => {
    try {
        const user: any = ((req?.user) as any)?.user;
        const reports = await db.userReport.findMany({
            where: {
                userId: user.id, // Fetch reports for this specific user
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        res.status(200).json({
            message: "Reports retrieved successfully!",
            reports,
        });
    } catch (error) {
        console.error("Error fetching reports:", error);
        res.status(500).json({ message: "Internal server error", status: "error" });
    }
};

export const updateReportStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!["PENDING", "RESOLVED", "REJECTED"].includes(status)) {
            return res.status(400).json({
                message: "Invalid status provided. Please choose from 'PENDING', 'RESOLVED', or 'REJECTED'."
            });
        }

        // Update the report's status
        const updatedReport = await db.userReport.update({
            where: { id },
            data: { status },
        });

        res.status(200).json({
            message: "Report status updated successfully!",
            updatedReport,
        });
    } catch (error) {
        console.error("Error updating report status:", error);
        res.status(500).json({ message: "Internal server error", status: "error" });
    }
};


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