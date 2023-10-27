const categoryModel = require("../Model/categoryModel");

exports.getById = async (req, res, next, id) => {
  try {
    let Category = await categoryModel.findById(id);
    if (!Category) {
      return res.status(404).json({
        success: false,
        message: "Category Not Found",
      });
    } else {
      (req.Category = Category), next();
    }
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};
