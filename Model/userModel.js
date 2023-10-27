const mongoose = require("mongoose");
const { userType } = require("../helper/userType");

const userModel = new mongoose.Schema(
  {
    fullName: String,
    phoneNumber: Number,
    email: String,
    password: String,
    dob: String,
    gender: { type: String, enum: ["FEMALE", "OTHER", "MALE"] },
    userType: {
      type: [{ type: String, enum: Object.values(userType) }],
      default: [userType.user],
    },
    image: String,
    disable: {
      type: Boolean,
      default: false,
    },
    adminFcmToken: String,
    userFcmToken: String,
  },
  { timestamps: true }
);
module.exports = mongoose.model("userModel", userModel);
