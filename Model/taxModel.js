const mongoose = require("mongoose");
const taxModel = mongoose.Schema(
  {
    taxPercent: Number,
    disable: { type: Boolean, default: false },
  },
  { timeStamps: true }
);
module.exports = mongoose.model("taxModel", taxModel);
