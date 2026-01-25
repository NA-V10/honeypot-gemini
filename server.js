require("dotenv").config();
const express = require("express");
const honeypotRoute = require("./routes/honeypot");
const apiKeyMiddleware = require("./utils/apiKeyMiddleware");

const app = express();

app.use(express.json({ limit: "10mb" }));

// protect API
app.use(apiKeyMiddleware);

app.use("/api/honeypot", honeypotRoute);

app.get("/", (req, res) => {
  res.send("Agentic Honeypot (Gemini) running 🚀");
});

app.listen(process.env.PORT, () =>
  console.log(`🔥 Server running on port ${process.env.PORT}`)
);
