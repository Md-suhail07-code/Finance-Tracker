import prisma from "../config/prisma.js";

export const getAnalytics = async (req, res) => {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const monthNum = now.getMonth() + 1;

    const month = `${year}-${String(monthNum).padStart(2, "0")}`;

    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 1);

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: req.user.id,
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
      include: { category: true },
      orderBy: { date: "desc" },
    });

    const budget = await prisma.budget.findFirst({
      where: {
        userId: req.user.id,
        month: month,
      },
    });

    if (transactions.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No transactions found for this month",
        analytics: {
          totalIncome: 0,
          totalExpense: 0,
          savings: 0,
          remainingBudget: budget ? Number(budget.amount) : null,
          totalTransactions: 0,
          categoryBreakdown: [],
          recentTransactions: [],
        },
      });
    }

    let totalIncome = 0;
    let totalExpense = 0;
    const categoryMap = {};

    transactions.forEach((transaction) => {
      const amount = Number(transaction.amount);

      if (transaction.type === "INCOME") {
        totalIncome += amount;
      } else {
        totalExpense += amount;
        const categoryName = transaction.category?.name ?? "Uncategorized";
        if (!categoryMap[categoryName]) {
          categoryMap[categoryName] = 0;
        }
        categoryMap[categoryName] += amount;
      }
    });

    const savings = totalIncome - totalExpense;
    const categoryBreakdown = Object.entries(categoryMap).map(
      ([category, amount]) => ({ category, amount }),
    );

    const remainingBudget = budget
      ? Number(budget.amount) - totalExpense
      : null;

    return res.status(200).json({
      success: true,
      message: "Analytics fetched successfully",
      analytics: {
        totalIncome,
        totalExpense,
        savings,
        remainingBudget,
        totalTransactions: transactions.length,
        categoryBreakdown,
        recentTransactions: transactions.slice(0, 5),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
      error: error.message,
    });
  }
};

export const monthlyComparision = async (req, res) => {
  try {
    const year = new Date().getFullYear();

    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year + 1, 0, 1);

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: req.user.id,
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
    });

    const monthlyData = Array(12)
      .fill(0)
      .map(() => ({ income: 0, expense: 0 }));

    transactions.forEach((transaction) => {
      const month = transaction.date.getMonth();
      const amount = Number(transaction.amount);
      if (transaction.type === "INCOME") {
        monthlyData[month].income += amount;
      } else {
        monthlyData[month].expense += amount;
      }
    });

    return res.status(200).json({
      success: true,
      message: "Monthly comparison fetched successfully",
      monthlyData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
      error: error.message,
    });
  }
};

export const categoryDistribution = async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: req.user.id,
      },
      include: { category: true },
    });

    if (transactions.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No transactions found",
        categoryDistribution: [],
      });
    }

    const categoryMap = {};

    transactions.forEach((transaction) => {
      if (transaction.type === "EXPENSE") {
        const amount = Number(transaction.amount);
        const categoryName = transaction.category?.name ?? "Uncategorized";
        if (!categoryMap[categoryName]) {
          categoryMap[categoryName] = 0;
        }
        categoryMap[categoryName] += amount;
      }
    });

    const categoryDistribution = Object.entries(categoryMap).map(
      ([category, amount]) => ({ category, amount }),
    );

    return res.status(200).json({
      success: true,
      message: "Category distribution fetched successfully",
      categoryDistribution,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
      error: error.message,
    });
  }
};

export const budgetPerformance = async (req, res) => {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const monthNum = now.getMonth() + 1;
    const month = `${year}-${String(monthNum).padStart(2, "0")}`;

    const budget = await prisma.budget.findFirst({
      where: {
        userId: req.user.id,
        month: month,
      },
    });

    const categoryBudgets = await prisma.categoryBudget.findMany({
      where: {
        userId: req.user.id,
        month: month,
      },
      include: { category: true },
    });

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: req.user.id,
        date: {
          gte: new Date(year, monthNum - 1, 1),
          lt: new Date(year, monthNum, 1),
        },
      },
      include: { category: true },
    });

    const categoryMap = {};

    transactions.forEach((transaction) => {
      if (transaction.type === "EXPENSE") {
        const amount = Number(transaction.amount);
        const categoryName = transaction.category?.name ?? "Uncategorized";
        if (!categoryMap[categoryName]) {
          categoryMap[categoryName] = 0;
        }
        categoryMap[categoryName] += amount;
      }
    });

    const budgetPerformance = categoryBudgets.map((catBudget) => {
      const categoryName = catBudget.category?.name ?? "Uncategorized";
      const spent = categoryMap[categoryName] || 0;
      const amount = Number(catBudget.amount);
      const remaining = amount - spent;
      const performance = amount > 0 ? (spent / amount) * 100 : 0;

      return {
        category: categoryName,
        budget: amount,
        spent,
        remaining,
        performance: Number(performance.toFixed(2)),
      };
    });

    return res.status(200).json({
      success: true,
      message: "Budget performance fetched successfully",
      budgetPerformance,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
      error: error.message,
    });
  }
};

export const spendingTrend = async (req, res) => {
  try {
    const year = new Date().getFullYear();
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year + 1, 0, 1);

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: req.user.id,
        date: { gte: startDate, lt: endDate },
        type: "EXPENSE",
      },
    });

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const monthlyTrend = Array(12)
      .fill(0)
      .map((_, i) => ({
        month: months[i],
        spent: 0,
      }));

    transactions.forEach((transaction) => {
      const month = transaction.date.getMonth();
      monthlyTrend[month].spent += Number(transaction.amount);
    });

    return res.status(200).json({
      success: true,
      message: "Monthly Trend fetched successfully",
      monthlyTrend,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
      error: error.message,
    });
  }
};

const toNumber = (val) => parseFloat(val) || 0; // handles string "210" or Decimal

const getSavingsRate = (transactions, year, monthNum) => {
  let totalIncome = 0;
  let totalExpense = 0;

  transactions.forEach((t) => {
    const d = new Date(t.date);
    if (d.getFullYear() === year && d.getMonth() + 1 === monthNum) {
      const amt = toNumber(t.amount);
      if (t.type === "INCOME") totalIncome += amt;
      if (t.type === "EXPENSE") totalExpense += amt;
    }
  });

  if (totalIncome === 0) return { score: 0, savingsRate: 0, income: 0, expense: 0 };

  const savings = totalIncome - totalExpense;
  const savingsRate = (savings / totalIncome) * 100;

  let score = 0;
  if (savingsRate >= 30) score = 40;
  else if (savingsRate >= 20) score = 30;
  else if (savingsRate >= 10) score = 20;
  else if (savingsRate >= 0) score = 10;

  return { score, savingsRate, income: totalIncome, expense: totalExpense };
};

const getBudgetScore = (spent, budgetAmount) => {
  const budget = toNumber(budgetAmount);
  if (!budget) return { score: 0, usage: 0 };

  const usage = (spent / budget) * 100;

  let score = 0;
  if (usage <= 80) score = 30;
  else if (usage <= 100) score = 20;
  else if (usage <= 120) score = 10;

  return { score, usage };
};

const getStabilityScore = (transactions, year, monthNum) => {
  const monthlyTotals = {};

  for (let i = 0; i < 3; i++) {
    const targetDate = new Date(year, monthNum - 1 - i, 1);
    const key = `${targetDate.getFullYear()}-${targetDate.getMonth() + 1}`;
    monthlyTotals[key] = 0;
  }

  transactions.forEach((t) => {
    if (t.type!== "EXPENSE") return;
    const d = new Date(t.date);
    const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
    if (key in monthlyTotals) {
      monthlyTotals[key] += toNumber(t.amount);
    }
  });

  const values = Object.values(monthlyTotals).filter(v => v > 0);
  if (values.length < 2) return { score: 15 };

  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const maxDiff = Math.max(...values) - Math.min(...values);
  const fluctuation = avg === 0? 0 : (maxDiff / avg) * 100;

  let score = 10;
  if (fluctuation <= 15) score = 30;
  else if (fluctuation <= 35) score = 20;

  return { score };
};

const getStatus = (score) => {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Average";
  return "Needs Improvement";
};

export const healthScore = async (req, res) => {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const monthNum = now.getMonth() + 1;
    const monthStr = `${year}-${String(monthNum).padStart(2, "0")}`;

    const startDate = new Date(year, monthNum - 3, 1);
    const endDate = new Date(year, monthNum, 1);

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: req.user.id,
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
      orderBy: { date: "desc" },
    });

    if (transactions.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No transactions found for health score",
        financialHealth: {
          score: 0,
          status: "Needs Improvement",
          savingsRate: 0,
          budgetUsage: 0,
          income: 0,
          expense: 0,
        },
      });
    }

    const monthlyBudget = await prisma.budget.findFirst({
      where: {
        userId: req.user.id,
        month: monthStr,
      },
    });

    const { score: savingsScore, savingsRate, income, expense } = getSavingsRate(
      transactions,
      year,
      monthNum
    );

    const { score: budgetScore, usage: budgetUsage } = getBudgetScore(
      expense,
      monthlyBudget?.amount
    );

    const { score: stabilityScore } = getStabilityScore(transactions, year, monthNum);

    const finalScore = savingsScore + budgetScore + stabilityScore;
    const status = getStatus(finalScore);

    return res.status(200).json({
      success: true,
      financialHealth: {
        score: finalScore,
        status,
        savingsRate: +savingsRate.toFixed(2),
        budgetUsage: +budgetUsage.toFixed(2),
        income,
        expense,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};