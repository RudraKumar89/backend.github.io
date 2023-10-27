const Controller = require("../Controller/homePageController");
const express = require("express");
const router = express.Router();


router.get("/homePage", Controller.homePage);

module.exports = router;
