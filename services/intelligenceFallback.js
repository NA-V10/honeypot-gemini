module.exports = function fallbackExtract(messages) {
  const text = messages.map(m => m.text).join(" ");

  return {
    bankAccounts: text.match(/\d{4}-\d{4}-\d{4}/g) || [],
    upiIds: text.match(/[a-zA-Z0-9._-]+@[a-zA-Z]+/g) || [],
    phishingLinks: text.match(/https?:\/\/[^\s]+/g) || [],
    phoneNumbers: text.match(/\+91\d{10}/g) || [],
    suspiciousKeywords: ["urgent", "otp", "verify", "blocked"]
      .filter(k => text.toLowerCase().includes(k))
  };
};
