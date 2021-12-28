const jwt = require("jsonwebtoken");
function generateAccessToken(email) {
  return jwt.sign(email, process.env.JWT_KEY, { expiresIn: "15m" });
}
module.exports = generateAccessToken;
