import express from "express";
import protect from "../middleware/authMiddleware.js";
import { createTransaction, getTransactions, updateTransaction, deleteTransaction } from "../controllers/transactionController.js";

const router = express.Router();

router.get("/", protect, createTransaction);
router.get("/", protect, getTransactions);
router.put("/:id", protect, updateTransaction);
router.delete("/:id", protect, deleteTransaction);