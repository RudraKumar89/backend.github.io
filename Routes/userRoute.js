const express = require("express");
const controller = require("../Controller/userController");
const { getUserById } = require("../Middleware/userMid");
const { adminRoute } = require("../Middleware/auth");
const router = express.Router();
const { upload } = require("../Middleware/multerMiddleware");
const {
  createUserValidator,
  addminLogInValidator,
  createSubAdminValidator,
  logInValidator,
  sendOtpValidator,
  updateSubAdminValidator,
  updateUserValidator,
} = require("../Joi/userJoi");
const { date } = require("../Middleware/dateFilterMid");
// ================== Midellwares ================== ||

// ============= Post =============
router.post("/register", createUserValidator, controller.register);
router.post("/login", logInValidator, controller.login);
router.post("/sendOtp", sendOtpValidator, controller.sendOtp);

// =============== Put ==========
router.put(
  "/updateUser/:userId",
  upload.single("image"),
  getUserById,
  updateUserValidator,
  controller.updateUser
);

// =============== get ===========
router.get("/getUserById/:userId", getUserById, controller.getUserById);

// =============== admin =========

// ======================= get =====================
router.get("/getAllUser/:adminId", adminRoute, date, controller.getAllUser);
router.get(
  "/getUserById/:userId/:adminId",
  adminRoute,
  getUserById,
  controller.getUserById
);
router.get("/user/Dashboard/:userId", controller.userDashBoard);
router.get("/userLogin/:id", controller.checkLogin);
// ========================== Put =======================
router.put(
  "/disableUser/:userId/:adminId",
  adminRoute,
  getUserById,
  controller.disableUser
);

router.put(
  "/updateSubAdmin/:userId/:adminId",
  adminRoute,
  getUserById,
  updateSubAdminValidator,
  controller.updateSubAdmin
);
//-------------------- admin login----------------------

router.post("/admin/login", addminLogInValidator, controller.adminLogin);

router.post(
  "/createSubadmin/:adminId",
  adminRoute,
  createSubAdminValidator,
  controller.createSubadmin
);

router.get("/getAllSubadmin/:adminId", adminRoute, controller.getAllSubadmin);

module.exports = router;
