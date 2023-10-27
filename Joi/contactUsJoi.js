const Joi = require("joi");

exports.createContactValidator = async (req, res, next) => {
  const data = req.body;
  const schema = Joi.object().keys({
    company: Joi.string().min(2).max(256).required(),
    email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required()
    .min(3)
    .max(90),
    message: Joi.string().min(2).max(256).required(),
    phone: Joi.string().length(10).required(),
    name: Joi.string().min(2).max(256).required(),
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


exports.updateContactValidator = async (req, res, next) => {
  const data = req.body;
  const schema = Joi.object().keys({
    company: Joi.string().min(2).max(256),
    email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .min(3)
    .max(90),
    message: Joi.string().min(2).max(256),
    phone: Joi.string().length(10),
    name: Joi.string().min(2).max(256),
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