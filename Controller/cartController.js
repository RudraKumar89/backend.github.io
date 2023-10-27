const cartModel = require("../Model/cartModel");
const mongoose = require("mongoose");
const productModel = require("../Model/productModel");

const addToCart = async function (req, res) {
  try {
    let { userId, priceVariantId } = req.body;

    const getProductById = req.getProductById;
    let obj = {};
    let obj1 = {};

    // Only Use Dummy Cart
    if (!userId) {
      userId = new mongoose.Types.ObjectId();
    }

    obj1 = {
      userId: userId,
      productId: getProductById?._id,
    };

    if (priceVariantId) {
      obj1 = {
        userId: userId,
        productId: getProductById?._id,
        priceVariantId: priceVariantId,
      };
      getProductById?.priceVariant.find((elm) => {
        if (elm?._id.toString() === priceVariantId) {
          obj = elm;
        }
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "priceVariantId is required...",
      });
    }

    const isExistProduct = await cartModel.findOne(obj1);

    if (isExistProduct) {
      return res.status(400).send({
        success: false,
        message: "Product Is Already In Your Cart Update Its Quantity",
      });
    }

    const createCart = await cartModel.create({
      userId: userId,
      productId: getProductById?._id,
      price: obj?.grandTotal,
      priceVariantId: priceVariantId,
    });

    return res.status(200).send({
      success: true,
      isMassage: req.message,
      message: "Product Added In Your Cart",
      data: createCart,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};


const getCartByUserId = async function (req, res) {
  try {
    return res.status(200).send({
      success: true,
      message: "Fetched Your Cart",
      isMessage: req.message,
      data: req.cart,
      // totalPrice: req.totalPrice,
      // shippingCharge: req.shippingCharge,
      // totalPayable: req.totalPayable,
      // discount: req.discount,
      // tax: req.tax,
      // productDiscount: req.productDiscount,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

///////////////////////////// Add  Quantity /////////////////////////////
const addQuantity = async (req, res) => {
  try {
    let { cartId } = req.params;

    let updateQuantity = await cartModel.findOneAndUpdate(
      { _id: cartId, type: type },
      {
        $set: {
          quantity: req.quantity + 1,
          price: req.price * (req.quantity + 1),
          tax: req.taxOfVariant * (req.quantity + 1),
          productDiscount: req.productDiscount * (req.quantity + 1),
        },
      },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "quantity update successfully",
      data: updateQuantity,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/////////////////////////////    Remove  Quantity    ///////////////////////////////////

const removeQuantity = async (req, res) => {
  try {
    let { type } = req.query;
    let { cartId } = req.params;

    let removeQuantity = await cartModel.findOneAndUpdate(
      { _id: cartId, type: type },
      {
        $set: {
          quantity: req.quantity - 1,
          price: req.price * (req.quantity - 1),
          tax: req.taxOfVariant * (req.quantity - 1),
          productDiscount: req.productDiscount * (req.quantity - 1),
        },
      },
      { new: true }
    );
    if (removeQuantity.quantity == 0) {
      removeQuantity = await cartModel.findOneAndDelete({
        userId: userId,
        productId: getProductById?._id,
      });
    }
    return res.status(200).json({
      success: true,
      message: "Quantity Updated",
      data: removeQuantity.quantity == 0 ? {} : removeQuantity,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const removeSingleProduct = async function (req, res) {
  try {
    const userId = req.params.userId;
    const getProductById = req.getProductById;
    console.log(getProductById);
    let getCart = await cartModel.findOne({
      userId: userId,
      productId: getProductById?._id,
    });
    console.log(getCart);
    if (!getCart) {
      return res
        .status(400)
        .send({ success: false, message: "Cart Not Found" });
    }
    let deleteCart = await cartModel.findOneAndDelete({
      userId: userId,
      productId: getProductById?._id,
    });
    return res.status(200).send({
      success: true,
      message: "Product Remove From Cart",
      deleteCart,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteCart = async (req, res) => {
  try {
    let deletedCart = await cartModel.deleteOne({ _id: req.params.cartId });
    return res.status(200).send({
      success: true,
      message: "Cart Deleted",
      deletedCart: deletedCart,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

module.exports = {
  addToCart,
  addToCartForBuy,
  getCartByUserIdOfBuyNow,
  getCartByUserId,
  addQuantity,
  removeQuantity,
  removeSingleProduct,
  deleteCart,
};
