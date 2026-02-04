module.exports = function (req, res, next) {
  const key =
    req.headers["x-api-key"] ||
    req.headers["api-key"] ||
    req.headers["authorization"]?.replace("Bearer ", "");

  if (!key || key !== process.env.API_KEY) {
    return res.status(401).json({
      status: "error",
      message: "Invalid API key"
    });
  }

  next();
};
