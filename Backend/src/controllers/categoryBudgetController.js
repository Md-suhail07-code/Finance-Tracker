import prisma from "../config/prisma.js";

export const createCategoryBudget = async (req, res) => {
  try {
    const { categoryId, amount, month } = req.body;

    if (!categoryId || amount == undefined || !month) {
      return res.status(400).json({
        success: false,
        message: "Category ID and amount are required",
      });
    }

    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        userId: req.user.id,
      },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const categoryBudget = await prisma.categoryBudget.findFirst({
      where: {
        userId: req.user.id,
        month,
        categoryId,
      },
    });

    if (categoryBudget) {
      return res.status(400).json({
        success: false,
        message: "Budget for this category and month already exists",
      });
    }

    const newCategoryBudget = await prisma.categoryBudget.create({
      data: {
        categoryId,
        amount,
        month,
        userId: req.user.id,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Category budget created successfully",
      categoryBudget: {
        ...newCategoryBudget,
        category: {
          id: categoryId,
          name: category.name,
        },
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

export const updateCategoryBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    if (amount == undefined) {
      return res.status(400).json({
        success: false,
        message: "Amount is required",
      });
    }

    const existingCategoryBudget = await prisma.categoryBudget.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!existingCategoryBudget) {
      return res.status(404).json({
        success: false,
        message: "Category budget not found",
      });
    }

    const updatedCategoryBudget = await prisma.categoryBudget.update({
      where: { id },
      data: { amount },
    });

    return res.status(200).json({
      success: true,
      message: "Category budget updated successfully",
      categoryBudget: updatedCategoryBudget,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
      error: error.message,
    });
  }
};

export const deleteCategoryBudget = async (req, res) => {
  try {
    const { id } = req.params;

    const existingCategoryBudget = await prisma.categoryBudget.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!existingCategoryBudget) {
      return res.status(404).json({
        success: false,
        message: "Category budget not found",
      });
    }

    await prisma.categoryBudget.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: "Category budget deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
      error: error.message,
    });
  }
};

export const getCategoryBudgets = async (req, res) => {
  try {
    const categoryBudgets = await prisma.categoryBudget.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        category: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Category budgets retrieved successfully",
      categoryBudgets,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
      error: error.message,
    });
  }
};

export const getCategoryBudgetByMonth = async (req, res) => {
  try {
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({
        success: false,
        message: "Month is required",
      });
    }

    const categoryBudgets = await prisma.categoryBudget.findMany({
      where: {
        userId: req.user.id,
        month,
      },
      include: {
        category: true,
      },
    });

    const enrichedBudgets = await Promise.all(
      categoryBudgets.map(async (budget) => {
        const spent = await prisma.transaction.aggregate({
          _sum: {
            amount: true,
          },
          where: {
            userId: req.user.id,
            categoryId: budget.categoryId,
            type: "EXPENSE",
          },
        });

        return {
          ...budget,
          spent: Number(spent._sum.amount || 0),
        };
      }),
    );

    return res.status(200).json({
      success: true,
      message: `Category budgets for ${month} month retrieved successfully`,
      categoryBudgets: enrichedBudgets,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
      error: error.message,
    });
  }
};
