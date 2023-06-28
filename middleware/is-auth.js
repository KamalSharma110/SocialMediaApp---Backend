const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("Cannot find the authorization header");
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(" ")[1];

  let payload;
  try {
    payload = jwt.verify(token, "supersecretkey");
  } catch (err) {
    err.statusCode = 401;
    throw err;
  }

  if (!payload) {
    const error = new Error("Not authenticated");
    error.statusCode = 401;
    throw error;
  }

  next();
};
