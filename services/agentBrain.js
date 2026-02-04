const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash" // faster + safer for hackathon
});

module.exports = async function agentBrain(messages) {
  try {
    const conversation = messages
      .map(m => `${m.sender}: ${m.text}`)
      .join("\n");

    const result = await Promise.race([
      model.generateContent(conversation),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), 8000)
      )
    ]);

    let text = result.response.text();
    text = text.replace(/```json|```/g, "").trim();

    return JSON.parse(text);

  } catch (err) {
    console.log("Gemini fallback:", err.message);

    // ✅ ALWAYS return safe object (never undefined)
    return {
      reply: "Why are you asking for my details?",
      extractedIntelligence: {
        bankAccounts: [],
        upiIds: [],
        phishingLinks: [],
        phoneNumbers: [],
        suspiciousKeywords: []
      },
      agentNotes: "Fallback used"
    };
  }
};
