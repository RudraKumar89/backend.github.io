const mongoose = require("mongoose");
const reatModel = new mongoose.Schema(
  {
    karat: String,
    rate: Number,
  },
  { timestamps: true }
);
module.exports = mongoose.model("reatModel", reatModel);
