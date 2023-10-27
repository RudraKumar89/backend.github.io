const addressModel = require('../Model/addressModel')
exports.getById = async (req,res,next)=>{

    try{  let {addressId} = req.params
           let Address = await addressModel
             .findById(addressId)
           if (!Address) {
             return res.status(404).json({
               success: false,
               message: "Address Not Found",
             });
           } else {
             (req.address = Address), next();
           }
         } 
    catch (error) {
       return res.status(500).send({success:false,message:error.message})
   }
   }