const homeCategoryModel = require("../Model/homeCategoryModel");

exports.updateHomeCategory = async (req, res) => {
  try {
    const { title, product } = req.body;
    let update = await homeCategoryModel.findByIdAndUpdate(
      { _id: req.params.homeCategoryId },
      { $set: { title: title, product: product } },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "update Successfully....",
      data: update,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.singleHomeCategory = async (req, res) => {
  try {
    let update = await homeCategoryModel.findById({
      _id: req.params.homeCategoryId,
    });
    if (!update) {
      return res.status(404).json({
        success: false,
        message: "homeCategory is Not Found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "single homeCategory fatch Successfully....",
      data: update,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.AllHomeCategory = async (req, res) => {
  try {
    let update = await homeCategoryModel.find();
    return res.status(200).json({
      success: true,
      message: "All home Category Fatch Successfully....",
      data: update,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
