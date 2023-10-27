const couponModel = require("../Model/couponModel");
const {
  deleteFileFromObjectStorage,
} = require("../Middleware/multerMiddleware");


// ========================== Get Id =================================== ||

exports.getCouponId = async (req, res, next, id) => {
  try {
    let coupon = await couponModel.findById(id).populate("categoryId");
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon Not Found",
      });
    } else {
      (req.coupon = coupon), next();
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ============================= Create Coupon ============================== ||

exports.creatCoupon = async (req, res) => {
  try {
    const {
      couponName,
      couponCode,
      discount,
      categoryId,
      startDate,
      endDate,
      oneTimeUse,
      minimumOrderValue,
      maximumDiscount,
      couponQuantity,
      disable,
    } = req.body;
    const findCounpon = await couponModel.find();
    for (let i = 0; i < findCounpon.length; i++) {
      if (findCounpon[i].couponCode === couponCode) {
        return res.status(400).json({
          success: false,
          message: "Please Provide Unique CouponCode",
        });
      }
    }
    const coupon = await couponModel.create({
      couponName:couponName,
      couponCode:couponCode,
      discount:discount,
      categoryId:categoryId,
      startDate:startDate,
      oneTimeUse:oneTimeUse,
      endDate:endDate,
      minimumOrderValue:minimumOrderValue,
      maximumDiscount:maximumDiscount,
      couponQuantity:couponQuantity,
      disable:disable,
      image:req.file.key
    });
    return res.status(201).json({
      success: true,
      message: "Coupon Is Create Successfully...",
      data: coupon,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

// ====================== Get Coupon By Id =========================== ||

exports.getCouponById = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Coupon Is Fatch Successfully...",
      data: req.coupon,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};


// ====================== Update Coupon =========================== ||

exports.updateCoupon = async (req, res) => {
  try {
    const {
      couponName,
      couponCode,
      discount,
      categoryId,
      startDate,
      endDate,
      oneTimeUse,
      minimumOrderValue,
      maximumDiscount,
      couponQuantity,
    } = req.body;
    let image = req.file ? req.file.key : null;
    if (req.coupon.image && image) {
      deleteFileFromObjectStorage(req.coupon.image);
    }
    const findCounpon = await couponModel.find();
    for (let i = 0; i < findCounpon.length; i++) {
      if (findCounpon[i].couponCode === couponCode) {
        if(findCounpon[i]._id != req.coupon._id.toString()){
          return res.status(400).json({
            success: false,
            message: "Please Provide Unique CouponCode",
          });
        }
      }
    }
    const updateCoupon = await couponModel
      .findOneAndUpdate(
        { _id: req.coupon._id },
        {
          $set: {
            couponName:couponName,
            couponCode:couponCode,
            discount:discount,
            categoryId:categoryId,
            startDate:startDate,
            endDate:endDate,
            oneTimeUse : oneTimeUse,
            minimumOrderValue:minimumOrderValue,
            maximumDiscount:maximumDiscount,
            couponQuantity:couponQuantity,
            image:image
          },
        },
        { new: true }
      )
      .populate("categoryId");
    return res.status(200).json({
      success: true,
      message: "Coupon Is Update Successfully...",
      data: updateCoupon,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

// ====================== disable Coupon ======================== ||

exports.disableCoupon = async (req, res) => {
  try {
    let disableCoupon = await couponModel.findOneAndUpdate(
      { _id: req.coupon._id },
      { $set: { disable: !req.coupon.disable } },
      { new: true }
    );
    if (disableCoupon.disable) {
      return res
        .status(200)
        .send({ success: true, message: "Coupon Is Successfully disabled" });
    } else {
      return res
        .status(200)
        .send({ success: true, message: "Coupon Is Successfully enable" });
    }
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

exports.getAllCoupon = async (req, res) => {
  try {
    let obj={}
    let {page, disable} = req.query;
    if(disable){
      obj.disable = disable
    }
    if (req.filterQuery) {
      obj.createdAt = req.filterQuery;
    }
    const startIndex = page ? (page - 1) * 20 : 0;
    const endIndex = startIndex + 20;
    let length = await couponModel.countDocuments();
    let count = Math.ceil(length / 20);
    const Coupon = await couponModel
      .find(obj)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(endIndex)
      .populate("categoryId");
    return res.status(200).json({
      success: true,
      message: "Coupon Is Fatch Successfully...",
      data: Coupon,
      page: count,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};