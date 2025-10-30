const mongoose = require("mongoose");

require("dotenv").config();
const dbUrl = process.env.MONGODB_LOCAL_URI;
mongoose.connect(dbUrl);

const db = mongoose.connection;

db.on("connected", () => {
  console.log("Mongo DB database is connected!");
});

db.on("disconnected", () => {
  console.log("Mongo DB database is disconnected!");
});

db.on("error", (error) => {
  console.log("Oops! error was occured on mongodb server!", error);
});

module.exports = db;
