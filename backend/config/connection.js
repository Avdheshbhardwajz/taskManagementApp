const mongoose = require("mongoose");

const connection = mongoose.connect(process.env.mongo_URI);

module.exports = connection;
