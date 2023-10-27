const wishlistModel = require("../Model/wishlistModel");

// =================== create ====================== ||

exports.create = async (req, res) => {
  try {
    const { productId, userId } = req.body;

    let isExistProduct = await wishlistModel.findOne({
      productId: productId,
      userId: userId,
    });
    if (isExistProduct) {
      return res
        .status(400)
        .send({
          success: false,
          message: "Product Is Already In Your Wishlist",
        });
    }
    let data = await wishlistModel.create({
      productId: productId,
      userId: userId,
    });
    return res.status(201).send({
      success: true,
      message: "Create Wishlist Successfully",
      data: data,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

// ================== Get By Id ======================== ||

exports.getWishlistById = async (req, res) => {
  try {
    return res.status(200).send({
      success: true,
      message: "Wishlist Is Fetched Successfully...",
      data: req.wishlist,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

// ======================== Get All feedback ======================== ||

exports.getAllWishlistByUserId = async (req, res) => {
  try {
    let getData = await wishlistModel
      .find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .populate("productId");
    return res.status(200).send({
      success: true,
      message: "All Wishlist Fatch Successfully...",
      data: getData,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

// ========================= delete wishlist ===================== ||

exports.deleteWishlist = async (req, res) => {
  try {
    const { productId, userId } = req.body;
    let check = await wishlistModel.findOne({productId:productId,userId:userId})
    if(!check){
      return res.status(404).send({success:false,message:"Wishlist Not Found"})
    }
    let deletes = await wishlistModel.findOneAndDelete({
      productId: productId,
      userId: userId,
    });
    return res.status(200).json({
      success: true,
      message: "Wishlist Delete Successfully...",
      data: deletes,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

