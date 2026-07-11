import express from "express";
import { getJobs, getJob, getMyJobs, createJob, updateJob, deleteJob } from "../controllers/jobController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();
router.get("/", getJobs);
router.get("/mine", protect, authorize("company", "admin"), getMyJobs);
router.get("/:id", getJob);
router.post("/", protect, authorize("company", "admin"), createJob);
router.put("/:id", protect, authorize("company", "admin"), updateJob);
router.delete("/:id", protect, authorize("company", "admin"), deleteJob);
export default router;
