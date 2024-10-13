import express from "express";
import {
  ForgotPassword,
  login,
  refresh,
  resetPassword,
  signup,
  verifiyEmail,
  verifyResetToken,
  verifyToken,
} from "../../controllers/auth";
import { authenticateJWT, getUserProfits } from "../../middlewares/auth";
import { getAllUserReferralDetails } from "../../controllers/users";

const router = express.Router();

router.post(`/register`, signup);
router.post(`/login`, login);
router.get(`/refresh`, authenticateJWT, getUserProfits, refresh);
router.get(`/verify/:token`, verifyToken);
router.get("/verifyemail", authenticateJWT, verifiyEmail);
router.post("/forgotpassword", ForgotPassword);
router.get("/verifyResetToken/:token", verifyResetToken);
router.post("/updateforgotpassword", resetPassword);
router.get("/get-referral-details", authenticateJWT, getAllUserReferralDetails);

export default router;
