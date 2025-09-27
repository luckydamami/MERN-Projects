const mongoose = require("mongoose");
require("dotenv").config();

//establish the connection in mongoDB database
mongoose.connect(`${process.env.MONGODB_URL}/Myvotting-app`);

//create the connection Object representing the mongoDb connection
const db = mongoose.connection;

db.on("connected", () => {
  console.log("MongoDB Database is connected || Successfuly");
});

db.on("disconnected", () => {
  console.log("MongoDB Database is disconnected");
});

db.on("error", (error) => {
  console.log("Database was error occured!!", error);
});

module.exports = db;
