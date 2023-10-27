const contactUsModel = require("../Model/contactUsModel");

/////////////////////////  Create contactUs  ///////////////////////////

exports.createContactUs = async (req, res) => {
  try {
    let { name, email, message, phone } = req.body;
    // let userId = req.params.userId
    let contactUs = await contactUsModel.create({
      // userId: userId,
      company: company,
      name: name,
      email: email,
      message: message,
      phone: phone,
    });
    return res
      .status(201)
      .json({ success: true, message: "Create ContactUs", data: contactUs });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

////////////////////////  Get by contactUsId  //////////////////////////

exports.getByContactUsId = async (req, res) => {
  try {
    let check = await contactUsModel.findById({ _id: req.params.contactUsId });
    if (!check) {
      return res
        .status(400)
        .json({ success: false, message: "ContactUs Not Found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Get By ContactUsId", data: check });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

///////////////////////  Get all contactUs  ////////////////////////

exports.getAllContactUs = async (req, res) => {
  try {
    let check = await contactUsModel.find();
    return res
      .status(200)
      .json({ success: true, message: "Get All ContactUs", data: check });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/////////////////////////  Update contactUs  ///////////////////////////

exports.updateContactUs = async (req, res) => {
  try {
    let { company, name, email, message, phone } = req.body;
    let check = await contactUsModel.findById({ _id: req.params.contactUsId });
    if (!check) {
      return res
        .status(400)
        .json({ success: false, message: "ContactUs Not Found" });
    }
    let contactUs = await contactUsModel.findByIdAndUpdate(
      { _id: check._id },
      {
        $set: {
          // company: company,
          name: name,
          email: email,
          message: message,
          phone: phone,
        },
      },
      { new: true }
    );
    return res
      .status(200)
      .json({
        success: true,
        message: "ContactUs Update Successful",
        data: contactUs,
      });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};