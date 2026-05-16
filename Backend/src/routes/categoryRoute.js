import express from "express";
import protect from "../middleware/authMiddleware.js";
import { createCategory, getCategories, updateCategory, deleteCategory } from "../controllers/categoryController.js";

const router = express.Router();

router.use(protect);

router.route("/")
    .post(createCategory)
    .get(getCategories);

router.route("/:id")
    .put(updateCategory)
    .delete(deleteCategory);

export default router;