const Joi = require("joi");

exports.createProductValidator = async (req, res, next) => {
  const data = req.body;
  const file = req.files;
  const schema = Joi.object()
    .keys({
      name: Joi.string().required(),
      categoryId: Joi.string().required(),
      taxId: Joi.string().required(),
      brandId: Joi.string().required(),
      multipleVariant: Joi.boolean(),
      priceVariant: Joi.array().when("multipleVariant", {
        is: true,
        then: Joi.required(),
      }),
      mrp: Joi.number().when("multipleVariant", {
        is: false,
        then: Joi.required(),
      }),
      beforeTaxValue: Joi.number().when("multipleVariant", {
        is: false,
        then: Joi.allow(null),
      }),
      afterTaxValue: Joi.number().when("multipleVariant", {
        is: false,
        then: Joi.allow(null),
      }),
      stock: Joi.number().when("multipleVariant", {
        is: false,
        then: Joi.required(),
      }),
      description: Joi.string().required(),
      metaTags: Joi.string(),
      metaDescription: Joi.string(),
      metaTitle: Joi.string(),
      keyBenefit: Joi.string(),
      directionForUse: Joi.string(),
      SafetyInformation: Joi.string(),
      otherInformation: Joi.string(),
      type: Joi.string(),
      affiliate: Joi.number(),
    })
  const schema2 = Joi.object().keys({
    thumbnail: Joi.array().required(),
    images: Joi.array().required(),
    banner: Joi.array().required(),
    metaImage: Joi.array(),
  });

  try {
    await Promise.all([
      schema2.validateAsync(req.files),
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

exports.updateProductValidator = async (req, res, next) => {
  const data = req.body;
  const file = req.files;
  const schema = Joi.object()
    .keys({
      name: Joi.string(),
      categoryId: Joi.string(),
      taxId: Joi.string(),
      brandId: Joi.string(),
      mrp: Joi.number(),
      beforeTaxValue: Joi.number().allow(null),
      afterTaxValue: Joi.number().allow(null),
      stock: Joi.number(),
      description: Joi.string(),
      metaTags: Joi.string(),
      metaDescription: Joi.string(),
      metaTitle: Joi.string(),
      multipleVariant: Joi.boolean(),
      priceVariant: Joi.array(),
    })
    .or("beforeTaxValue", "afterTaxValue");
  const schema2 = Joi.object().keys({
    thumbnail: Joi.array(),
    images: Joi.array(),
    banner: Joi.array(),
    metaImage: Joi.array(),
  });

  try {
    await Promise.all([
      schema2.validateAsync(req.files),
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
