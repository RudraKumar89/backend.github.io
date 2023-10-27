const categoryModel = require("../Model/categoryModel");
const fs = require("fs");

exports.createCategory = async (req, res) => {
  try {
    let { name, pCategory } = req.body;
    let createCategory = await categoryModel.create({
      name: name,
      icon: req.file.path,
      pCategory: pCategory,
    });
    return res.status(200).send({
      success: true,
      message: "Category Created",
      data: createCategory,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

exports.getByCategoryId = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Category Fatch Successfully...",
      data: req.Category,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllCategory = async (req, res) => {
  try {
    let { page, disable } = req.query;
    const startIndex = page ? (page - 1) * 20 : 0;
    const endIndex = startIndex + 20;
    let obj = {};
    if (disable) {
      obj.disable = disable;
    }
    if (req.filterQuery) {
      obj.createdAt = req.filterQuery;
    }
    let length = await categoryModel.countDocuments(obj);
    let count = Math.ceil(length / 20);
    let allCategory = await categoryModel
      .find(obj)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(endIndex);
    return res.status(200).send({
      success: true,
      message: "All Category Fetched",
      data: allCategory,
      page: count,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    let icon;
    let { name, pCategory } = req.body;
    if (req.file) {
      icon = req.file ? req.file.path : null;
    }
    if (req.file && req.Category.icon != null) {
      await fs.unlink(req.Category.icon, (err) => {
        if (err) {
          console.log(err.message);
        }
      });
    }
    let updateData = await categoryModel.findByIdAndUpdate(
      {
        _id: req.Category._id,
      },
      {
        $set: {
          name: name,
          icon: icon,
          pCategory: pCategory,
        },
      },
      {
        new: true,
      }
    );
    return res.status(200).send({
      success: true,
      message: "Category Updated",
      data: updateData,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

exports.disableCategory = async (req, res) => {
  try {
    let updateCategory = await categoryModel.findByIdAndUpdate(
      { _id: req.Category._id },
      {
        $set: {
          disable: !req.Category.disable,
        },
      },
      { new: true }
    );
    if (updateCategory.disable == true) {
      return res.status(200).json({
        success: true,
        message: "Category Successfully Disable...",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Category Successfully Enable...",
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.showInhomeCategory = async (req, res) => {
  try {
    let updateCategory = await categoryModel.findByIdAndUpdate(
      { _id: req.Category._id },
      {
        $set: {
          showInhome: !req.Category.showInhome,
        },
      },
      { new: true }
    );
    if (updateCategory.showInhome == true) {
      return res.status(200).json({
        success: true,
        message: "Category Successfully showInhome is true...",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Category Successfully showInhome is false...",
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ======================= getAllCategoryWithPcategory ====================== ||
exports.getAllCategoryWithPcategory = async (req, res) => {
  try {
    let { page, disable } = req.query;
    const startIndex = page ? (page - 1) * 20 : 0;
    const endIndex = startIndex + 20;
    let obj = { pCategory: null };
    if (disable === "false" || disable === "true") {
      obj.disable = disable;
    }
    let length = await categoryModel.countDocuments(obj);
    let count = Math.ceil(length / 20);
    const getAllCategorys = await categoryModel
      .find(obj)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(endIndex)
      .populate("pCategory");
    for (let i = 0; i < getAllCategorys.length; i++) {
      const find = await categoryModel.find({
        pCategory: getAllCategorys[i]._id,
      });
      getAllCategorys[i]._doc.subCategory = find;
    }
    return res.status(200).send({
      success: true,
      message: "Sub Category Is Fatch Successfully...",
      data: getAllCategorys,
      page: count,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};
