const express = require("express");
const controller = require("../Controller/taxController");
const { adminRoute } = require("../Middleware/auth");
const router = express.Router();
router.param("TaxtId", controller.getTaxtId);
// =============== Admin ===============
// ================= Get ============

router.get("/getTaxById/:TaxtId/:adminId", adminRoute, controller.getByTaxId);
router.get("/getAllTax", controller.getAllTax);
// ==================== Put ===================

router.put("/updateTax/:TaxtId/:adminId", adminRoute, controller.updateTax);

module.exports = router;
