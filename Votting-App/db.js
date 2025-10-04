const mongoose = require("mongoose");

require("dotenv").config();

mongoose.connect(process.env.MONGODB_LOCAL_URI);

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
