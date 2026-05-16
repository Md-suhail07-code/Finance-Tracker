import prisma from "../config/prisma.js"

export const createCategory = async (req, res) => {
    try{
        const { name, icon } = req.body;

        if(!name){
            return res.status(400).json({
                success: false,
                message: "Category name is required"
            })
        }

        const existingCategory = await prisma.category.findFirst({
            where: {
                name,
                userId: req.user.id
            }
        })

        const category = await prisma.category.create({
            data: {
                name,
                icon,
                userId: req.user.id
            }
        })

        return res.status(201).json({
            success: true,
            message: "Category created successfully",
            category
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

export const getCategories = async (req, res) => {
    try{
        const categories = await prisma.category.findMany({
            where: { userId: req.user.id },
            orderBy: { name: "asc" }
        });

        return res.status(200).json({
            success: true,
            message: "Categories fetched successfully",
            categories
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

export const updateCategory = async (req, res) => {
    try{
        const { id } = req.params;
        const { name, icon } = req.body;

        const category = await prisma.category.findUnique({
            where: { id }
        })

        if(!category){
            return res.status(404).json({
                success: false,
                message: "Category not found"
            })
        }

        if(category.userId !== req.user.id){
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            })
        }

        const updatedCategory = await prisma.category.update({
            where: { id },
            data: { name, icon }
        })

        return res.status(200).json({
            success: true,
            message: "Category updated successfully",
            category: updatedCategory
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

export const deleteCategory = async (req, res) => {
    try{
        const { id } = req.params;

        const category = await prisma.category.findUnique({
            where: { id }
        })

        if(!category){
            return res.status(404).json({
                success: false,
                message: "Category not found"
            })
        }

        if(category.userId !== req.user.id){
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            })
        }

        await prisma.category.delete({
            where: { id }
        })

        return res.status(200).json({
            success: true,
            message: "Category deleted successfully"
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