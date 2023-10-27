const express = require("express");
const controller = require("../Controller/reviewController");
const router = express.Router();
const { getById } = require("../Middleware/reviewMid");
const { adminRoute } = require("../Middleware/auth");
const { createReviewValidator,updateReviewValidator } = require("../Joi/reviewJoi");
router.post("/createReview", createReviewValidator, controller.createReview);
router.get("/getReviewById/:reviewId", getById, controller.getReviewById);
router.put("/updateReview/:reviewId",updateReviewValidator, getById, controller.updateReview);
router.get(
  "/getAllReviewByProductId/:productId",
  controller.getAllReviewByProductId
);

// Admin
router.get(
  "/getReviewById/:reviewId/:adminId",
  adminRoute,
  getById,
  controller.getReviewById
);
router.put(
  "/disableReview/:reviewId/:adminId",
  adminRoute,
  getById,
  controller.disableReview
);
module.exports = router;
