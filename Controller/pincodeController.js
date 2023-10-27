const pincodeModel = require("../Model/pincodeModel")

// code for uploading csv file 
// const csvParser = require('csv-parser');
// const csvFilePath = './Pincode_30052019.csv';
// const mongoose = require("mongoose")
// const fs = require('fs');

// exports.main = async function (req,res) {
//     try {
       
//         const csvStream = fs.createReadStream(csvFilePath)
//             .pipe(csvParser());

//         csvStream.on('data', async (data) => {
         
//             const document = new pincodeModel({
//                 pincode: data.Pincode.trim(),
//                 stateName: data.StateName.trim(),
//                 cityName: data.District.trim()
//             })

//            let a =  await document.save();
//         });

//         csvStream.on('end', () => {
//             console.log('CSV data has been manually imported into MongoDB collection.');
//             // mongoose.connection.close();
//         });
//     } catch (error) {
//         console.error('Error:', error);
//     }
// }

exports.createPincode = async(req,res)=>{
 try {
    let {code , cityId}=req.body
 if(!code){
    return res.status(400).send({success:true,message:"code is required"})
}
if(!cityId){
    return res.status(400).send({success:true,message:"cityId is required"})
}
let data = await pincodeModel.create({
    code:code,
    cityId:cityId
})
return res.status(200).send({success:true,message:"pincode Created",data:data})

 } catch (error) {
    return res.status(500).send({success:false,message:error.message})
 }
}
exports.getAllpincode = async(req,res)=>{
    try {
        let {disable} = req.query
        let obj = {}
        if(disable){
            obj.disable = disable
        }
     
        let allpincode = await pincodeModel.find().limit(20)
    if(!allpincode){
        return res.status(400).send({success:true,message:"pincode not found"})
    }
    return res.status(200).send({success:true,message:"all pincode fetched successfully",data:allpincode})
    } catch (error) {
        return res.status(500).send({success:false,message:error.message})  
    }
}
exports.updatepincode = async (req,res)=>{
  try {
    let update = await pincodeModel.findByIdAndUpdate(
        {
            _id:req.params.pincodeId
        },
        {
          $set:{
            code:req.body.code,
            cityId:req.body.cityId
          }
        },
        {
            new:true
        }
      )
      return res.status(200).send({success:true,message:"update state",data:update})
  } catch (error) {
    return res.status(500).send({success:false,message:error.message})  
  }
}

exports.getDataByPincode = async(req,res)=>{
try {
    let data = await pincodeModel.findOne({pincode:req.query.pincode})
    if(!data){
        return res.status(400).send({success:false,message:"not available data from this pincode"})
    }
    return res.status(200).send({success:true,message:"data fetched from pincode",data:data})

} catch (error) {
    return res.status(500).send({success:false,message:error.message})
}    
}
exports.delete = async (req,res)=>{ 
    try {
        let deleteData = await pincodeModel.deleteOne({_id:req.params.stateId})
        return res.status(200).send({success:true,message:"State Deleted",data:deleteData})
    } catch (error) {
        return res.status(500).send({success:false,message:error.message}) 
    }
}
