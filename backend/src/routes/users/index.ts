import express from "express";
import { getActiveUsers, getAllUsers } from "../../controllers/users";

const router = express.Router();

router.get(`/active_users`, getActiveUsers);
router.get(`/all_users`, getAllUsers);

export default router;
