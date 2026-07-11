import express from "express";
import { getConversation } from "../controllers/messageController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();
router.get("/:otherUserId", protect, getConversation);
export default router;
