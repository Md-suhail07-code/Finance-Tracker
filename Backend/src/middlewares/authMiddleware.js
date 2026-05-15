import jwt from "jsonwebtoken";
import prisma from "../config/prisma";

const protect = async (req, res, next) => {
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({
                success: false,
                message: "No token provided, authorization denied"
            })
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({
            where: { id: decoded.id }
        })
        if(!user){
            return res.status(401).json({
                success: false,
                message: "User not found, authorization denied"
            })
        }
        req.user = user;
        next();
    }
    catch(error){
        return res.status(401).json({
            success: false,
            message: "Not authorized, token failed",
            error: error.message
        })
    }
}

export default protect;