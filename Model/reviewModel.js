const mongoose = require("mongoose");
let ObjectId = mongoose.Types.ObjectId;

const reviewModel = new mongoose.Schema(
  {
    userId: { type: ObjectId, ref: "userModel" },
    productId: { type: ObjectId, ref: "productModel" },
    message: String,
    rating: Number,
    disable: { type: Boolean, default: false },
  },
  { timestamps: true }
);
module.exports = mongoose.model("reviewModel", reviewModel);