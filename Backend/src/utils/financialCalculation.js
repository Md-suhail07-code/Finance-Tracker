import prisma from "../config/prisma.js";

export const financialCalculation = async (userId) => {
  const currentMonth = new Date().toISOString().slice(0, 7);

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: {
        gte: new Date(`${currentMonth}-01`),
      },
    },

    include: {
      category: true,
    },
  });

  const budget = await prisma.budget.findFirst({
    where: {
      userId,
      month: currentMonth,
    },
  });

  let income = 0;
  let expense = 0;

  const categoryMap = {};

  transactions.forEach((transaction) => {
    const amount = Number(transaction.amount);

    if (transaction.type === "INCOME") {
      income += amount;
    }

    if (transaction.type === "EXPENSE") {
      expense += amount;

      const category = transaction.category?.name || "Others";

      categoryMap[category] = (categoryMap[category] || 0) + amount;
    }
  });

  let highestCategory = "None";
  let highestAmount = 0;

  Object.entries(categoryMap).forEach(([category, value]) => {
    if (value > highestAmount) {
      highestAmount = value;
      highestCategory = category;
    }
  });

  const savings = income - expense;

  const budgetUsage =
    budget && Number(budget.amount) > 0
      ? (expense / Number(budget.amount)) * 100
      : 0;

  return {
    income,
    expense,
    savings,
    budget: budget ? Number(budget.amount) : 0,
    budgetUsage,
    highestCategory,
    highestCategoryAmount: highestAmount,
    transactionCount: transactions.length,
  };
};
