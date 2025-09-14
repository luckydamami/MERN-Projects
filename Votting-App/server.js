const express = require("express");
const bodyParser = require("body-parser");

const { db } = require("../db");

const app = express();
app.use(bodyParser.json());

//type-1 to sending response
app.get("/", (req, res) => {
  res.send("Welcome to my website!");
  //res.send("<h1>Welcome to my website</h1><p>This is HTML response</p>");
  //res.json({ success: true, message: "This is json type response!" });
  //res.status(200).send("Welocome to my website!");
});

app.post("/data", async (req, res) => {
  res.status(200).json({ data });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, (error) => {
  if (!error) {
    console.log(`Server is running on port http://localhost:${PORT}`);
  } else {
    console.log("Error occured! server can't start", error);
  }
});
