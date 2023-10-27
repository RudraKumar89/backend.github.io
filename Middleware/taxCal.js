const cartModel = require("../Model/cartModel");

exports.tax = async (req, res, next) => {
  let { type } = req.query;
  let { cartId } = req.params;

  if (!type) {
    return res
      .status(400)
      .send({ success: false, message: "type is required" });
  }
  if (type !== "ADDTOCART" && type !== "BUYNOW") {
    return res.status(400).send({
      success: false,
      message: "ADDTOCART and BUYNOW are valid value for type..",
    });
  }

  let getCart = await cartModel
    .findOne({ _id: cartId, type: type })
    .populate("productId");

  if (!getCart) {
    return res.status(400).send({ success: false, message: "Cart Not Found" });
  }

  let obj = {};

  if (getCart?.priceVariantId) {
    getCart.productId?.priceVariant.find((elm) => {
      if (elm?._id.toString() === getCart?.priceVariantId) {
        obj = elm;
      }
    });
  }

  req.price = getCart?.priceVariantId
    ? obj.afterTaxValue
    : getCart.productId.afterTaxValue;

  req.taxOfVariant = getCart?.priceVariantId
    ? obj?.afterTaxValue - obj?.beforeTaxValue
    : getCart?.productId.afterTaxValue - getCart.productId.beforeTaxValue;

  req.productDiscount = getCart?.priceVariantId
    ? obj?.disInRupeeOfVariant
    : getCart?.productId?.mrp - getCart?.productId?.afterTaxValue;

  req.quantity = getCart?.quantity;
  next();
};
