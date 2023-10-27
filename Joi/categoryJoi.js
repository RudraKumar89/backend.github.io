const Joi = require("joi");

exports.createCategoryValidator = async (req, res, next) => {
  const data = req.body;
  const schema = Joi.object().keys({
    name: Joi.string().required(),
    pCategory: Joi.string().required(),
  });
  const schema2 = Joi.object().required().messages({
    "any.required": "Icon is required", // Custom error message for the required field
  });
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

exports.updateCategoryValidator = async (req, res, next) => {
  const data = req.body;
  const schema = Joi.object().keys({
    name: Joi.string(),
    pCategory: Joi.string(),
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
