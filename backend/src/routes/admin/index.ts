import express from "express";
import { authenticateJWT,authorizeAdmin } from "../../middlewares/auth";
import { createAdmin, getGames,getGame, GetTransaction, GetTransactions, getUser, getUsers, adminLogin, getAllReports } from "../../controllers/admin";

const router = express.Router();

router.post("/create-admin",createAdmin);
router.post("/login-admin",adminLogin);
// Transaction routes
router.get("/transactions", authenticateJWT,authorizeAdmin, GetTransactions); 
router.get("/transactions/:id", authenticateJWT,authorizeAdmin, GetTransaction); 

// User routes
router.get("/users", authenticateJWT,authorizeAdmin, getUsers); 
router.get("/users/:id", authenticateJWT,authorizeAdmin, getUser);

// Game routes
router.get("/games", authenticateJWT,authorizeAdmin, getGames); 
router.get("/game/:id", authenticateJWT,authorizeAdmin, getGame);

//report Routes
router.get("/reports",authenticateJWT,authorizeAdmin,getAllReports);

export default router;