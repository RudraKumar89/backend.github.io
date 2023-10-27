const priceRangeModel = require("../Model/priceRangeModel");

//////////////////////////////  Create priceRange  ////////////////////////////

exports.createPriceRange = async (req, res) => {
  try {
    let { min, max } = req.body;
    let priceRange = await priceRangeModel.create({
      min: min,
      max: max,
    });
    return res
      .status(201)
      .json({ success: true, message: "Create priceRange", data: priceRange });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

////////////////////////////  Get by priceRange  /////////////////////////////

exports.getByPriceRangeId = async (req, res) => {
  try {
    let priceRange = req.priceRange;
    return res.status(200).json({
      success: true,
      message: "Get priceRange By Id",
      data: priceRange,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

////////////////////////////  Get all priceRange  //////////////////////////////

exports.getAllPriceRange = async (req, res) => {
  try {
    let {page,disable} = req.query;
    const startIndex = page ? (page - 1) * 20 : 0;
    const endIndex = startIndex + 20;
    let obj = {};
    if(disable){
      obj.disable = disable
    }
    let length = await priceRangeModel.countDocuments(obj);
    let count = Math.ceil(length / 20);
    let check = await priceRangeModel
      .find(obj)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(endIndex);
    if (!check.length) {
      return res
        .status(404)
        .json({ success: false, message: "priceRange not found" });
    }
    return res
      .status(200)
      .json({
        success: true,
        message: "Get All PriceRange",
        data: check,
        page: count,
      });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/////////////////////////// Update priceRange  ////////////////////////////////

exports.updatePriceRange = async (req, res) => {
  try {
    let { min, max } = req.body;
    let priceRange = req.priceRange;
    let data = await priceRangeModel.findByIdAndUpdate(
      { _id: priceRange._id },
      {
        $set: {
          min: min,
          max: max,
        },
      },
      { new: true }
    );
    return res.status(200).json({
      success: false,
      message: "Price Range Update Successfully",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

////////////////////////// priceRange disable  ////////////////////////////////

exports.disablePriceRange = async (req, res) => {
  try {
    let priceRange = req.priceRange;
    let data = await priceRangeModel.findByIdAndUpdate(
      { _id: priceRange._id },
      {
        $set: {
          disable: !priceRange.disable,
        },
      },
      { new: true }
    );
    if (data.disable) {
      return res
        .status(200)
        .json({ success: true, message: "Price Range Is Enable" });
    }
    return res
      .status(200)
      .json({ success: true, message: "PriceRange Is Disable" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
