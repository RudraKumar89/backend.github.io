const express = require("express");
const router = express.Router();
const controller = require("../Controller/categoryController");
const { upload } = require("../Middleware/multerMiddleware");
const { getById } = require("../Middleware/categoryMiddleware");
const { adminRoute } = require("../Middleware/auth");
const { date } = require("../Middleware/dateFilterMid");
const {
  createCategoryValidator,
  updateCategoryValidator,
} = require("../Joi/categoryJoi");

router.param("categoryId", getById);

router.get("/getAllCategory", date, controller.getAllCategory);

router.get("/getByCategoryId/:categoryId", controller.getByCategoryId);

// Admin
router.post(
  "/createCategory/:adminId",
  adminRoute,
  upload.single("icon"),
  createCategoryValidator,
  controller.createCategory
);

router.get(
  "/getByCategoryId/:categoryId/:adminId",
  adminRoute,
  controller.getByCategoryId
);


router.get(
  "/getAllCategoryWithPcategory/:adminId",
  adminRoute,
  controller.getAllCategoryWithPcategory
);

router.put(
  "/updateCategory/:categoryId/:adminId",
  adminRoute,
  upload.single("icon"),
  updateCategoryValidator,
  controller.updateCategory
);
router.put(
  "/disableCategory/:categoryId/:adminId",
  adminRoute,
  controller.disableCategory
);

router.put(
  "/showInhomeCategory/:categoryId/:adminId",
  adminRoute,
  controller.showInhomeCategory
);

module.exports = router;
