import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/ask", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // NEW OpenAI API FORMAT
    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: [
        {
          role: "system",
          content:
            "You are an AI Financial Advisor. Give simple financial guidance on investments, shares, SIP, mutual funds, budgeting and savings. Never give harmful advice.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const aiMessage = response.output[0].content[0].text;

    res.json({ reply: aiMessage });
  } catch (err) {
    console.error("AI API ERROR:", err);
    res.status(500).json({ error: "AI failed to generate response" });
  }
});

export default router;
