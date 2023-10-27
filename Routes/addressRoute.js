const addressController = require("../Controller/addressController");
const express = require("express");
const router = express.Router();
const { getById } = require("../Middleware/addressMiddleware");
const { getUserById } = require("../Middleware/userMid");
const {
  createAddressValidator,
  updateAddressValidator,
} = require("../Joi/addressJoi");
router.post(
  "/createAddress/:userId",
  getUserById,
  createAddressValidator,
  addressController.createAddress
);
router.get(
  "/getAllAddressByUserId/:userId",
  getUserById,
  addressController.getAllAddressByUserId
);
router.get(
  "/getAddressById/:addressId",
  getById,
  addressController.getAddressById
);
router.put(
  "/updateAddress/:addressId",
  getById,
  updateAddressValidator,
  addressController.updateAddress
);
// router.put("/addressDisable/:addressId", getById, addressController.addressDisable);
router.delete(
  "/deleteAddress/:addressId",
  getById,
  addressController.deleteAddress
);

module.exports = router;
