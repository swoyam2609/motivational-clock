const API_KEY = process.env.REACT_APP_SARVAM_API_KEY;

export const fetchQuote = async () => {
  if (!API_KEY) {
    console.error("Sarvam API key is missing");
    return "Simplicity is the ultimate sophistication."; // Fallback quote
  }

  try {
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
              content: "Give me a short, powerful motivational quote. Just the quote text, no author, no quotes around it.",
              role: "user",
            },
          ],
          model: "sarvam-m",
        }),
      }
    );

    const data = await response.json();
    const quote = data?.choices?.[0]?.message?.content?.trim();

    return quote || "Stay hungry, stay foolish.";
  } catch (error) {
    console.error("Error fetching quote:", error);
    return "The only way to do great work is to love what you do.";
  }
};
