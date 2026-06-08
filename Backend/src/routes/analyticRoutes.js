import express from "express";
import { getAnalytics, monthlyComparision, categoryDistribution, budgetPerformance, spendingTrend } from "../controllers/analyticsController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/overview", protect, getAnalytics);
router.get("/monthly-comparison", protect, monthlyComparision);
router.get("/category-distribution", protect, categoryDistribution);
router.get("/budget-performance", protect, budgetPerformance);
router.get("/spending-trend", protect, spendingTrend);

export default router;
