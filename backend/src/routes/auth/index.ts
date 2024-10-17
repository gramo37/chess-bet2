import express from "express";
import {
  ForgotPassword,
  SubscribeNewsletter,
  login,
  refresh,
  resetPassword,
  signup,
  verifiyEmail,
  verifyResetToken,
  verifyToken,
} from "../../controllers/auth";
import { authenticateJWT, getUserProfits } from "../../middlewares/auth";
import {
  UpdateAccountBalanceWithCommission,
  getAllUserReferralDetails,
} from "../../controllers/users";

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
router.post(
  "/update-balance-commission",
  authenticateJWT,
  UpdateAccountBalanceWithCommission
);
router.post("/newsletter", SubscribeNewsletter);
export default router;
