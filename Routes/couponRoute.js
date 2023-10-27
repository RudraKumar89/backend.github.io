const controller = require("../Controller/couponController");
const express = require("express");
const router = express.Router();
const { upload } = require("../Middleware/multerMiddleware");
const { adminRoute } = require("../Middleware/auth");
const { date } = require("../Middleware/dateFilterMid");
const {
  createCouponValidator,
  updateCouponValidator,
} = require("../Joi/couponJoi");
router.param("couponId", controller.getCouponId);

// ================= Get ==================
router.get("/getCouponById/:couponId", controller.getCouponById);

// ================== Admin =============

// ================== Post ================
router.post(
  "/creatCoupon/:adminId",
  adminRoute,
  upload.single("image"),
  createCouponValidator,
  controller.creatCoupon
);

// ================== Put ================
router.put(
  "/updateCoupon/:couponId/:adminId",
  adminRoute,
  upload.single("image"),
  updateCouponValidator,
  controller.updateCoupon
);
router.put(
  "/disableCoupon/:couponId/:adminId",
  adminRoute,
  controller.disableCoupon
);
router.get("/getAllCoupons", date, controller.getAllCoupon);
router.get(
  "/getCouponById/:couponId/:adminId",
  adminRoute,
  controller.getCouponById
);
module.exports = router;
