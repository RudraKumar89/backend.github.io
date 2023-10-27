const wishlistModel = require("../Model/wishlistModel");

exports.getById = async (req, res, next) => {
  try {
    const { wishlistId } = req.params;
    const wishlist = await wishlistModel.findById(wishlistId);
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist Not Found",
      });
    }
    req.wishlist = wishlist;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
