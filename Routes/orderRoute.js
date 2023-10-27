const express = require("express");
const router = express.Router();
const controller = require("../Controller/orderController");
const { bill } = require("../Middleware/couponBill");
const { getUserById } = require("../Middleware/userMid");
const { getOrderByOrderId } = require("../Middleware/orderMid");
const { adminRoute } = require("../Middleware/auth");
const { date } = require("../Middleware/dateFilterMid");
const { checkStock } = require("../Middleware/productStockCheck");
const {
  sendNotificationByCancled,
  sendNotificationByReturnRequest,
  sendNotificationByAdminUpdateStatus,
} = require("../Controller/notificationController");


router.post(
  "/order/createOrder/:userId",
  checkStock,
  bill,
  controller.createOrder
);
router.put(
  "/updateTransactionId/:orderId",
  getOrderByOrderId,
  controller.updateTransactionId
);
router.put(
  "/cancelledStatus/:orderId",
  getOrderByOrderId,
  sendNotificationByCancled,
  controller.cancelledStatus
);
router.get(
  "/getAllOrderByUserId/:userId",
  getUserById,
  controller.getAllOrderByUserId
);
router.get(
  "/getOrderByOrderId/:orderId",
  getOrderByOrderId,
  controller.getOrderByOrderId
);
router.put(
  "/returnRequestStatus/:orderId/:productId",
  getOrderByOrderId,
  sendNotificationByReturnRequest,
  controller.returnRequestStatus
);

// Admin
router.put(
  "/AllProductStatusUpdate/:orderId/:adminId",
  adminRoute,
  getOrderByOrderId,
  sendNotificationByAdminUpdateStatus,
  controller.AllProductStatusUpdate
);
router.get(
  "/getOrderByOrderId/:orderId/:adminId",
  adminRoute,
  getOrderByOrderId,
  controller.getOrderByOrderId
);
router.put(
  "/updatesingleStatus/:orderId/:productId/:adminId",
  adminRoute,
  getOrderByOrderId,
  sendNotificationByAdminUpdateStatus,
  controller.singleStatus
);

router.get("/generateInvoice/:orderId", controller.generateInvoice);
router.get("/order/filterOrder", date, controller.orderFilter);
module.exports = router;
