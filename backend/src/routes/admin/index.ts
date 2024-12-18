import express from "express";
import {
  authenticateJWT,
  authorizeAdmin,
  authorizeAdminModrator,
} from "../../middlewares/auth";
import {
  createAdmin,
  getGames,
  getGame,
  GetTransaction,
  GetTransactions,
  getUser,
  getUsers,
  adminLogin,
  getAllReports,
  getUserByEmail,
  getBannedUsers,
  getModrators,
  getSuspendedUsers,
  getNewsLetterSubscriber,
} from "../../controllers/admin";
import {
  BannedUserAccount,
  SuspendUserAccount,
  UpdateUserBalance,
  UpdateUserRating,
  ActiveUserAccount,
  UpdateGameResult,
  MarkIssueCompleted,
} from "../../controllers/admin/updateuser";
import { DashboardStats, UserProfits } from "../../controllers/admin/stats";
import { createModrator } from "../../controllers/admin/modrators";

const router = express.Router();

router.post("/create-admin", createAdmin);
router.post("/login-admin", adminLogin);
router.post(`/create-modrator`, createModrator);

// Transaction routes
router.get(
  "/transactions/:page",
  authenticateJWT,
  authorizeAdmin,
  GetTransactions
);
router.get(
  "/transactions/:id",
  authenticateJWT,
  authorizeAdmin,
  GetTransaction
);

// User routes
router.get("/modrators", authenticateJWT, authorizeAdmin, getModrators);
router.get("/users/:page", authenticateJWT, authorizeAdminModrator, getUsers);
router.get("/banned", authenticateJWT, authorizeAdminModrator, getBannedUsers);
router.get(
  "/suspended",
  authenticateJWT,
  authorizeAdminModrator,
  getSuspendedUsers
);
router.get(
  "/userprofile/:id",
  authenticateJWT,
  authorizeAdminModrator,
  getUser
);
router.get(
  "/usersemail/:email",
  authenticateJWT,
  authorizeAdminModrator,
  getUserByEmail
);

// Newsletter Subscribers
router.get(
  "/newsletter-subscribers",
  authenticateJWT,
  authorizeAdmin,
  getNewsLetterSubscriber
);

// Game routes
router.get("/games/:page", authenticateJWT, authorizeAdmin, getGames);
router.get("/game/:id", authenticateJWT, authorizeAdmin, getGame);

//report Routes
router.get(
  "/reports/:page",
  authenticateJWT,
  authorizeAdminModrator,
  getAllReports
);
router.put(
  "/reportscomplete/:id",
  authenticateJWT,
  authorizeAdminModrator,
  MarkIssueCompleted
);

//update routes
router.put(
  "/users/:id/rating",
  authenticateJWT,
  authorizeAdminModrator,
  UpdateUserRating
);
router.put(
  "/users/:id/balance",
  authenticateJWT,
  authorizeAdmin,
  UpdateUserBalance
);
router.put(
  "/users/:id/suspend",
  authenticateJWT,
  authorizeAdmin,
  SuspendUserAccount
);
router.put(
  "/users/:id/active",
  authenticateJWT,
  authorizeAdmin,
  ActiveUserAccount
);
router.delete("/users/:id", authenticateJWT, authorizeAdmin, BannedUserAccount);
router.put(
  "/game/:id/result",
  authenticateJWT,
  authorizeAdmin,
  UpdateGameResult
);

//stats
router.get(
  "/users/:userId/profits",
  authenticateJWT,
  authorizeAdmin,
  UserProfits
);
router.get("/stats", authenticateJWT, authorizeAdmin, DashboardStats);
export default router;
