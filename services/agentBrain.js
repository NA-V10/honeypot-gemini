const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash"
});

module.exports = async function agentBrain(messages) {
  const conversation = messages
    .map(m => `${m.sender}: ${m.text}`)
    .join("\n");

  const prompt = `
You are Naveen, a cautious middle-class Indian bank customer.

Act like a normal human chatting with someone suspicious.

Rules:
- NEVER say you are AI
- NEVER accuse them
- Ask simple questions
- Be confused/curious
- Try to extract details

Return ONLY JSON:

{
  "reply": "...",
  "extractedIntelligence": {
    "bankAccounts": [],
    "upiIds": [],
    "phishingLinks": [],
    "phoneNumbers": [],
    "suspiciousKeywords": []
  },
  "agentNotes": "..."
}

Conversation:
${conversation}
`;

  const result = await model.generateContent(prompt);

  let text = result.response.text();

  text = text.replace(/```json|```/g, "").trim();

  return JSON.parse(text);
};
