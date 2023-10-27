const mongoose = require("mongoose");
let objectId = mongoose.Types.ObjectId;
const pincodeModel = new mongoose.Schema({
    pincode : Number,
    stateName : String,
    cityName : String,
},{timestamps : true})
module.exports = mongoose.model("pincodemodel",pincodeModel)