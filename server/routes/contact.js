import express from "express";
import { getAdminContact, submitQuery } from "../controllers/contactController.js";

const router = express.Router();
router.get("/admin", getAdminContact);
router.post("/", submitQuery);
export default router;
