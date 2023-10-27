const mongoose = require("mongoose");

const priceRangeSchema = new mongoose.Schema(
  {
    min: Number,
    max: Number,
    disable: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model("priceRangeModel", priceRangeSchema);