const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "username is required"],
    unique: true,
  },
  email: {
    type: String,
    unique: true,
    required: [true, "email is required"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
  task: [
    {
      type: mongoose.Types.ObjectId,
      ref: "task",
    },
  ],
});

const users = mongoose.model("user", userSchema);

module.exports = users;
