const keywords = [
  "urgent",
  "verify",
  "blocked",
  "otp",
  "upi",
  "payment",
  "click",
  "link",
  "bank",
  "reward",
  "lottery"
];

module.exports = function detectScam(text = "") {
  const t = text.toLowerCase();

  let score = 0;

  keywords.forEach(k => {
    if (t.includes(k)) score++;
  });

  return score >= 2;
};
