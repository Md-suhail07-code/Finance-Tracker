import prisma from "../config/prisma.js";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { financialCalculation } from "../services/financialCalculation.js";
import { financialRuleEngine } from "../services/financialRuleEngine.js";

dotenv.config();

export const getAIInsights = async (req, res) => {
  try {
    const userId = req.user.id;

    const existingInsight = await prisma.aIInsight.findFirst({
      where: {
        userId,

        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    if (existingInsight) {
      return res.json({
        success: true,

        source: "cache",

        data: JSON.parse(existingInsight.content),
      });
    }

    const financialData = await financialCalculation(userId);

    const ruleInsights = financialRuleEngine(financialData);

    let finalInsights = ruleInsights;

    let source = "rule";

    try {
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
      });

      const prompt = `
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

        contents: prompt,

        config: {
          responseMimeType: "application/json",
        },
      });

      const aiResult = JSON.parse(response.text);

      if (aiResult) {
        finalInsights = aiResult;

        source = "gemini";
      }
    } catch (error) {
      console.log("Gemini failed, using rule engine", error.message);
    }

    const saved = await prisma.aIInsight.create({
      data: {
        content: JSON.stringify(finalInsights),

        userId,
      },
    });

    return res.status(200).json({
      success: true,

      source,

      insightId: saved.id,

      data: finalInsights,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,

      message: "AI Insight generation failed",

      error: error.message,
    });
  }
};
