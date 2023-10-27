const express = require("express");
const controller = require("../Controller/dashBoardController");
const router = express.Router();

const { adminRoute } = require("../Middleware/auth");

router.get("/dashBoard", controller.dashBoard);

module.exports = router;
