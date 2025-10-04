const express = require("express");
const userRouter = express.Router();
const { jwtAuthMiddleware, generateToken } = require("../jwt");
const User = require("../models/user");

//for user registration
userRouter.post("/signup", async (req, res) => {
  try {
    const data = req.body;
    const newUser = new User(data);
    const response = await newUser.save();
    console.log("Data Added Successfully!");

    let payload = {
      id: response.id,
    };
    const token = generateToken(payload);
    // console.log("Payload : ", JSON.stringify(payload));
    // console.log("Generated token : ", token);
    res.status(200).json({ response: response, token: token });
  } catch (error) {
    console.error("Signup error:", error);
    // handle duplicate email or validation errors
    if (error.code === 11000) {
      return res.status(409).json({ error: "Email already exists" });
    }
    return res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

//for user login
userRouter.post("/login", async (req, res) => {
  try {
    const { aadharNumber, password } = req.body;

    const user = await User.findOne({ aadharNumber: aadharNumber });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: `Invalid username and password!!` });
    }
    let payload = {
      id: user.id,
      username: user.name,
    };
    const token = generateToken(payload);
    console.log("User is successfully logged in!");

    res.status(200).json({ token });
  } catch (error) {
    console.log(error, "user authentication error!");
    res.status(401).json({ error: "Login error!!" });
  }
});

//for access the profile
userRouter.get("/profile", async (req, res) => {
  try {
    const userData = req.user;
    const userId = userData.id;
    //find the user in database through userId
    const user = await User.findById({ userId });
    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error!" });
  }
});

//for update the password
userRouter.put("/profile/password", async (req, res) => {
  try {
    const userId = req.user; //Extract the id from token
    const { currentPassword, newPassword } = req.body; //Extract current and new password from the req.body
    let user = await User.findById(userId);
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    user.password = newPassword;
    await user.save();
    console.log("Your Password Was Updated Successfully!!");
    res.status(200).json();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = userRouter;
