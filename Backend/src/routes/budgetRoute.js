import express from "express";
import protect from "../middleware/authMiddleware.js";
import { createBudget, getBudget, deleteBudget, updateBudget } from "../controllers/budgetController.js";

const router = express.Router();

router.post("/", protect, createBudget);
router.get("/", protect, getBudget);
router.delete("/:id", protect, deleteBudget);
router.put("/:id", protect, updateBudget);

export default router;