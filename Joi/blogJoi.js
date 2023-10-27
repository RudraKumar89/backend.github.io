const Joi = require("joi");

exports.createBlogValidator = async (req, res, next) => {
  const data = req.body;
  const schema = Joi.object().keys({
    title: Joi.string().required(),
    discription: Joi.string().required(),
    subtitle: Joi.string().required(),
    // image: Joi.object().required(),
  });
  const schema2 = Joi.object().required().messages({
    "any.required": "image is required", // Custom error message for the required field
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


exports.updateBlogValidator = async (req, res, next) => {
  const data = req.body;
  const schema = Joi.object().keys({
    title: Joi.string(),
    discription: Joi.string(),
    subtitle: Joi.string(),
    // image: Joi.object(),
  });
  const schema2 = Joi.object()
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
