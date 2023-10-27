const Joi = require("joi");

exports.createCouponValidator = async (req, res, next) => {
  const data = req.body;
  const schema = Joi.object().keys({
    couponName: Joi.string().required(),
    couponCode: Joi.string().required(),
    discount: Joi.number().required(),
    categoryId: Joi.array().required(),
    startDate: Joi.date().iso().required(),
    oneTimeUse: Joi.boolean().truthy(true).falsy(false),
    endDate: Joi.date().iso().required(),
    minimumOrderValue: Joi.number().required(),
    maximumDiscount: Joi.number().required(),
    couponQuantity: Joi.number().required(),
    disable: Joi.boolean().truthy(true).falsy(false),
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

exports.updateCouponValidator = async (req, res, next) => {
  const data = req.body;
  const schema = Joi.object().keys({
    couponName: Joi.string(),
    couponCode: Joi.string(),
    discount: Joi.number(),
    categoryId: Joi.array(),
    startDate: Joi.date().iso(),
    oneTimeUse: Joi.boolean().truthy(true).falsy(false),
    endDate: Joi.date().iso(),
    minimumOrderValue: Joi.number(),
    maximumDiscount: Joi.number(),
    couponQuantity: Joi.number(),
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
