const mongoose = require("mongoose");
let objectId = mongoose.Types.ObjectId;
const productModel = new mongoose.Schema(
  {
    name: String,
    thumbnail: String,
    productImages: [{ type: String }],
    size: Number,
    goldPurity: Number,
    gender: { type: String, enum: ["WOMEN", "MEN", "KIDS"] },
    productType: String,
    occasion: String,
    materialColour: String,
    jewellaryType: String,
    metel: String,
    categoryId: { type: objectId, ref: "categoryModel" },
    brand: { type: String, enum: ["NAVDEEP", "OTHER"], default: "NAVDEEP" },
    taxId: {
      type: objectId,
      ref: "taxModel",
    },
    rate: {
      type: objectId,
      ref: "reatModel",
    },
    productBanner: String,
    description: String,
    reviewCount: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    disable: { type: Boolean, default: false },
    metaDescription: String,
    metaImage: String,
    metaTitle: String,
    metaTags: String,

    //
    weigth: String,
    price: Number,
    offPrice: Number,
    discount: Number,
    // subtotalAfterDisscount: Number,
    // subTotal: Number,
    makingCharge: Number,
    // grandTotal: Number,
    stoneDetail: Number,
    GST: Number,
    stock: Number,
    sold: { type: Number, default: 0 },
    // priceVariant: [
    //   {
    //     weigth: String,
    //     price: Number,
    //     offPrice: Number,
    //     discount: Number,
    //     subtotalAfterDisscount: Number,
    //     subTotal: Number,
    //     makingCharge: Number,
    //     grandTotal:Number,
    //     stoneDetail:Number,
    //     GST:Number,
    //     stock: Number,
    //     sold: { type: Number, default: 0 },
    //   },
    // ],
  },
  { timestamps: true }
);
module.exports = mongoose.model("productModel", productModel);
