const controller = require("../Controller/cartController");

const express = require("express");
const router = express.Router();
// const { billDetail, dummyBillDetail } = require("../Middleware/billDetail");
// const { upload, imageValidetion } = require("../Middleware/multerMidellware");
// const Midellwares = require("../Middleware/userMidellware");

// router.param("customerId", Midellwares.getUserId);
router.param("CartId", controller.getCartId);

// ================== Post ==================
router.post(
  "/createCart",
  controller.createCartByAdmin
);
router.post("/createDummyCart", controller.createDummyCart);
// ================== Get ==================
router.get(
  "/getAllCartBycustomerId/:customerId",
  billDetail,
  controller.getAllCartBycustomerId
);

// ================== Put ==================
router.put("/quantityUpdate/:CartId", controller.quantityUpdate);
router.put("/removeQuantity/:CartId", controller.removeQuantity);

// ================== Delete ==================
router.delete("/deleteCustomerCart/:customerId", controller.deleteCustomerCart);
router.delete("/deleteCartById/:CartId", controller.deleteCartById);

router.get(
  "/getAllCartByuserId/:userId",
  dummyBillDetail,
  controller.getAllCartBycustomerId
);
// ============Admin
router.post(
  "/createCartByAdmin",
  controller.createCartByAdmin
);
module.exports = router;
