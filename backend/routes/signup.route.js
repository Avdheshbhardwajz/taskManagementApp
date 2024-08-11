const express = require("express");
const userModel = require("../models/user.models");
const bcrypt = require("bcryptjs");

const signup = express.Router();

signup.post("/", async (req, res) => {
  try {
    const { username, password, email } = req.body;

    const emailExist = await userModel.findOne({ email });
    const usernameExist = await userModel.findOne({ username });
    if (emailExist) {
      return res.status(409).json({ message: "email already exist dude" });
    }
    if (usernameExist) {
      return res.status(409).json({ message: "username already exist dude" });
    }
    const hashedPass = await bcrypt.hash(password, 10);
    const newUser = new userModel({
      username,
      password: hashedPass,
      email,
    });

    await newUser.save();

    return res
      .status(201)
      .json({ message: "user have been added successfully " });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "something is wrong with the server here",
      fault: error,
    });
  }
});

module.exports = signup;

// Password Hashing:

// You're using bcryptjs to hash the password with 10 salt rounds, which is secure and standard practice.
// Checking for Existing Email and Username:

// The code correctly checks for the existence of the email and username in the database to prevent duplicates.
// Response Codes:

// The appropriate status codes (409 Conflict for existing email/username and 201 Created for successful signup) are used.
// Error Handling:

// The code catches any errors and responds with a 500 Internal Server Error, which is a good practice.
