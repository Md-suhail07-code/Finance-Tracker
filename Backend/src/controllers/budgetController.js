import prisma from "../config/prisma.js";

export const createBudget = async (req, res) => {
  try {
    const { amount, month } = req.body;
    if (!amount || !month) {
      return res.status(400).json({
        success: false,
        message: "Amount and month are required",
      });
    }

    const monthRegex = /^\d{4}-(0[1-9]|1[0-2])$/;
    if (!monthRegex.test(month)) {
      return res.status(400).json({
        success: false,
        message: "Month must be in YYYY-MM format (e.g., 2026-05)",
      });
    }

    const existingBudget = await prisma.budget.findFirst({
      where: {
        userId: req.user.id,
        month,
      },
    });

    if (existingBudget) {
      return res.status(400).json({
        success: false,
        message: "Budget for this month already exists",
      });
    }

    const budget = await prisma.budget.create({
      data: {
        amount,
        month,
        userId: req.user.id,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Budget created successfully",
      budget,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
      error: error.message,
    });
  }
};

export const getBudgetByMonth = async (req, res) => {
  try {
    const { month } = req.query;
    if (!month) {
      return res.status(400).json({
        success: false,
        message: "Month is required",
      });
    }

    const budget = await prisma.budget.findFirst({
      where: {
        userId: req.user.id,
        month,
      },
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "Budget not found for this month",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Budget fetched successfully",
      budget,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
      error: error.message,
    });
  }
};

export const updateBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;
    if (amount == undefined) {
      return res.status(400).json({
        success: false,
        message: "Amount is required",
      });
    }

    const budget = await prisma.budget.findFirst({
      where: {
        userId: req.user.id,
        id,
      },
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: `Budget not found for id ${id}`,
      });
    }
    const updatedBudget = await prisma.budget.update({
      where: { id },
      data: { amount },
    });

    return res.status(200).json({
      success: true,
      message: "Budget updated successfully",
      budget: updatedBudget,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
      error: error.message,
    });
  }
};

export const deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;

    const budget = await prisma.budget.findFirst({
      where: {
        userId: req.user.id,
        id,
      },
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: `Budget not found for id ${id}`,
      });
    }

    await prisma.budget.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: "Budget deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
      error: error.message,
    });
  }
};

export const getAllBudgets = async (req, res) => {
    try{
        const budgets = await prisma.budget.findMany({
            where: { userId: req.user.id },
            orderBy: { month: "desc" }
        });

        return res.status(200).json({
            success: true,
            message: "Budgets fetched successfully",
            budgets
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Internal Server error",
            error: error.message
        })
    }
};