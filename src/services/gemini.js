const API_KEY = process.env.REACT_APP_SARVAM_API_KEY;

export const fetchQuote = async (currentQuote = '') => {
  if (!API_KEY) {
    console.error("Sarvam API key is missing");
    return {
      quote: "Simplicity is the ultimate sophistication.",
      author: "Leonardo da Vinci"
    };
  }

  try {
    let prompt = "Give me a short, powerful motivational quote with its author. Format your response as: QUOTE_TEXT | AUTHOR_NAME. Just the quote and author separated by a pipe symbol, no quotes around the quote text.";

    if (currentQuote) {
      prompt = `The current motivational quote is: "${currentQuote}". Give me a different short, powerful motivational quote with its author. Make sure it's completely different from the current one. Format your response as: QUOTE_TEXT | AUTHOR_NAME. Just the quote and author separated by a pipe symbol, no quotes around the quote text.`;
    }

    const response = await fetch(
      "https://api.sarvam.ai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "api-subscription-key": API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              content: prompt,
              role: "user",
            },
          ],
          model: "sarvam-m",
        }),
      }
    );

    const data = await response.json();
    const responseText = data?.choices?.[0]?.message?.content?.trim();

    // Parse the response to extract quote and author
    if (responseText && responseText.includes('|')) {
      const [quote, author] = responseText.split('|').map(s => s.trim());
      // Remove quotation marks from quote if present
      const cleanQuote = quote.replace(/^["'"]+|["'"]+$/g, '').trim();
      return {
        quote: cleanQuote || "Stay hungry, stay foolish.",
        author: author || "Steve Jobs"
      };
    }

    // Fallback if format is not as expected
    // Remove quotation marks from quote if present
    const cleanQuote = responseText ? responseText.replace(/^["'"]+|["'"]+$/g, '').trim() : "Stay hungry, stay foolish.";
    return {
      quote: cleanQuote,
      author: "Unknown"
    };
  } catch (error) {
    console.error("Error fetching quote:", error);
    return {
      quote: "The only way to do great work is to love what you do.",
      author: "Steve Jobs"
    };
  }
};
