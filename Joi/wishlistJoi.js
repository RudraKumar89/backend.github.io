const Joi = require("joi");

exports.createWishlistValidator = async (req, res, next) => {
  const data = req.body;
  const schema = Joi.object().keys({
    userId: Joi.string().required(),
    productId: Joi.string().required() 
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
