const express = require("express");
const app = express();
const { db } = require("./db");
require("dotenv").config();

const bodyParser = require("body-parser");
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;

const { jwtAuthMiddleware } = require("./jwt");

//routing files
const userRouter = require("./routes/userRoutes");
const candidateRouter = require("./routes/candidateRoutes");

app.get("/", (req, res) => {
  res.send("Welcome to my votting application!");
});

app.use("/user", userRouter);
app.use("/candidates", jwtAuthMiddleware, candidateRouter);

app.listen(PORT, (error) => {
  console.log(`server listen on port http://localhost${PORT}`);
});
