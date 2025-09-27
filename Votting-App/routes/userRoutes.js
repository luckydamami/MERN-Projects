const express = require("express");
const userRouter = express.Router();
const { jwtAuthMiddleware, generateToken } = require("../jwt");
const User = require("../models/user");

userRouter.post("/signup", async (req, res) => {
  try {
    //assuming the user data from req body.
    const userData = req.body;

    //create a new user document using the Mongoose model.
    const userObj = new User(userData);

    const response = await userObj.save();
    console.log("Data Added Successfully!");

    let payload = {
      id: response.id,
    };
    console.log(JSON.stringify(payload));
    const token = generateToken(payload);
    console.log("Generated token : ", token);
    res.status(200).json({ response: response, token: token });
  } catch (error) {
    console.log("Some error was occured!");
    res.status(500).json({ error: "server side issue!" });
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { aadharNumber, password } = req.body;

    const user = await User.findOne({ aadharNumber: aadharNumber });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: `Invalid user login details!` });
    }
    let payload = {
      id: user.id,
      username: user.name,
    };
    const token = generateToken(payload);
    res.status(200).json({ token });
  } catch (error) {
    console.log(error, "user authentication error!");
    res.status(401).json({ error: "Login error!!" });
  }
});

userRouter.get("/profile", async (req, res) => {
  try {
    const userData = req.user;
    const userId = userData.id;
    const user = await User.findById({ userId });

    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error!" });
  }
});

userRouter.put("/profile/password", async (req, res) => {
  try {
    const userId = req.user; //extract the id from the token;
    const { currentPassword, newPassword } = req.body;

    const user = User.findById({ userId });

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ error: "Invalid username and password!" });
    }
  } catch (error) {
    console.log(err);
    res.status(200).json({ error: "Internal server Error!" });
  }
});
