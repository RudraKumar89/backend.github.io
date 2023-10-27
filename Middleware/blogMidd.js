const blogModel = require("../Model/blogModel");

exports.getByBlogId = async (req, res, next) => {
  try {
    let check = await blogModel.findById({ _id: req.params.blogId });
    if (!check) {
      return res
        .status(404)
        .json({ success: false, message: "Blog Not Found" });
    }
    req.blogId = check;
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};