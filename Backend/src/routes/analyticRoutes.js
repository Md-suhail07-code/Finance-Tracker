import express from "express";
import { getAnalytics, monthlyComparision } from "../controllers/analyticsController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/overview", protect, getAnalytics);
router.get("/monthly-comparison", protect, monthlyComparision);

export default router;
