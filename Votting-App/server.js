//imported packages
const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db");

var userRouter = require("./routes/userRoutes");

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log("User Authentication Middleware!!", req.method, req.url);
  next();
});
app.use(userRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, (error) => {
  console.log(`Server is listening on port http://localhost:${PORT}`);
});
