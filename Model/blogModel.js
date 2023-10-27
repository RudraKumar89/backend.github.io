const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    image: String,
    title: String,
    discription: String,
    subtitle: String,
    disable: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("blogModel", blogSchema);