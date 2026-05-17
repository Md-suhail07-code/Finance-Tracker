import express from "express";
import protect from "../middleware/authMiddleware.js";
import { 
  createTransaction, 
  getTransactions, 
  getTransactionById,
  getRecentTransactions,
  getTransactionsByCategory,
  updateTransaction, 
  deleteTransaction 
} from "../controllers/transactionController.js";

const router = express.Router();

router.use(protect);

router.route("/")
  .post(createTransaction)
  .get(getTransactions);

router.route("/:id")
  .get(getTransactionById)
  .put(updateTransaction)
  .delete(deleteTransaction);

router.get("/recent", getRecentTransactions);
router.get("/:categoryId", getTransactionsByCategory);

export default router;
