const express = require("express");
const controller = require("../Controller/shippingController");
const router = express.Router();
const { adminRoute } = require("../Middleware/auth");
// Admin
router.get(
  "/getByShipingId/:shipingId/:adminId",
  adminRoute,
  controller.getByShipingId
);
router.put(
  "/updateShiping/:shipingId/:adminId",
  adminRoute,
  controller.updateShiping
);

router.get(
  "/getAllShiping/:adminId",
  adminRoute,
  controller.getAllShiping
);
module.exports = router;
