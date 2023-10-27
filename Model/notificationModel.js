const mongoose = require("mongoose");

const notificationModel = new mongoose.Schema(
  {
    title: String,
    message: String,
    icon: String,
    seen: {
      type: Boolean,
      default: false,
    },
    date: Date,
    orderId: String,
    userId: { type: mongoose.Types.ObjectId, ref: "userModel" },
    userType: String,
    type: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("notificationModel", notificationModel);
