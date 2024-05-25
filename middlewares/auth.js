const { verifyToken } = require("./jwt/jwt"); // Ensure correct path to jwt.js

const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (token) {
    const decoded = verifyToken(token);
    if (decoded) {
      req.user = decoded;
      next();
    } else {
      res.status(400).send("Invalid token");
    }
  } else {
    res.status(401).send("Token required");
  }
};

module.exports = authenticateJWT;
