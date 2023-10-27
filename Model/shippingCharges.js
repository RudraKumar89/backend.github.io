const mongoose = require("mongoose");

const shipingModel = new mongoose.Schema(
  {
    name: String,
    charge: Number,
  },
  { timestamps: true }
);
module.exports = mongoose.model("shipingModel", shipingModel);