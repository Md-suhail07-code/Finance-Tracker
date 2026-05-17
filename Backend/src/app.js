import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoute.js";
import transactionRoutes from "./routes/transactionRoute.js";
import categoryRoutes from "./routes/categoryRoute.js";
import budgetRoutes from "./routes/budgetRoute.js";
import analyticRoutes from "./routes/analyticRoutes.js";
import aiRoutes from "./routes/aiRoute.js";

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
app.use("/api/budget", budgetRoutes);
app.use("/api/analytics", analyticRoutes);
app.use("/api/ai", aiRoutes);


export default app;