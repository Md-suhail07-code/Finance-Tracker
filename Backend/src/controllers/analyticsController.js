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
        }
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
        type: "EXPENSE"
      }
    });

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const monthlyTrend = Array(12).fill(0).map((_, i) => ({
      month: months[i],
      spent: 0
    }));

    transactions.forEach((transaction) => {
      const month = transaction.date.getMonth();
      monthlyTrend[month].spent += Number(transaction.amount);
    });

    return res.status(200).json({
      success: true,
      message: "Monthly Trend fetched successfully",
      monthlyTrend
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
      error: error.message
    })
  }
};