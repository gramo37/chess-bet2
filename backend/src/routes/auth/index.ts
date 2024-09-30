import express from "express";
import { ForgotPassword, login,  refresh, resetPassword, signup,  verifyResetToken,  verifyToken } from "../../controllers/auth";
import { authenticateJWT, getUserProfits } from "../../middlewares/auth";

const router = express.Router();

router.post(`/register`, signup);
router.post(`/login`, login);
router.get(`/refresh`, authenticateJWT,getUserProfits, refresh);
router.get(`/verify/:token`, verifyToken);
router.post('/forgotpassword',ForgotPassword);
router.get('/verifyResetToken/:token',verifyResetToken);
router.post('/updateforgotpassword',resetPassword);



export default router;
