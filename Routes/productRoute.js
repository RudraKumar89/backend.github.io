const express = require("express");
const controller = require("../Controller/productController");
const { upload } = require("../Middleware/multerMiddleware");
const router = express.Router();
const { getProductById } = require("../Middleware/productMid");
const { adminRoute } = require("../Middleware/auth");
const {
  createProductValidator,
  updateProductValidator,
} = require("../Joi/productJoi");
const { date } = require("../Middleware/dateFilterMid");

router.get("/getAllProduct", controller.getAllProduct);
router.get("/relatedProduct/:brandId", controller.relatedProduct);
router.get("/alternativeMedicine/:categoryId", controller.alternativeMedicine);
router.get(
  "/getByProductId/:productId",
  getProductById,
  controller.getByProductId
);
// Admin Route
router.post(
  "/createProduct/:adminId",
  adminRoute,
  upload.fields([
    { name: "images" },
    { name: "banner" },
    { name: "thumbnail" },
    { name: "metaImage" },
  ]),
  // createProductValidator,
  controller.createProduct
);
router.get(
  "/getByProductId/:productId/:adminId",
  adminRoute,
  getProductById,
  controller.getByProductId
);
router.put(
  "/updateProduct/:productId/:adminId",
  adminRoute,
  getProductById,
  upload.fields([
    { name: "images" },
    { name: "banner" },
    { name: "thumbnail" },
    { name: "metaImage" },
  ]),
  updateProductValidator,
  controller.updateProduct
);
router.put(
  "/disableProduct/:productId/:adminId",
  adminRoute,
  getProductById,
  controller.disableProduct
);
router.delete(
  "/unlinkImage/:productId/:adminId",
  adminRoute,
  getProductById,
  controller.unlinkImage
);

// User
router.get("/productFilter", date, controller.productFilter);
router.get("/fiftyPersentDiscount", controller.fiftyPersentDiscount);
router.get(
  "/getByProductId/:productId",
  getProductById,
  controller.getByProductId
);

router.get(
  '/newArrival',controller.newArrival
)

router.put(
  "/showInHomeProduct/:productId/:adminId",
  adminRoute,
  getProductById,
  controller.showInHome
);
module.exports = router;
