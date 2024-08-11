const express = require("express");

const mongoose = require("mongoose");

const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");

const userModel = require("../models/user.models");

const signin = express.Router();

signin.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;

    const usernameExist = await userModel.findOne({ username });

    if (!usernameExist) {
      return res.status(404).send("username is wrong or user not registered !");
    }

    const passwordExist = bcrypt.compare(
      password,
      usernameExist.password,
      (err, isMatch) => {
        if (err) {
          console.log(
            "there is something wrong while checking password, Please try later !!!"
          );
          return res.status(500).json({
            message:
              "there is something wrong while checking password, please try letter",
            error: err,
          });
        } else if (isMatch) {
          const token = jwt.sign(
            {
              id: usernameExist._id,
              username: usernameExist.username,
            },
            process.env.JWT_SECRET,
            { expiresIn: "3d" }
          );

          return res.json({
            message: "user logged in succesfully ",
            userId: usernameExist._id,
            token: token,
          });
        } else {
          console.log("password is not matching");
          return res.status(404).send("entered password is wrong");
        }
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).send("there is something wrong with the server ");
  }
});

module.exports = signin;
