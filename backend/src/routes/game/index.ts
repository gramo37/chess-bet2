import express from "express";
import { getUserGameHistory} from "../../controllers/game";
import { authenticateJWT } from "../../middlewares/auth";
const router = express.Router();

router.get("/transaction-history",authenticateJWT,getUserGameHistory);

export default router;