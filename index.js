const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs-extra");
const cors = require("cors");

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

app.listen(port, "0.0.0.0", () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
