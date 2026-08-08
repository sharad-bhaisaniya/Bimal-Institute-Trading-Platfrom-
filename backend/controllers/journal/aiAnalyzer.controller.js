const axios = require('axios');

/**
 * @desc    Analyze user trades using OpenRouter AI
 * @route   POST /api/v1/ai/analyze-trades
 * @access  Private
 */
const analyzeTrades = async (req, res, next) => {
  try {
    const { trades } = req.body;

    if (!trades || !Array.isArray(trades) || trades.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of trades to analyze.',
      });
    }

    const apiKey = process.env.OPENROUTER_API_KEY || process.env.GEMINI_API_KEY; // fallback for convenience
    const openRouterModel = process.env.OPENROUTER_MODEL || "google/gemini-1.5-flash:free";
    
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: 'OPENROUTER_API_KEY is not configured in the environment.',
      });
    }

    // Prepare data for the prompt
    // Send all relevant trading details as requested by the user
    const tradesSummary = trades.map((t, i) => {
        return `Trade ${i + 1}:
- Script/Asset: ${t.asset || t.script_name || 'N/A'}
- Trade Type (Buy/Sell): ${t.type || 'N/A'}
- Time: ${t.entry_date || t.createdAt || 'N/A'}
- Quantity: ${t.quantity || 'N/A'}
- Entry Price: ${t.entry_price || 'N/A'}
- Exit Price: ${t.exit_price || 'Open'}
- Stop Loss (SL): ${t.stop_loss || 'N/A'}
- Target: ${t.take_profit || t.target || 'N/A'}
- Profit/Loss (P&L): ${t.pnl || '0'}
- Strategy/Setup: ${t.setup || t.strategy || 'N/A'}
- Remarks/Notes: ${t.notes || t.remarks || 'N/A'}`;
    }).join('\n\n');

    const prompt = `
You are an expert technical trading analyst and risk manager.
I am providing you with my recent trading history. 

CRITICAL INSTRUCTIONS:
1. DO NOT complain about sample sizes or missing fields. If a field is empty, simply ignore it. Do not tell me that I am missing data.
2. NEVER use Markdown tables. Always use standard bullet points so it is easy to read.
3. CORRECT P&L CALCULATION: For BUY, P&L = (Exit - Entry) * Qty. For SELL, P&L = (Entry - Exit) * Qty. Do not mix them up.
4. DISTINGUISH REALIZED LOSS FROM PLANNED RISK: If no SL was defined, say "Realized loss was X. Predefined risk cannot be determined." Do NOT call realized loss the "risk".
5. STOP LOSS RISK CALCULATION: Only calculate planned risk when a valid SL exists (BUY Risk = Entry-SL; SELL Risk = SL-Entry). Total Risk = Risk Per Unit * Qty.
6. R-MULTIPLE: 1R = Initial Planned Risk. Calculate current/realized P&L in terms of R-multiples if SL is defined. Never confuse Risk with Current Profit.
7. ACCOUNT RISK %: Account Risk % = Planned Risk / Account Equity * 100. If Account Equity is missing, say "Account equity not provided, cannot determine % risk."
8. EXIT REASON: Separate FACT from INTERPRETATION. If a user note says "exited early", say "The note suggests the exit may have been early", do not state "You panicked."
9. FACT / INTERPRETATION / RECOMMENDATION: Strictly separate what the data shows, what it might mean, and what the trader could improve.
10. PROFESSIONAL LANGUAGE: Avoid judgmental terms like "gambling", "reckless", or "bet the farm". Use professional, objective language.

My Trades:
${tradesSummary}

Please provide the analysis in Markdown format using STRICTLY this structure and nothing else:
1. **Summary**: Write EXACTLY ONE short paragraph (maximum 3 to 4 lines) summarizing the overall performance, P&L, and main mechanical issues or strengths. Keep it very concise.
2. **Recommendations**: Provide EXACTLY 3 to 6 bullet points of actionable trading advice. Focus on what is best to do and how to do it based on the data. Do NOT exceed 6 points. Do NOT use tables.
`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: openRouterModel,
        messages: [
          { role: "user", content: prompt }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        }
      }
    );

    const text = response.data.choices?.[0]?.message?.content || "No analysis generated.";

    res.status(200).json({
      success: true,
      data: text,
    });
  } catch (error) {
    console.error('AI Analysis Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to analyze trades with AI.',
    });
  }
};

module.exports = {
  analyzeTrades,
};
