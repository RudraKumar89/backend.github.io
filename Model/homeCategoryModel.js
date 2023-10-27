const mongoose = require("mongoose");
const objectId = mongoose.Types.ObjectId;

const homeCategorySchema = new mongoose.Schema(
  {
    title: String,
    product: [{ type: objectId, ref: "productModel" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("homeCategorySchema", homeCategorySchema);
