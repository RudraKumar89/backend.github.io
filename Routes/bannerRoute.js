const addressController = require("../Controller/bannerController");
const express = require("express");
const router = express.Router();
const { upload } = require("../Middleware/multerMiddleware");

router.put(
  "/updateBanner/:bannerId",
  upload.fields([{ name: "banner" }]),
  addressController.updateBanner
);

router.get("/getBanner", addressController.getBanner);

module.exports = router;
