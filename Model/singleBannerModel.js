const mongoose = require("mongoose");
const objectId = mongoose.Types.ObjectId;

const singleBannerSchema = new mongoose.Schema(
  {
    banner: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("singleBannerSchema", singleBannerSchema);
