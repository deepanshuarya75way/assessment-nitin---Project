import express from "express";
import {
  applyToJob, getMyApplications, updateApplication, withdrawApplication,
  getJobApplications, decideApplication,
} from "../controllers/applicationController.js";
import { protect, authorize } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();
router.post("/:jobId", protect, authorize("user"), upload.single("resume"), applyToJob);
router.get("/mine", protect, authorize("user"), getMyApplications);
router.put("/:id", protect, authorize("user"), upload.single("resume"), updateApplication);
router.patch("/:id/withdraw", protect, authorize("user"), withdrawApplication);
router.get("/job/:jobId", protect, authorize("company", "admin"), getJobApplications);
router.patch("/:id/status", protect, authorize("company", "admin"), decideApplication);
export default router;
