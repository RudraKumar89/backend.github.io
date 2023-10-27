const express = require('express')
const controller = require('../Controller/filterController')
const router = express.Router()

router.get("/filter/rangeFilter",controller.range)
router.get("/filter", controller.productFilter)

module.exports = router;