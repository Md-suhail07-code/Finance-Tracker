import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  createCategoryBudget,
  getCategoryBudgets,
  updateCategoryBudget,
  deleteCategoryBudget,
  getCategoryBudgetByMonth,
} from "../controllers/categoryBudgetController.js";

const router = express.Router();

router.use(protect);

router.route("/").post(createCategoryBudget).get(getCategoryBudgets);

router.route("/:id").put(updateCategoryBudget).delete(deleteCategoryBudget);

router.get("/month", getCategoryBudgetByMonth);

export default router;
