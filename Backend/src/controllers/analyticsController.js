import prisma from "../config/prisma.js";

export const getAnalytics = async (req, res) => {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const monthNum = now.getMonth() + 1;

    const month = `${year}-${String(monthNum).padStart(2, '0')}`;
    
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 1);

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: req.user.id,
        date: {
          gte: startDate,
          lt: endDate
        }
      },
      include: { category: true },
      orderBy: { date: 'desc' }
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
          remainingBudget: budget? Number(budget.amount) : null,
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
        const categoryName = transaction.category?.name?? "Uncategorized";
        if (!categoryMap[categoryName]) {
          categoryMap[categoryName] = 0;
        }
        categoryMap[categoryName] += amount;
      }
    });

    const savings = totalIncome - totalExpense;
    const categoryBreakdown = Object.entries(categoryMap).map(
      ([category, amount]) => ({ category, amount })
    );

    const remainingBudget = budget? Number(budget.amount) - totalExpense : null;

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