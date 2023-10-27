const controller = require("../Controller/faqController");
const express = require("express");
const router = express.Router();
const { adminRoute } = require("../Middleware/auth");
router.param("FAQId", controller.getFAQId);
router.param("adminId", adminRoute);

// ================ Get ===========
router.get("/getAllFAQ", controller.getAllFAQ);

// =============== Admin ============
// ================= Post ================
router.post("/createFAQ/:adminId", adminRoute, controller.createFAQ);

// ================== Get ================
router.get("/getByFAQId/:FAQId/:adminId", adminRoute, controller.getByFAQId);

// =============== Put ============
router.put("/updateFAQ/:FAQId/:adminId", adminRoute, controller.updateFAQ);

// ============== Delete ============
router.delete("/deleteFAQ/:FAQId/:adminId", adminRoute, controller.deleteFAQ);

module.exports = router;
