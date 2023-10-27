const mongoose = require("mongoose");
const objectId = mongoose.Types.ObjectId;

const addressSchema = new mongoose.Schema(
  {
    name: String,
    mobile: Number,
    houseNumber: String,
    userId: {
      type: objectId,
      ref: "usermodel",
    },
    pincodeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "pincodemodel"
    },
    pincode: Number,
    cityName: String,
    stateName: String,
    landmark: String,
    country: { type: String, default: "INDIA" },
    area: String,
    disable: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("addressModel", addressSchema);
