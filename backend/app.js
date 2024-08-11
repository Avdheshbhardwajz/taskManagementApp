const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connection = require("./config/connection");
const signup = require("./routes/signup.route");
const signin = require("./routes/signin.route");
const task = require("./routes/task.route");
const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("server health is good what about urs?");
});

app.use("/signup", signup);
app.use("/signin", signin);
app.use("/task", task);
app.listen(PORT, async () => {
  try {
    await connection;
    console.log("database is connected ");
    console.log(`server is running on the port ${PORT}`);
  } catch (error) {
    console.log("database is not able to connect", error);
  }
});
