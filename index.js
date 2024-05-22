const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs-extra");
const cors = require("cors");
const authenticateJWT = require("./middlewares/auth");

require("dotenv").config();

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

// All Routes
fs.readdirSync("./routes").map((r) => app.use("/api/v1/auth", require("./routes/" + r)));

// Example of a protected route
app.get("/protected", authenticateJWT, (req, res) => {
  res.send("This is a protected route. Your username is " + req.user.username);
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
