const mongoose = require("mongoose");
let objectId = mongoose.Types.ObjectId;
const categoryModel = new mongoose.Schema(
  {
    name: String,
    icon: String,
    pCategory: {
      type: objectId,
      ref: "categoryModel",
      default: null,
    },
    disable: { type: Boolean, default: false },
    showInhome: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("categoryModel", categoryModel);
