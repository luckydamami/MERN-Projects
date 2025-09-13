const express = require("express");
const app = express();
require("dotenv").config();

const bodyParser = require("body-parser");
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;

app.listen(PORT, (err) => {
  err
    ? console.log(`server run on port ${PORT}`)
    : console.log("Internal server error : ", err);
});
