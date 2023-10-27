const express = require("express");
const controller = require("../Controller/notificationController");
const router = express.Router();

router.get("/getNotificationById/:notificationId", controller.getNotificationById);
router.get("/getNotificationByUserId/:userId", controller.getNotificationByUserId);
router.get("/seenCount/:userId", controller.seenCount);
router.post("/sendNotificationToAllUser", controller.sendNotificationToAllUser);
router.post(
  "/sendNotificationToSingleUser",
  controller.sendNotificationToSingleUser
);

module.exports = router;
