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
        budget
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
      error: error.message,
    });
  }
}

export const getBudget = async (req, res) => {
    try{
        const { month } = req.query;
        if(!month){
            return res.status(400).json({
                success: false,
                message: "Month is required"
            })
        }

        const budget = await prisma.budget.findFirst({
            where: {
                userId: req.user.id,
                month
            }
        })

        if(!budget){
            return res.status(404).json({
                success: false,
                message: "Budget not found for this month"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Budget fetched successfully",
            budget
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Internal Server error",
            error: error.message
        })
    }
}

export const updateBudget = async (req, res) => {
    try{
        const { month } = req.query;
        const { amount } = req.body;
        if(!month || !amount){
            return res.status(400).json({
                success: false,
                message: "Month and amount are required"
            })
        }

        const budget = await prisma.budget.findFirst({
            where: {
                userId: req.user.id,
                month
            }
        })

        if(!budget){
            return res.status(404).json({
                success: false,
                message: `Budget not found for ${month} month`
            })
        }
        const updatedBudget = await prisma.budget.update({
            where: { id: budget.id },
            data: { amount }
        })

        return res.status(200).json({
            success: true,
            message: "Budget updated successfully",
            budget: updatedBudget
        })

    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Internal Server error",
            error: error.message
        })
    }
}

export const deleteBudget = async (req, res) => {
    try{
        const { month } = req.query;
        if(!month){
            return res.status(400).json({
                success: false,
                message: "Month is required"
            })
        }

        const budget = await prisma.budget.findFirst({
            where: {
                userId: req.user.id,
                month
            }
        })

        if(!budget){
            return res.status(404).json({
                success: false,
                message: `Budget not found for ${month} month`
            })
        }

        await prisma.budget.delete({
            where: { id: budget.id }
        })

        return res.status(200).json({
            success: true,
            message: "Budget deleted successfully"
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Internal Server error",
            error: error.message
        })
    }
}