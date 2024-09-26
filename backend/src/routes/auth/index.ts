import express from "express";
import { ForgotPassword, login,  refresh, resetPassword, signup,  verifyResetToken,  verifyToken } from "../../controllers/auth";
import { authenticateJWT } from "../../middlewares/auth";

const router = express.Router();

router.post(`/register`, signup);
router.post(`/login`, login);
router.get(`/refresh`, authenticateJWT, refresh);
router.get(`/verify/:token`, verifyToken);
router.post('/forgotpassword',ForgotPassword);
router.get('/verifyResetToken',verifyResetToken);
router.get('/updateforgotpassword',resetPassword);



export default router;
