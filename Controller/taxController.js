const taxModel = require("../Model/taxModel");

// ========================== Get Id =================================== ||

exports.getTaxtId = async (req, res, next, id) => {
  try {
    let Taxt = await taxModel.findById(id);
    if (!Taxt) {
      return res.status(404).json({
        success: false,
        message: "Tax Not Found",
      });
    } else {
      (req.Taxt = Taxt), next();
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ========================= Get By Tax Id ========================== ||

exports.getByTaxId = async (req, res) => {
  try {
    return res.status(200).send({
      success: true,
      message: "Tax Is Fetch Successfully...",
      data: req.Taxt,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

// ========================== Update Tax ======================== ||

exports.updateTax = async (req, res) => {
  try {
    const data = await taxModel.findOneAndUpdate(
      { _id: req.Taxt._id },
      { $set: { taxPercent: req.body.taxPercent } },
      { new: true }
    );
    return res
      .status(200)
      .send({
        success: true,
        message: "Tax Is Update Successfully",
        data: data,
      });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

// ==================== Get All Tax =====================

exports.getAllTax = async (req, res) => {
  try {
    const { disable } = req.query;
    let obj = {};
    if (disable) {
      obj.disable = disable;
    }
    let tax = await taxModel.find(obj);
    if (!tax.length) {
      return res.status(404).json({
        success: false,
        message: "Taxt Not Found",
      });
    }
    return res.status(200).send({
      success: true,
      message: "All Tax Fetch Successfully...",
      data: tax,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};
