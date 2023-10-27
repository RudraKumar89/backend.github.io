const Joi = require("joi");

exports.createReviewValidator = async (req, res, next) => {
  const data = req.body;
  const schema = Joi.object()
    .keys({
      userId: Joi.string().required(),
      productId: Joi.string().required(),
      message: Joi.string().required(),
      rating: Joi.number().required(),
    })

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

exports.updateReviewValidator = async (req, res, next) => {
  const data = req.body;
  const schema = Joi.object()
    .keys({
      message: Joi.string(),
      rating: Joi.number(),
    })

  try {
    await schema.validateAsync(data);
    next();
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.details[0].message.replace(/['"]/g, ""),
    });
  }
}