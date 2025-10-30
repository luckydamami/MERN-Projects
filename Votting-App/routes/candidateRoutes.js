const express = require("express");
const candidateRouter = express.Router();
const Candidate = require("../models/candidate"); //for Candidate model
const User = require("../models/user"); //for User model
const { jwtAuthMiddleware } = require("../jwt");

const checkAdminRole = async (userID) => {
  try {
    const user = await User.findById(userID);
    return user.role === "admin";
  } catch (error) {
    return false;
  }
};

//for creating new elector in post method
candidateRouter.post("/", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id))) {
      return res.status(403).json({ message: "User has not admin role" });
    }
    const data = req.body;
    const newCandidate = new Candidate(data);
    const response = await newCandidate.save();
    console.log("Elector is created successfully!!");
    res.status(200).json({ response: response });
  } catch (error) {
    console.log("Internal server error:", error); // developer ke liye
    res.status(500).json({ error: "Internal server error" }); // user ke liye
  }
});

//for updating the details
candidateRouter.put("/:candidateID", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id))) {
      return res
        .status(403)
        .json({ message: "User does not have admin privileges" });
    }
    const candidateID = req.params.candidateID; //extract the candidateId from url perameter.
    const updatedCandidateData = req.body; //extract the updated data from req body

    const response = await Candidate.findByIdAndUpdate(
      candidateID,
      updatedCandidateData,
      {
        new: true, //return the updated document
        runValidators: true, // Run mongoose validation
      }
    );
    if (!response) {
      return res.status(404).json({ error: "Candidate not found!" });
    }

    console.log("Candidate data updated!");
    res.status(200).json(response);
  } catch (error) {
    console.log("Internal server error!", error);
    res.status(500).json({ error: "Internal server error!" });
  }
});

candidateRouter.delete("/:candidateID", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id))) {
      return res.status(403).json({ message: "user does not have admin role" });
    }
    const candidateID = req.params.candidateID;
    const response = await Candidate.findByIdAndDelete(candidateID);

    if (!response) {
      return res.status(404).json({ error: "Candidate not found!" });
    }

    console.log("Candidate deleted!!");
    res.status(200).json(response);
  } catch (error) {
    console.log("Internal server error!");
    res.status(500).json({ error: "Internal server error!" });
  }
});

candidateRouter.post(
  "/vote/:candidateID",
  jwtAuthMiddleware,
  async (req, res) => {
    const candidateID = req.params.candidateID;
    const userID = req.user.id;

    try {
      const candidate = await Candidate.findById(candidateID);
      if (!candidate) {
        return res.status(404).json({ message: "Candidate not found!" });
      }

      const user = await User.findById(userID);
      if (!user) {
        return res.status(404).json({ message: "user not found!" });
      }

      if (user.isvoted) {
        return res.status(404).json({ message: "you have already voted!" });
      }

      if (user.role === "admin") {
        return res.status(404).json({ message: "admin has can't voted!" });
      }

      //updated candidate document
      candidate.votes.push({ user: userID });
      candidate.voteCount++;
      await candidate.save();

      //user document updated succesfully
      user.isvoted = true;
      await user.save();
    } catch (error) {
      console.log("Internal server error!");
      res.status(500).json({ error });
    }
  }
);

candidateRouter.post(
  "/vote/:candidateID",
  jwtAuthMiddleware,
  async (req, res) => {
    const candidateID = req.params.candidateID;
    const userID = req.user.id;
    try {
      const candidate = await Candidate.findById(candidateID);
      if (!candidate) {
        return res.status(404).json({ message: "candidate not found" });
      }

      const user = await User.findById(userID);
      if (!user) {
        return res.status(404).json({ message: "user not found" });
      }
      //check some conditions
      if (user.isvoted) {
        return res.status(403).json({ message: "user has already voted!" });
      }
      if (user.role === "admin") {
        return res.status(403).json({ message: "admin can't vote!" });
      }

      //update candidate document
      candidate.votes.push({ user: userID });
      candidate.voteCount++;
      await candidate.save();

      //update user document
      user.isvoted = true;
      await user.save();
    } catch (error) {
      console.log("Internal server error!", error);
      return res.status(404).json({ error: "Internal server error!" });
    }
  }
);

candidateRouter.get("/vote/count", async (req, res) => {
  try {
    //Find all candidates and sort them by vote count in descending order
    const candidate = await Candidate.find().sort({ voteCount: "desc" });

    //Map the candidate to only return their name and voteCount
    const voteRecord = candidate.map((data) => {
      return {
        party: data.party,
        count: data.voteCount,
      };
    });
    return res.status(200).json(voteRecord);
  } catch (error) {
    console.log("Internal server error!");
    res.status(500).json({ error: "Internal server error!" });
  }
});

module.exports = candidateRouter;
