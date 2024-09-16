import express from "express";
import { login, logout, refresh, signup, verifyToken } from "../../controllers/auth";
import { authenticateJWT } from "../../middlewares/auth";

const router = express.Router();

router.post(`/register`, signup);
router.post(`/login`, login);
router.get(`/refresh`, authenticateJWT, refresh);
router.get(`/verify/:token`, verifyToken);
router.get(`/logout`, logout);

export default router;
