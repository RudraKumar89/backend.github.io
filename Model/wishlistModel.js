const mongoose = require("mongoose");
let ObjectId = mongoose.Types.ObjectId;
const wishlistModel = new mongoose.Schema(
  {
    userId: { type: ObjectId, ref: "userModel" },
    productId: { type: ObjectId, ref: "productModel" },
  },
  { timeStamps: true }
);
module.exports = mongoose.model("wishlistModel", wishlistModel);