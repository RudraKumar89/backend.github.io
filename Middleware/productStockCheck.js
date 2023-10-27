const cartModel = require('../Model/cartModel')

exports.checkStock = async(req,res,next)=>{
    try {
        let cartData = await cartModel.find({userId:req.params.userId}).populate("productId")
        for(let i=0;i<cartData.length;i++){
            if(cartData[i].productId.stock<1){
                return res.status(400).send({success:false,message:"Product Out Of Stock"})
            }
        }
        next()
    } catch (error) {
        return res.status(500).send({success:false,message:error.message})
    }
}