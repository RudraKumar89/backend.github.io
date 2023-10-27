const express = require("express");
const controller = require("../Controller/wishlistController");
const router = express.Router();
const { getById } = require("../Middleware/wishlistMid");
const { getUserById } = require("../Middleware/userMid");
const { createWishlistValidator } = require("../Joi/wishlistJoi");
router.post("/createWishlist", createWishlistValidator, controller.create);
router.get(
  "/getAllWishlistByUserId/:userId",
  getUserById,
  controller.getAllWishlistByUserId
);
router.get("/getWishlistById/:wishlistId", getById, controller.getWishlistById);
router.delete("/deleteWishlist", controller.deleteWishlist);

module.exports = router;
