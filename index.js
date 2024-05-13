const express = require("express");
const { Web3 } = require("web3");
const bodyParser = require("body-parser");
const fs = require("fs-extra");
const cors = require("cors");

require("dotenv").config();

// * Application

const app = express();

const port = 4000;

const corsOptions = {
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  optionSuccessStatus: 200,
};

app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use((req, res, next) => {
  delete req.headers.referer;
  next();
});

// * Routes
// fs.readdirSync("./routes").map((r) => app.use("/api/v1/pro", require("./routes/" + r)));

app.get("/api/getNonceForSigning", (req, res) => {
  const { address } = req.query;
  // Generate or retrieve a nonce associated with the user's address
  const nonce = "Please sign this message to log in: " + Math.random();
  res.json({ nonce });
});

app.post("/api/verifySignature", (req, res) => {
  const { signature, nonce, account } = req.body;
  const signer = web3.eth.accounts.recover(nonce, signature);
  if (signer.toLowerCase() === account.toLowerCase()) {
    res.json({ success: true, message: "Authentication successful" });
  } else {
    res.status(401).json({ success: false, message: "Authentication failed" });
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
