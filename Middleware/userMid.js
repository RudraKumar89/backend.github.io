const userModel =require("../Model/userModel")

const getUserById=async function(req,res,next){
    try {
        const{userId} = req.params

        let getUserById = await userModel.findById(userId)
        if(!getUserById){
            return res.status(400).send({success: false,message: "Provide Valid userId "})
        }
        req.getUserById = getUserById
        next()
    } catch (error) {
       return res.status(500).send({success : false,message : error.message}) 
    }
}

module.exports={getUserById}