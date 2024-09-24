import express from "express";
import { authenticateJWT,authorizeAdmin } from "../../middlewares/auth";
import { createAdmin, getGames,getGame, GetTransaction, GetTransactions, getUser, getUsers, adminLogin, getAllReports } from "../../controllers/admin";
import { DeleteUserAccount, MarkIssueCompleted, SuspendUserAccount, UpdateUserBalance, UpdateUserRating,ActiveUserAccount } from "../../controllers/admin/updateuser";

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


//update routes
router.put("/users/:id/rating", authenticateJWT, authorizeAdmin, UpdateUserRating);
router.put("/users/:id/balance", authenticateJWT, authorizeAdmin, UpdateUserBalance);
router.put("/users/:id/suspend", authenticateJWT, authorizeAdmin, SuspendUserAccount);
router.put("/users/:id/active", authenticateJWT, authorizeAdmin, ActiveUserAccount);
router.delete("/users/:id", authenticateJWT, authorizeAdmin, DeleteUserAccount);
router.put("/reports/:id/complete", authenticateJWT, authorizeAdmin, MarkIssueCompleted);

export default router;