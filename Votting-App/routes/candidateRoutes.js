const express = require("express");
const candidateRouter = express.Router();
const Candidate = require("../models/candidate");

const checkRole = async (userId) => {
  try {
    const user = await Candidate.findById(userId);
    return user.role === "admin";
  } catch (error) {
    return false;
  }
};

//for creating new elector in post method
candidateRouter.post("/", async (req, res) => {
  try {
    if (!checkRole(req.user.id)) {
      return res.status(404).json({ message: "user has not admin role" });
    }
    const data = req.body;
    const newCandidate = new Candidate(data);
    const response = await newCandidate.save();
    console.log("New Elector is created!!");
    res.status(200).json({ response: response });
  } catch (error) {
    console.log("Internal server error:", error); // developer ke liye
    res.status(500).json({ error: "Internal server error" }); // user ke liye
  }
});

//for updating the details
candidateRouter.put("/:candidateID", async (req, res) => {
  try {
    if (!checkRole(req.user.id)) {
      return res.status(404).json({ message: "user has not admin role" });
    }
    const candidateID = req.params.candidateID;
    const updatedData = req.body;
  } catch (error) {
    console.log("Internal server error!");
    res.status(500).json({ error: "Internal server error!" });
  }
});
module.exports = candidateRouter;
