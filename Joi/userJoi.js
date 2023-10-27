const Joi = require("joi");
const { userType } = require("../helper/userType");

// =========== create =============
exports.createUserValidator = async (req, res, next) => {
  const data = req.body;
  const schema = Joi.object().keys({
    fullName: Joi.string().required().min(2).max(256),
    email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required()
    .min(3)
    .max(90),
    password: Joi.string().required(),
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

// ============ Send Otp =========
exports.sendOtpValidator = async (req, res, next) => {
  const data = req.body;
  const schema = Joi.object().keys({
    check: Joi.boolean().truthy(true).falsy(false),
    phoneNumber: Joi.string().required().length(10),
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

exports.logInValidator = async (req, res, next) => {
  const data = req.body;
  const schema = Joi.object().keys({
    email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required()
    .min(3)
    .max(90),
    password: Joi.string().required(),
    fcmToken: Joi.string(),
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

exports.updateUserValidator = async (req, res, next) => {
  const data = req.body;
  const schema = Joi.object().keys({
    fullName: Joi.string().min(2).max(256),
    dob: Joi.string(),
    gender: Joi.string().valid("MALE", "FEMALE", "OTHER"),
  });
  const schema2 = Joi.object();
  try {
    await Promise.all([
      schema2.validateAsync(req.file),
      schema.validateAsync(data),
    ]);
    next();
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.details[0].message.replace(/['"]/g, ""),
    });
  }
};

exports.addminLogInValidator = async (req, res, next) => {
  const data = req.body;
  const schema = Joi.object().keys({
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required()
      .min(3)
      .max(90),
    fcmToken: Joi.string(),
    password: Joi.string().required(),
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

exports.createSubAdminValidator = async (req, res, next) => {
  const data = req.body;
  const schema = Joi.object().keys({
    fullName: Joi.string().min(2).max(256),
    gender: Joi.string().valid("MALE", "FEMALE", "OTHER"),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required()
      .min(3)
      .max(90),
    password: Joi.string().required(),
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

exports.updateSubAdminValidator = async (req, res, next) => {
  const data = req.body;
  const schema = Joi.object().keys({
    fullName: Joi.string().min(2).max(256),
    gender: Joi.string().valid("MALE", "FEMALE", "OTHER"),
    usertype: Joi.string().valid(userType),
    password: Joi.string(),
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
