const shipingModel = require("../Model/shippingCharges");

exports.updateShiping = async (req, res) => {
  try {
    const { charge } = req.body;
    const check = await shipingModel.findById({
      _id: req.params.shipingId,
    });
    if (!check) {
      return res.status(400).json({
        success: false,
        message: "Shipping Not Found",
      });
    }
    const shipingUpdate = await shipingModel.findByIdAndUpdate(
      { _id: req.params.shipingId },
      { $set: {charge: charge } },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Shipping Update Successfully",
      data: shipingUpdate,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      meassage: error.meassage,
    });
  }
};

exports.getByShipingId = async (req, res) => {
  try {
    const check = await shipingModel.findById({
      _id: req.params.shipingId,
    });
    if (!check) {
      return res.status(400).json({
        success: false,
        message: "Shipping Not Found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Shipping Fatch Successfully",
      data: check,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      meassage: error.meassage,
    });
  }
};

exports.getAllShiping = async (req, res) => {
  try {
    let {page,disable} = req.query;
    const startIndex = page ? (page - 1) * 20 : 0;
    const endIndex = startIndex + 20;
    let obj = {};
    if (disable) {
      obj.disable = disable;
    }
    let length = await shipingModel.countDocuments(obj);
    let count = Math.ceil(length / 20);
    const check = await shipingModel
      .find(obj)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(endIndex);
    if (!check.length) {
      return res.status(400).json({
        success: false,
        message: "Shipping Not Found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Shiping Fetch Successfully",
      data: check,
      page: count,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      meassage: error.meassage,
    });
  }
};
