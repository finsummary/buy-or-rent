import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { calculateBuyVsRent } from "@/lib/calculator";
import { CalculatorInputs, NumericCalculatorInputs } from "@/types/calculator";

// Helper to convert string inputs to numeric inputs for the calculator function
const getNumericInputs = (inputs: CalculatorInputs): NumericCalculatorInputs => {
  const numericInputs: { [key: string]: any } = {};
  for (const key in inputs) {
    if (key === 'downPaymentType') {
      numericInputs[key] = inputs[key];
    } else if (key in inputs) {
      const value = Number((inputs as any)[key]);
      numericInputs[key] = isNaN(value) ? 0 : value;
    }
  }
  return numericInputs as NumericCalculatorInputs;
};

// --- SOLVER LOGIC ---

// Defines the directional impact of increasing a variable on the 'Buy' recommendation.
// true: Increasing the variable makes 'Buy' MORE likely (e.g., higher home appreciation).
// false: Increasing the variable makes 'Buy' LESS likely (i.e., 'Rent' more likely, e.g., higher interest rate).
const VARIABLE_DIRECTIONS: Record<keyof Omit<NumericCalculatorInputs, 'downPaymentType' | 'downPaymentAmount'>, boolean> = {
  homePrice: false,
  mortgageInterestRate: false,
  closingCosts: false,
  annualMaintenanceCosts: false,
  annualOwnershipCosts: false,
  monthlyRent: true, // Higher rent makes buying more attractive
  investmentReturnRate: false,
  
  homeAppreciationRate: true,
  rentIncreaseRate: true, // Higher rent increases make buying more attractive long-term
  timeHorizon: true,
  downPaymentPercentage: false, // higher downpayment % can make renting better if investment returns are high
};


// Uses binary search to find the breakeven value of a variable.
async function solveForVariable(
  initialInputs: CalculatorInputs,
  variable: keyof NumericCalculatorInputs,
  target: 'Buy' | 'Rent'
): Promise<number | null> {
    
  let low = 0;
  // Set a reasonable high boundary for the search
  let high: number;
  switch(variable) {
    case 'mortgageInterestRate':
    case 'investmentReturnRate':
    case 'homeAppreciationRate':
    case 'rentIncreaseRate':
      high = 30; // Search up to 30% for rates
      break;
    case 'homePrice':
      high = Number(initialInputs.homePrice) * 3; // Search up to 3x the original home price
      break;
    default:
      high = Number(initialInputs[variable as keyof CalculatorInputs]) * 5 || 100; // Generic fallback
  }

  // Determine the search direction
  const isIncreasingFavorsBuy = VARIABLE_DIRECTIONS[variable as keyof typeof VARIABLE_DIRECTIONS];
  if (isIncreasingFavorsBuy === undefined) {
    console.error(`Solver does not have a defined direction for variable: ${variable}`);
    return null; 
  }
  const isIncreasingFavorsTarget = (target === 'Buy') ? isIncreasingFavorsBuy : !isIncreasingFavorsBuy;

  let bestSoFar: number | null = null;
  const iterations = 100; // More iterations for higher precision

  for (let i = 0; i < iterations; i++) {
    const mid = low + (high - low) / 2;
    
    if (high - low < 1e-4) break; // Precision limit reached

    const newInputs: CalculatorInputs = {
      ...initialInputs,
      [variable]: String(mid),
    };
    
    const numericNewInputs = getNumericInputs(newInputs);
    const result = calculateBuyVsRent(numericNewInputs);

    if (result.recommendation === target) {
      bestSoFar = mid;
      if (isIncreasingFavorsTarget) {
        high = mid;
      } else {
        low = mid;
      }
    } else {
      if (isIncreasingFavorsTarget) {
        low = mid;
      } else {
        high = mid;
      }
    }
  }

  return bestSoFar;
}

// --- SEARCH FUNCTION ---
async function searchAndExtractNumericValue(query: string, genAI: GoogleGenerativeAI): Promise<{value: number | null, source: string | null}> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

  const searchPrompt = `
    Please search the web for the following query and provide a concise answer, focusing on a single numerical value if possible: "${query}"
  `;
  const searchResult = await model.generateContent(searchPrompt);
  const searchResponse = await searchResult.response;
  const searchContent = searchResponse.text();

  if (!searchContent) {
    return { value: null, source: null };
  }

  const extractionPrompt = `
    From the following text, please extract a single numerical value representing the core answer to the query "${query}".
    Return only the number, with no symbols, text, or explanation. If it's a percentage, just return the number (e.g., for 8.5%, return 8.5).
    If you cannot find a clear numerical answer, return "null".

    Text to analyze:
    ---
    ${searchContent}
    ---
  `;

  const extractionResult = await model.generateContent(extractionPrompt);
  const extractionResponse = await extractionResult.response;
  const extractedText = extractionResponse.text().trim();

  if (extractedText.toLowerCase() === 'null') {
    return { value: null, source: searchContent };
  }
  
  const numericValue = parseFloat(extractedText.replace(/[^0-9.-]/g, ''));
  
  if (isNaN(numericValue)) {
    return { value: null, source: searchContent };
  }

  return { value: numericValue, source: searchContent };
}


export async function POST(req: NextRequest) {
  try {
    const { inputs, userQuery } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not defined");
    }
    
    if (!userQuery) {
      return NextResponse.json({ error: "User query is missing." }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash-latest",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const fieldDescriptions = `
      - homePrice: The total price of the home.
      - downPaymentPercentage: The down payment as a percentage.
      - downPaymentAmount: The down payment as a fixed amount.
      - mortgageInterestRate: The annual mortgage interest rate.
      - timeHorizon: The number of years to forecast.
      - closingCosts: Closing costs as a percentage of home price.
      - annualMaintenanceCosts: Annual maintenance as a percentage of home price.
      - annualOwnershipCosts: Other annual costs (taxes, insurance) as a percentage of home price.
      - monthlyRent: The monthly rent amount.
      - homeAppreciationRate: Annual home price appreciation rate.
      - rentIncreaseRate: Annual rent increase rate.
      - investmentReturnRate: Annual return on investments.
    `;

    const prompt = `
      You are an expert financial calculator assistant. Your task is to analyze the user's request and provide a structured JSON response to control a "Buy vs Rent" calculator.

      First, determine the user's intent. The intent can be one of three types:
      1.  'update': The user wants to directly change one or more input values.
          Example: "What if the home price is $500,000 and the interest rate is 7.5%?"
      2.  'solve': The user wants to find a specific value for an input that results in a desired outcome.
          Example: "At what mortgage rate does buying become better?"
      3.  'search': The user is asking for a real-world financial data point that can be used as an input. The query usually contains words like "what is", "average", "historical", or refers to a specific index like "S&P 500".
          Example: "What was the average 30-year mortgage rate last week?" or "What's the historical return of the S&P 500?"

      Here are the available input fields:
      ${fieldDescriptions}

      Here are the current calculator values:
      ${JSON.stringify(inputs, null, 2)}

      The user's request is: "${userQuery}"

      Based on the user's intent, provide a JSON response with the following structure:
      
      - For 'update': { "type": "update", "updates": { "fieldName": "newValue" } }
      - For 'solve': { "type": "solve", "variable": "fieldName", "target": "Buy" or "Rent" }
      - For 'search': { "type": "search", "query": "a concise search query for Google", "variable": "fieldName" }
        - For 'search', formulate a clear, simple search query.
        - 'variable' is the field where the found value should be placed.
          - "S&P 500 return" or "stock market return" should map to 'investmentReturnRate'.
          - "mortgage rates" should map to 'mortgageInterestRate'.
          - "house price appreciation" should map to 'homeAppreciationRate'.

      - If you cannot understand the request, return: { "type": "error", "message": "I'm sorry, I couldn't understand that request." }

      Your entire output must be a single, valid JSON object. Do not add any explanation.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiResponse = JSON.parse(response.text());

    if (aiResponse.type === 'update') {
      return NextResponse.json({ type: 'update', data: aiResponse.updates });
    }

    if (aiResponse.type === 'solve') {
        const { variable, target } = aiResponse;

        if (!variable || !target || !Object.keys(inputs).includes(variable)) {
            throw new Error('AI returned an invalid "solve" task.');
        }

        const solvedValue = await solveForVariable(inputs, variable, target);

        if (solvedValue !== null) {
            // Return the single value to be updated
            return NextResponse.json({ 
              type: 'update', 
              data: { [variable]: String(solvedValue.toFixed(2)) } 
            });
        } else {
            return NextResponse.json({ 
              type: 'info', 
              message: `Could not find a value for ${variable} that makes renting preferable with current inputs.` 
            });
        }
    }
    
    if (aiResponse.type === 'search') {
      const { query, variable } = aiResponse;

      if (!query || !variable || !Object.keys(inputs).includes(variable)) {
        throw new Error('AI returned an invalid "search" task.');
      }

      const { value: searchedValue, source } = await searchAndExtractNumericValue(query, genAI);

      if (searchedValue !== null) {
        return NextResponse.json({
          type: 'update',
          data: { [variable]: String(searchedValue.toFixed(2)) },
          source: source
        });
      } else {
        return NextResponse.json({
          type: 'info',
          message: `I searched for "${query}" but couldn't find a specific number.`,
          source: source
        });
      }
    }

    if (aiResponse.type === 'error') {
        return NextResponse.json({ type: 'info', message: aiResponse.message });
    }

    throw new Error('Invalid response type from AI');

  } catch (error) {
    console.error("Error in AI scenario generation:", error);
    let errorMessage = "Failed to generate AI scenario.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ type: 'error', message: errorMessage, details: error }, { status: 500 });
  }
}
