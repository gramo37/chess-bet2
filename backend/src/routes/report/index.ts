import express from "express";
import { createReport, fetchReports, updateReportStatus, fetchAllReports } from "../../controllers/report";
import { authenticateJWT, authorizeAdmin } from "../../middlewares/auth";

const router = express.Router();

// User routes
router.post("/create-report", authenticateJWT, createReport);
router.get("/user-reports", authenticateJWT, fetchReports);

// Admin routes
router.patch("/update-report-status/:id", authenticateJWT, authorizeAdmin, updateReportStatus);
router.get("/all-reports", authenticateJWT, authorizeAdmin, fetchAllReports);

export default router;
