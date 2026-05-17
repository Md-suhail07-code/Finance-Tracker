import express from "express";
import protect from "../middleware/authMiddleware.js";
import { getAIInsights } from "../controllers/aiController.js";

const router = express.Router();

router.use(protect);

router.get("/", getAIInsights);

export default router;