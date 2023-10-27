const addressController = require("../Controller/homeCategoryController");
const express = require("express");
const router = express.Router();
const { upload } = require("../Middleware/multerMiddleware");

router.put(
  "/updateHomeCategory/:homeCategoryId",
  addressController.updateHomeCategory
);

router.get(
  "/singleHomeCategory/:homeCategoryId",
  addressController.singleHomeCategory
);
router.get("/AllHomeCategory", addressController.AllHomeCategory);

module.exports = router;
