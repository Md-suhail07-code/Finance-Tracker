import prisma from "../config/prisma.js";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

export const getAIInsights = async (req, res) => {
    try {
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        
        const existingInsight = await prisma.aIInsight.findFirst({
            where: {
                userId: req.user.id,
                createdAt: { gte: twentyFourHoursAgo }
            },
            orderBy: { createdAt: "desc" }
        });

        if (existingInsight) {
            return res.status(200).json({
                success: true,
                message: "AI insights fetched from cache",
                source: "cache",
                insightId: existingInsight.id,
                createdAt: existingInsight.createdAt,
                data: JSON.parse(existingInsight.content) 
            });
        }

        const transactions = await prisma.transaction.findMany({
            where: { userId: req.user.id },
            include: { 
                category: { select: { name: true } } 
            },
            orderBy: { date: "desc" },
            take: 20
        });

        if (transactions.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No transactions found for AI insights"
            });
        }

        const formattedTransactions = transactions.map(t => ({
            type: t.type,
            amount: t.amount,
            category: t.category?.name || "Uncategorized",
            description: t.description || "",
            date: t.date.toISOString().split('T')[0]
        }));

        // 3. CALL GEMINI (Only happens once a day per user now!)
        const ai = new GoogleGenAI();
        const systemPrompt = `
            You are an expert personal financial advisor for "FinTrack".
            Analyze these specific transactions:
            ${JSON.stringify(formattedTransactions, null, 2)}

            Your output must be a single, valid JSON object containing exactly three keys:
            1. "summary": A high-level overview of the financial status (max 3 sentences).
            2. "criticalAlerts": An array of strings highlighting budget leaks or unusual spikes.
            3. "actionableTips": An array of objects, where each object has a "title" and a "description".

            Strict Rules:
            - Return ONLY raw JSON. No markdown blocks like \\\`\\\`\\\`json.
            - Do NOT include any explanatory text outside the JSON.
            - Ensure the JSON is well-formed and can be parsed without errors.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: systemPrompt,
            config: { responseMimeType: "application/json" }
        });

        const rawJsonString = response.text;
        const parsedInsights = JSON.parse(rawJsonString);

        const savedInsight = await prisma.aIInsight.create({
            data: {
                content: rawJsonString,
                userId: req.user.id
            }
        });

        return res.status(200).json({
            success: true,
            message: "AI insights generated successfully",
            source: "api",
            insightId: savedInsight.id,
            createdAt: savedInsight.createdAt,
            data: parsedInsights
        });

    } catch (error) {
        console.error("AI Insights Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server error",
            error: error.message
        });
    }
};
