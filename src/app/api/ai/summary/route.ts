import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

// Helper function to format numbers consistently
const formatNumber = (value: any) => {
  const num = Number(value);
  if (isNaN(num)) return "N/A";
  return num.toFixed(2);
};

export async function POST(req: NextRequest) {
  try {
    const { inputs, results } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not defined in .env.local");
      throw new Error("GEMINI_API_KEY is not defined");
    }
    
    // Log the data we're about to send to the AI
    console.log("Data for AI prompt:", { inputs, results });

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const prompt = `
      Analyze the following "Buy vs Rent" scenario and provide a short, 2-3 sentence summary.
      - Recommendation: ${results.recommendation}
      - Details: Home Price ${formatNumber(inputs.homePrice)}, Time Horizon ${inputs.timeHorizon} years, Interest Rate ${formatNumber(inputs.mortgageInterestRate)}%.
      - Owner's final equity would be ${formatNumber(results.finalPropertyValue)}.
      - Renter's final investment would be ${formatNumber(results.totalRenterInvestment)}.
      Explain the main reason for the recommendation in simple terms.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ summary: text });

  } catch (error) {
    console.error("Error in AI summary generation:", error);
    
    let errorMessage = "Failed to generate AI summary.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage, details: error }, { status: 500 });
  }
}
