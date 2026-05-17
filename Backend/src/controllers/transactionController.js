import prisma from "../config/prisma.js";

export const createTransaction = async (req, res) => {
  try {
    const { title, amount, type, categoryId, date, description } = req.body;

    const transaction = await prisma.transaction.create({
      data: {
        title,
        amount,
        type,
        description,
        date: new Date(date),
        categoryId,
        userId: req.user.id,
      },
      include: {
        category: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Transaction created successfully",
      transaction,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
      error: error.message,
    });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId: req.user.id },
      include: { category: true },
      orderBy: { date: "desc" },
    });
    return res.status(200).json({
      success: true,
      message: "Transactions fetched successfully",
      transactions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
      error: error.message,
    });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, type, categoryId, date, description } = req.body;
    const transaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    if (transaction.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to update this transaction",
      });
    }

    const updatedTransaction = await prisma.transaction.update({
      where: { id },
      data: {
        title,
        amount,
        type,
        description,
        date: new Date(date),
        categoryId,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Transaction updated successfully",
      transaction: updatedTransaction,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
      error: error.message,
    });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    if (transaction.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to delete this transaction",
      });
    }

    await prisma.transaction.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
      error: error.message,
    });
  }
};

export const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    if (transaction.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to view this transaction",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Transaction fetched successfully",
      transaction,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
      error: error.message,
    });
  }
};

export const getRecentTransactions = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    if (limit > 50) limit = 50;

    const transactions = await prisma.transaction.findMany({
      where: { userId: req.user.id },
      include: {
        category: {
          select: { id: true, name: true, icon: true },
        },
      },
      orderBy: { date: "desc" },
      take: limit,
    });

    return res.status(200).json({
      success: true,
      message: "Recent transactions fetched successfully",
      data: transactions,
      count: transactions.length,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch transactions",
      error: error.message,
    });
  }
};

export const getTransactionsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const transactions = await prisma.transaction.findMany({
        where: {
            userId: req.user.id,
            categoryId
         },
        include: {
            category: {
                select: { id: true, name: true, icon: true }
             }
         },
        orderBy: { date: "desc" }
    })

    if(transactions.length === 0){
        return res.status(404).json({
            success: false,
            message: "No transactions found for this category"
        })
    }

    return res.status(200).json({
        success: true,
        message: "Transactions fetched successfully",
        data: transactions,
        count: transactions.length
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch transactions",
      error: error.message,
    });
  }
};
