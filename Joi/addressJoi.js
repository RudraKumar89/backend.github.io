const Joi = require("joi");

exports.createAddressValidator = async (req, res, next) => {
  const data = req.body;
  const schema = Joi.object().keys({
    name: Joi.string().min(2).max(256).required(),
    mobile: Joi.string().length(10).required(),
    houseNumber: Joi.string().required(),
    pincode: Joi.string().length(6).required(),
    landmark: Joi.string().required(),
    area: Joi.string().required(),
  });
  try {
    await schema.validateAsync(data);
    next();
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.details[0].message.replace(/['"]/g, ""),
    });
  }
};

exports.updateAddressValidator = async (req, res, next) => {
  const data = req.body;
  const schema = Joi.object().keys({
    name: Joi.string().min(2).max(256),
    mobile: Joi.string().length(10),
    houseNumber: Joi.string(),
    pincode: Joi.string().length(6),
    landmark: Joi.string().min(5),
    area: Joi.string().min(5),
    userId: Joi.string(),
  });
  try {
    await schema.validateAsync(data);
    next();
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.details[0].message.replace(/['"]/g, ""),
    });
  }
};
