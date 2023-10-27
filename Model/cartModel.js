const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userModel",
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "productModel",
    },
    priceVariantId: String,
    quantity: Number,
    price: Number,
    type: { type: String, enum: ["ADDTOCART", "BUYNOW"] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("cartModel", cartSchema);
