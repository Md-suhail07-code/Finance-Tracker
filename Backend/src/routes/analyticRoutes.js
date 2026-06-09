import express from "express";
import { getAnalytics, monthlyComparision, categoryDistribution, budgetPerformance, spendingTrend, healthScore } from "../controllers/analyticsController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/overview", protect, getAnalytics);
router.get("/monthly-comparison", protect, monthlyComparision);
router.get("/category-distribution", protect, categoryDistribution);
router.get("/budget-performance", protect, budgetPerformance);
router.get("/spending-trend", protect, spendingTrend);
router.get("/financial-score", protect, healthScore);

export default router;
