import express from "express";
import { getStats, listUsers, deleteUser, listJobs, listApplications } from "../controllers/adminController.js";
import { listQueries, toggleQuery, deleteQuery } from "../controllers/contactController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();
router.use(protect, authorize("admin"));
router.get("/stats", getStats);
router.get("/users", listUsers);
router.delete("/users/:id", deleteUser);
router.get("/jobs", listJobs);
router.get("/applications", listApplications);
router.get("/queries", listQueries);
router.patch("/queries/:id", toggleQuery);
router.delete("/queries/:id", deleteQuery);
export default router;
