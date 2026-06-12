import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoute.js";
import transactionRoutes from "./routes/transactionRoute.js";
import categoryRoutes from "./routes/categoryRoute.js";
import budgetRoutes from "./routes/budgetRoute.js";
import analyticRoutes from "./routes/analyticRoutes.js";
import aiRoutes from "./routes/aiRoute.js";
import categoryBudgetRoutes from "./routes/categoryBudgetRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Finance Tracker API is running");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/analytics", analyticRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/category-budgets", categoryBudgetRoutes);

app.get("/keep-alive", (req, res) => {
  res.send("Server is running");
});

setInterval(() => {
  fetch("https://finance-tracker-backend-wz6r.onrender.com/keep-alive")
  .then(() => {
    console.log("Server is running");
  })
  .catch((err) => {
    console.log("Server is not running");
    });
  }, 10 * 60 * 1000);

export default app;