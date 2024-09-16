import express from "express";
import { login, logout, refresh, signup, verifyToken } from "../../controllers/auth";
import { authenticateJWT } from "../../middlewares/auth";

const router = express.Router();

router.post(`/register`, signup);
router.post(`/login`, login);
router.post(`/refresh`, authenticateJWT, refresh);
router.post(`/verify/:token`, verifyToken);
router.post(`/logout`, logout);

export default router;
