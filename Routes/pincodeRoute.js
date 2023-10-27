const express = require('express')
const controller =  require('../Controller/pincodeController')
const router = express.Router()

router.post('/createPincode',controller.createPincode)
router.get('/getAllPincode',controller.getAllpincode)
router.get('/getByPincode',controller.getDataByPincode)
router.put('/updatePincode/:pincodeId',controller.updatepincode)
router.delete('/deltePincode/:pincodeId',controller.delete)
// router.post("/main",controller.main)
module.exports = router