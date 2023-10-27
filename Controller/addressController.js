const addressModel = require("../Model/addressModel");
const pincodeModel = require("../Model/pincodeModel");

///////////////////////////  Create Address    ///////////////////////////////

exports.createAddress = async (req, res) => {
  try {
    let { name, mobile, houseNumber, pincode, landmark, area } = req.body;

    let getUserById = req.getUserById;
   let pinCode = await pincodeModel.findOne({ pincode: pincode });
      // let pinCode = pincode;
    if (!pinCode) {
     return res
       .status(400)
       .send({ success: false, message: "Please Provide Valid Pincode" });
   }
    let data = await addressModel.create({
      name: name,
      mobile: mobile,
      houseNumber: houseNumber,
      userId: getUserById._id,
      pincodeId: pinCode?._id,
      cityName: pinCode?.cityName,
      stateName: pinCode?.stateName,
      pincode: pincode,
      landmark: landmark,
      area: area,
    });
    return res.status(201).send({
      success: true,
      message: "Address Added Successfully",
      data: data,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

///////////////////////////  Get All Address  ///////////////////////////////////////

exports.getAllAddressByUserId = async (req, res) => {
  try {
    let data = await addressModel.find({
      userId: req.getUserById,
      disable: false,
    });
    if (!data.length) {
      return res
        .status(200)
        .send({ success: false, message: "Address Not Found", data: [] });
    }
    return res.status(200).send({
      success: true,
      message: "Address Feteched Successfully By User",
      data: data,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

//////////////  Get By Id  ////////////////////////

exports.getAddressById = async (req, res) => {
  try {
    let getAddress = req.address;
    return res.status(200).send({
      success: true,
      message: "Address Feteched Successfully",
      data: getAddress,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

///////////////////////////  Update Address  ///////////////////////////////////////

exports.updateAddress = async (req, res) => {
  try {
    let getAddress = req.address;
    let { name, mobile, houseNumber, userId, pincode, landmark, area } =
      req.body;
    let pincodeData;
    if (pincode) {
      pincodeData = await pincodeModel.findOne({ pincode: pincode });
    }
    let find = await addressModel.findById({ _id: getAddress._id });
    let data = await addressModel.findByIdAndUpdate(
      { _id: getAddress._id },
      {
        $set: {
          name: name,
          mobile: mobile,
          houseNumber: houseNumber,
          userId: userId,
          pincodeId: pincodeData ? pincodeData._id : find.pincodeId,
          pincode: pincode,
          cityName: pincodeData ? pincodeData.cityName : find.cityName,
          stateName: pincodeData ? pincodeData.stateName : find.stateName,
          landmark: landmark,
          area: area,
        },
      },
      { new: true }
    );
    return res
      .status(200)
      .send({ success: true, message: "Address Upadte Successful", data: data });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

//////////////////////////////////   Address Disable    /////////////////////

exports.addressDisable = async (req, res) => {
  try {
    let getAddress = req.address;
    let updateAddress = await addressModel.findByIdAndUpdate(
      { _id: getAddress._id },
      { $set: { disable: !getAddress.disable } },
      { new: true }
    );
    if (updateAddress.disable) {
      return res
        .status(200)
        .send({ success: true, message: "Address Is Disable" });
    } else {
      return res
        .status(200)
        .send({ success: true, message: "Address Is Enable" });
    }
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    let getAddress = req.address;
    let updateAddress = await addressModel.findByIdAndDelete({
      _id: getAddress._id,
    });
    return res.status(200).send({
      success: true,
      message: "Address Delete Successfully",
      data: updateAddress,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};
