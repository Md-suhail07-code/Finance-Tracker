export const financialRuleEngine = (data) => {
  const {
    income,
    expense,
    savings,
    budgetUsage,
    highestCategory,
    highestCategoryAmount,
  } = data;

  const actionableTips = [];

  const criticalAlerts = [];

  if (income === 0) {
    criticalAlerts.push("No income records found for this month.");
  }

  if (expense > income) {
    criticalAlerts.push("Your expenses are higher than your income.");

    actionableTips.push({
      title: "Control Spending",

      description:
        "Review unnecessary expenses and reduce spending categories.",
    });
  }

  if (income > 0) {
    const savingPercentage = (savings / income) * 100;

    if (savingPercentage < 20) {
      actionableTips.push({
        title: "Increase Savings",

        description: "Try maintaining at least 20% savings from your income.",
      });
    }
  }

  if (budgetUsage > 90) {
    criticalAlerts.push("You have almost reached your monthly budget limit.");
  }

  if (budgetUsage > 100) {
    criticalAlerts.push("Your budget has exceeded the planned limit.");
  }

  if (highestCategory !== "None") {
    actionableTips.push({
      title: `${highestCategory} is your highest spending category`,

      description: `You spent ₹${highestCategoryAmount} in this category. Monitor this area carefully.`,
    });
  }

  if (actionableTips.length === 0) {
    actionableTips.push({
      title: "Healthy Financial Pattern",

      description: "Your spending pattern looks stable this month.",
    });
  }

  return {
    summary: `You earned ₹${income} and spent ₹${expense} this month.`,

    criticalAlerts,

    actionableTips,
  };
};
