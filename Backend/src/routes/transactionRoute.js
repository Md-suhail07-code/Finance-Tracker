import express from "express";
import protect from "../middleware/authMiddleware.js";
import { 
  createTransaction, 
  getTransactions, 
  getTransactionById, 
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

export default router;
