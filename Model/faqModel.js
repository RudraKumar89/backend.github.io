const mongoose = require("mongoose");
const objectId = mongoose.Types.ObjectId;

const faqSchema = new mongoose.Schema(
  {
   question:String,
   answer:String
  },
  { timestamps: true }
);

module.exports = mongoose.model("faqSchema",faqSchema);
