const mongoose = require("mongoose");
const couponModel = new mongoose.Schema(
  {
    couponName: String,
    startDate: Date,
    endDate: Date,
    couponCode: String,
    minimumOrderValue: Number,
    maximumDiscount: Number,
    discount: Number,
    categoryId: [],
    oneTimeUse : {
      type : Boolean,
      default : true 
    },
    couponQuantity: Number,
    image: String,
    disable: { type: Boolean, default: false },
  },
  { timestamps: true }
);
module.exports = mongoose.model("couponModel", couponModel)