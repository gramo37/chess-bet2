import express from "express";
import { authenticateJWT,authorizeAdmin, authorizeAdminModrator } from "../../middlewares/auth";
import { createAdmin, getGames,getGame, GetTransaction, GetTransactions, getUser, getUsers, adminLogin, getAllReports } from "../../controllers/admin";
import { DeleteUserAccount, MarkIssueCompleted, SuspendUserAccount, UpdateUserBalance, UpdateUserRating,ActiveUserAccount } from "../../controllers/admin/updateuser";
import { BussinesProfits, DailyGames, UserProfits, UsersWinLoss } from "../../controllers/admin/stats";
import { createModrator } from "../../controllers/admin/modrators";

const router = express.Router();

router.post("/create-admin",createAdmin);
router.post("/login-admin",adminLogin);
router.post(`/create-modrator`, createModrator);

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
router.get("/reports",authenticateJWT,authorizeAdminModrator,getAllReports);


//update routes
router.put("/users/:id/rating", authenticateJWT, authorizeAdminModrator, UpdateUserRating);
router.put("/users/:id/balance", authenticateJWT, authorizeAdmin, UpdateUserBalance);
router.put("/users/:id/suspend", authenticateJWT, authorizeAdmin, SuspendUserAccount);
router.put("/users/:id/active", authenticateJWT, authorizeAdmin, ActiveUserAccount);
router.delete("/users/:id", authenticateJWT, authorizeAdmin, DeleteUserAccount);
router.put("/reports/:id/complete", authenticateJWT, authorizeAdmin, MarkIssueCompleted);

//stats
router.get("/stats/daily-games", authenticateJWT, authorizeAdmin, DailyGames);
router.get("/users/:userId/profits", authenticateJWT, authorizeAdmin, UserProfits);
router.get("/stats/business-profits", authenticateJWT, authorizeAdmin, BussinesProfits);
router.get("/stats/users-won-lost", authenticateJWT, authorizeAdmin, UsersWinLoss);

export default router;