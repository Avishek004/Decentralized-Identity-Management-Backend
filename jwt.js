const jwt = require("jsonwebtoken");
const fs = require("fs-extra");
const path = require("node:path");

const privateKey = fs.readFileSync(path.resolve(__dirname, "private.pem"), "utf8");
const publicKey = fs.readFileSync(path.resolve(__dirname, "public.pem"), "utf8"); // Change this to a secure random key

const generateToken = (payload) => {
  return jwt.sign(payload, privateKey, { expiresIn: "1h", algorithm: "RS256" }); // Token valid for 1 hour
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, publicKey, { algorithms: ["RS256"] });
  } catch (error) {
    return null;
  }
};

module.exports = { generateToken, verifyToken };
