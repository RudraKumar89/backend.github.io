const Joi = require("joi");

exports.createPriceRangValidator = async (req, res, next) => {
  const data = req.body;
  const schema = Joi.object().keys({
    min: Joi.number().required(),
    max: Joi.number().required(),
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


exports.updatePriceRangValidator = async (req, res, next) => {
  const data = req.body;
  const schema = Joi.object().keys({
    min: Joi.number(),
    max: Joi.number(),
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
