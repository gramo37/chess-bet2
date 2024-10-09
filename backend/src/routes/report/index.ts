import express from "express";
import { createReport, fetchReports, updateReportStatus} from "../../controllers/report";
import { authenticateJWT, authorizeAdmin } from "../../middlewares/auth";
import { fetchMessages, sendMessage } from "../../controllers/report/reportmessages";

const router = express.Router();

// User routes
router.post("/create-report", authenticateJWT, createReport);
router.get("/user-reports", authenticateJWT, fetchReports);
router.post("/send-report-message/:id",authenticateJWT,sendMessage);
router.get("/get-report-messages/:id",authenticateJWT,fetchMessages)
// Admin routes
router.patch("/update-report-status/:id", authenticateJWT, authorizeAdmin, updateReportStatus);

export default router;
