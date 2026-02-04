const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash"
});

module.exports = async function agentBrain(messages) {
  const conversation = messages
    .map(m => `${m.sender}: ${m.text}`)
    .join("\n");

  const prompt = `
You are a cautious middle-class Indian bank customer.
Act natural and suspicious.
Return ONLY JSON.

Conversation:
${conversation}
`;

  try {
    const result = await Promise.race([
      model.generateContent(prompt),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Gemini timeout")), 8000) // 8s max
      )
    ]);

    let text = result.response.text();

    text = text.replace(/```json|```/g, "").trim();

    return JSON.parse(text);

  } catch (err) {
    console.log("Gemini fallback triggered:", err.message);

    // 🚑 ALWAYS return instantly if Gemini fails
    return {
      reply: "Why are you asking for my details?",
      extractedIntelligence: {
        bankAccounts: [],
        upiIds: [],
        phishingLinks: [],
        phoneNumbers: [],
        suspiciousKeywords: []
      },
      agentNotes: "Fallback used due to timeout"
    };
  }
};
