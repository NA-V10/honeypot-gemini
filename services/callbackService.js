const axios = require("axios");

module.exports = async function sendCallback(payload) {
  try {
    await axios.post(process.env.GUVI_CALLBACK, payload, { timeout: 5000 });
  } catch (e) {
    console.log("Callback failed:", e.message);
  }
};
