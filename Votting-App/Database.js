// import mongoose from "mongoose";
// import dbName from "./dbName";

// const connectDB = async () => {
//   try {
//     const connectionIntstance = await mongoose.connect(
//       `${process.env.MONGODB_URL}/${dbName}`
//     );
//     console.log(
//       `\n MongoDB connected !! DB HOST:${connectionIntstance.connection.host}`
//     );
//   } catch (error) {
//     console.log("Database connection error", error);
//     process.exit(1);
//   }
// };

// const express = require("express");
// const app = express();

//first approach
/*(async () => {
  try {
    await mongoose.connect(`${process.env.URL}/${dbName}`);
    app.on("connected", () => {
      console.log("Database successfully connected!");
    });

    app.listen(process.env.PORT, (error) => {
      error
        ? console.log("Internal server error!", error)
        : console.log(
            `Server successfuly run on http://localhost:${process.env.PORT}`
          );
    });
  } catch (error) {
    console.log("Database Connection error!", error);
    throw error;
  }
})();*/
