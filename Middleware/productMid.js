const mongoose = require("mongoose");
const productModel = require("../Model/productModel");

const getProductById = async function (req, res, next) {
  try {
    const { productId } = req.params;
    let membership;
    let getProductById = await productModel
      .findById(productId)
      .populate("taxId");
    if (!getProductById) {
      return res
        .status(400)
        .send({ success: false, message: "Provide Valid ProductId" });
    }
    if (membership) {
      req.membership = membership;
    } else {
      req.getProductById = getProductById;
    }
    next();
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

module.exports = { getProductById };
