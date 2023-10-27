const contactUsController = require("../Controller/contactUsController");
const { getUserById } = require("../Middleware/userMid");
const { createContactValidator,updateContactValidator } = require("../Joi/contactUsJoi");
const express = require("express");
const router = express.Router();

router.post(
  "/createContactUs",
  getUserById,
  // createContactValidator,
  contactUsController.createContactUs
);
router.get(
  "/getByContactUsId/:contactUsId",
  contactUsController.getByContactUsId
);
router.get("/getAllContactUs", contactUsController.getAllContactUs);
router.put(
  "/updateContactUs/:contactUsId",updateContactValidator,
  contactUsController.updateContactUs
);

module.exports = router;
