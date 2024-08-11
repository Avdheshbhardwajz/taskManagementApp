const express = require("express");

const userModel = require("../models/user.models");

const auth = require("../middlewares/auth.middleware");

const taskModel = require("../models/task.model");

const task = express.Router();

task.post("/add", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const { title, description } = req.body;

    const newTask = await new taskModel({ title, description });

    const savedTask = await newTask.save();

    const taskId = savedTask._id;

    await userModel.findByIdAndUpdate(userId, { $push: { task: taskId } });

    return res.status(200).send("task has been added successfully ");
  } catch (error) {
    console.log("there is something wrong with the server ", error);
    return res
      .status(500)
      .json({ message: "there is something wrong with the server" });
  }
});

task.get("/", auth, async (req, res) => {
  try {
    const { id } = req.user;

    const data = await userModel
      .findOne({ _id: id })
      .populate("task")
      .sort({ createdAt: -1 });

    if (data) {
      return res.status(200).json({ data });
    }
    return res.status(200).send("no data found");
  } catch (error) {
    console.log(error);
    return res.status(505).send("there is something wrong with the server");
  }
});

task.get("/importanttask", auth, async (req, res) => {
  try {
    const { id } = req.user;

    const data = await userModel.findOne({ _id: id }).populate({
      path: "task",
      match: { important: true },
      options: { sort: { createdAt: 1 } },
    });
    // .populate("task")
    // .match({ important: true })
    // .sort({ createdAt: -1 });

    if (data) {
      return res.status(200).json({ data: data.task });
    }
    return res.status(200).send("no data found");
  } catch (error) {
    console.log(error);
    return res.status(505).send("there is something wrong with the server");
  }
});

task.get("/completedtask", auth, async (req, res) => {
  try {
    const { id } = req.user;

    const data = await userModel.findOne({ _id: id }).populate({
      path: "task",
      match: { completed: true },
      options: { sort: { createdAt: 1 } },
    });
    // .populate("task")
    // .match({ completed: true })
    // .sort({ createdAt: -1 });

    if (data) {
      return res.status(200).json({ data: data.task });
    }
    return res.status(200).send("no data found");
  } catch (error) {
    console.log(error);
    return res.status(505).send("there is something wrong with the server");
  }
});

task.delete("/deletetask/:idd", auth, async (req, res) => {
  try {
    const { idd } = req.params;

    const { id } = req.user;

    await taskModel.findByIdAndDelete(idd);

    await userModel.findByIdAndUpdate({ _id: id }, { $pull: { task: idd } });

    return res.status(200).send("task has been deleted");
  } catch (error) {
    console.log(error);

    return res.status(505).send("there is something wrong with the server");
  }
});

task.put("/updatetask/:idd", auth, async (req, res) => {
  try {
    const { idd } = req.params;

    const { title, description } = req.body;

    await taskModel.findByIdAndUpdate({ _id: idd }, { title, description });

    return res.status(200).send("task has been updated");
  } catch (error) {
    console.log("error while updating data");
    return res.status.send("there is some problem while updating the data");
  }
});

task.put("/updatetaskimportant/:idd", auth, async (req, res) => {
  try {
    const { idd } = req.params;

    const status = await taskModel.findById(idd).important;

    await taskModel.findByIdAndUpdate({ _id: idd }, { important: !status });

    return res.status(200).send("task has been updated");
  } catch (error) {
    console.log("error while updating data", error);
    return res.status.send("there is some problem while updating the data");
  }
});

task.put("/updatetaskcompleted/:idd", auth, async (req, res) => {
  try {
    const { idd } = req.params;

    const status = await taskModel.findById({ _id: idd });

    const statusFinal = status.completed;

    await taskModel.findByIdAndUpdate(
      { _id: idd },
      { completed: !statusFinal }
    );

    return res.status(200).send("task has been updated");
  } catch (error) {
    console.log("error while updating data", error);
    return res
      .status(500)
      .send("there is some problem while updating the data");
  }
});

module.exports = task;
