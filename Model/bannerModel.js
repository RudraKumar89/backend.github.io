const mongoose = require("mongoose");
const objectId = mongoose.Types.ObjectId;

const bannerSchema = new mongoose.Schema(
  {
    banner: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("bannerSchema", bannerSchema);
