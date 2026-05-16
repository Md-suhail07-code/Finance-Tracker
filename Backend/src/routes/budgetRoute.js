import express from "express";
import protect from "../middleware/authMiddleware.js";
import { createBudget, getBudgetByMonth, getAllBudgets, deleteBudget, updateBudget } from "../controllers/budgetController.js";

const router = express.Router();

router.use(protect);

router.route("/")
    .post(createBudget)
    .get(getAllBudgets);

router.route("/:id")
    .put(updateBudget)
    .delete(deleteBudget);

router.get("/month", getBudgetByMonth);

export default router;