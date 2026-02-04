const express = require("express");
const router = express.Router();

const detectScam = require("../services/scamDetector");
const agentBrain = require("../services/agentBrain");
const fallbackExtract = require("../services/intelligenceFallback");
const sendCallback = require("../services/callbackService");

router.post("/", async (req, res) => {
  try {
    const { sessionId, message, conversationHistory = [] } = req.body;

   if (!sessionId || !message) {
  return res.json({
    status: "success",
    reply: "Hello"
  });
}


    const allMessages = [...conversationHistory, message];

    const scamDetected = detectScam(message.text);

    let reply = "Okay.";
    let intelligence = {
      bankAccounts: [],
      upiIds: [],
      phishingLinks: [],
      phoneNumbers: [],
      suspiciousKeywords: []
    };
    let agentNotes = "";

    if (scamDetected) {
      // Gemini AI brain
      const agentOutput = await agentBrain(allMessages);

      reply = agentOutput.reply;
      intelligence = agentOutput.extractedIntelligence;
      agentNotes = agentOutput.agentNotes;

      // fallback regex safety
      const fallbackIntel = fallbackExtract(allMessages);
      intelligence = mergeIntel(intelligence, fallbackIntel);

      // mandatory callback
      await sendCallback({
        sessionId,
        scamDetected: true,
        totalMessagesExchanged: allMessages.length,
        extractedIntelligence: intelligence,
        agentNotes
      });
    }

   res.json({
  status: "success",
  reply
});

  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: err.message });
  }
});

function mergeIntel(a = {}, b = {})
 {
  const merge = key => [...new Set([...(a[key] || []), ...(b[key] || [])])];

  return {
    bankAccounts: merge("bankAccounts"),
    upiIds: merge("upiIds"),
    phishingLinks: merge("phishingLinks"),
    phoneNumbers: merge("phoneNumbers"),
    suspiciousKeywords: merge("suspiciousKeywords")
  };
}

module.exports = router;
