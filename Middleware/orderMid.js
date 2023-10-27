const orderModel = require("../Model/orderModel")

const getOrderByOrderId = async function(req,res,next){
    try {
        const {orderId} = req.params

        const getOrder= await orderModel.findById(orderId).populate({path : "product",populate : {path  : "productId"}}).populate("userId")
        if(!getOrder){
            return res.status(400).send({success : false,message: "Provide Valid OrderId"})
        }
        req.getOrderByOrderId=getOrder
        next()
    } catch (error) {
        return res.status(500).send({success : false,message : error.message})
    }
}

module.exports = {getOrderByOrderId}