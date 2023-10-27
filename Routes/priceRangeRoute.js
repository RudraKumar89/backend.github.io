const priceRangeController = require("../Controller/priceRangeController");
const { getByPriceRangeId } = require("../Middleware/priceRangeMid");
const express = require("express");
const router = express.Router();
const { adminRoute } = require("../Middleware/auth");
const {createPriceRangValidator,updatePriceRangValidator} = require("../Joi/priceRangJoi")
router.get(
  "/getByPriceRangeId/:priceRangeId",
  getByPriceRangeId,
  priceRangeController.getByPriceRangeId
);
router.get("/getAllPriceRange", priceRangeController.getAllPriceRange);

//Admin
router.post(
  "/createPriceRange/:adminId",
  adminRoute,
  createPriceRangValidator,
  priceRangeController.createPriceRange
);
router.get(
  "/getByPriceRangeId/:priceRangeId/:adminId",
  adminRoute,
  getByPriceRangeId,
  priceRangeController.getByPriceRangeId
);
router.put(
  "/updatePriceRange/:priceRangeId/:adminId",
  adminRoute,
  getByPriceRangeId,
  updatePriceRangValidator,
  priceRangeController.updatePriceRange
);
router.put(
  "/disablePriceRange/:priceRangeId/:adminId",
  adminRoute,
  getByPriceRangeId,
  priceRangeController.disablePriceRange
);

module.exports = router;
