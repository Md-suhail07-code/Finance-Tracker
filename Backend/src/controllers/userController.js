import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    const { name, email, password } = req.body;
    try{
        if(!name || !email || !password){
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            })
        }
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        })
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
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

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            })
        }

        const user = await prisma.user.findUnique({
            where: { email }
        })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User does not exist"
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(400).json({
                success: false,
                message: "Invalid password"
            })
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server error",
            error: error.message
        })
    }
}

export const getProfile = async (req, res) => {
    try{
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { id: true, name: true, email: true }
        })

        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "User profile fetched successfully",
            user
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