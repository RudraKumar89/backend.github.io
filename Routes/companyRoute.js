const express  = require("express")
const router = express.Router()
const {upload} = require('../Middleware/multerMiddleware')

const companyController = require("../Controller/companyController")


router.put("/company/updateCompany",upload.fields([{name:"banner"},{name:"loader"},{name:"fav_icon"},{name:"header_logo"},{name:"footer_logo"}]),companyController.updateCompany)
router.get("/company/getCompany",companyController.getCompany)

module.exports = router;