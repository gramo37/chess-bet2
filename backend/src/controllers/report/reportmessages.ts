import { Request, Response } from "express";
import { db } from "../../db";

// Send a message related to a report
export const sendMessage = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
const reportId = id
        const { content } = req.body;
        const user: any = ((req?.user) as any)?.user;

        console.log(reportId);
        if (!reportId || !content) {
            return res.status(400).json({
                message: "Please provide both a report ID and message content."
            });
        }
          
        // Check if the report exists
        const report = await db.userReport.findUnique({
            where: { id: reportId }
        });

        if (!report) {
            return res.status(404).json({
                message: "Report not found."
            });
        }
        const role = user.role;
        console.log(role);
        
        // Create a new message related to the report
        const message = await db.reportMessage.create({
            data: {
                reportId: reportId,
                sender:role,
                message:content
            },
        });

        res.status(201).json({
            message: "Message sent successfully!",
            messageData: message,
        });
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Internal server error", status: "error" });
    }
};

export const fetchMessages = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
     const reportId = id
        // Check if the report exists
        const report = await db.userReport.findUnique({
            where: { id: reportId }
        });

        if (!report) {
            return res.status(404).json({
                message: "Report not found."
            });
        }

        // Fetch messages related to this report
        const messages = await db.reportMessage.findMany({
            where: { reportId: reportId },
            orderBy: {
                createdAt: "asc",
            },
        });

        res.status(200).json({
            message: "Messages retrieved successfully!",
            messages,
        });
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Internal server error", status: "error" });
    }
};
