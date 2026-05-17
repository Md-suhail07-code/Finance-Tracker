import prisma from "../config/prisma.js";

export const getAnalytics = async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId: req.user.id },
      include: { category: true },
    });

    if (transactions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No transactions found for analytics",
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

        const categoryName = transaction.category.name;

        if (!categoryMap[categoryName]) {
          categoryMap[categoryName] = 0;
        }

        categoryMap[categoryName] += amount;
      }
    });

    const balance = totalIncome - totalExpense;
    const categoryBreakdown = Object.entries(categoryMap).map(
      ([category, amount]) => ({
        category,
        amount,
      }),
    );

    return res.status(200).json({
      success: true,
      message: "Analytics fetched successfully",
      analytics: {
        totalIncome,
        totalExpense,
        balance,
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
