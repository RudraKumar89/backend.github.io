const productModel = require("../Model/productModel");
const taxModel = require("../Model/taxModel");
const reviewModel = require("../Model/reviewModel");
const reatOfGoldModel = require("../Model/reatOfGoldModel");
const fs = require("fs");

exports.createProduct = async (req, res) => {
  try {
    let {
      name,
      size,
      goldPurity,
      gender,
      productType,
      occasion,
      materialColour,
      jewellaryType,
      metel,
      categoryId,
      brand,
      taxId,
      description,
      metaDescription,
      metaTitle,
      metaTags,
      //
      weigth,
      // price,
      discount,
      stoneDetail,
      stock,
      makingChargeInPersent,
      rate,
      // priceVariant,
    } = req.body;

    // let priceVariant = [{mrp:2400,beforeTaxValue:1000,}]
    let images;
    let banner;
    let thumbnail;
    let metaImage;
    if (req.files) {
      images = req.files ? req.files?.images?.map((o) => o.path) : null;
      banner = req.files?.thumbnail ? req.files?.thumbnail[0]?.path : null;
      thumbnail = req.files?.thumbnail ? req.files?.thumbnail[0]?.path : null;
      metaImage = req.files?.metaImage ? req.files.metaImage[0]?.path : null;
    }

    //  calculation
    let taxData = await taxModel.findById(taxId);
    let rateOfGold = await reatOfGoldModel.findById(rate);
    let price1 = (weigth * rateOfGold?.rate) / 10;
    let makingCharge = (price1 * makingChargeInPersent) / 100;
    let price = price1 + makingCharge + (stoneDetail ? stoneDetail : 0);
    let diss = (price * discount) / 100;
    let tax = (taxData?.taxPercent * price) / 100;
    let offPrice = price + tax - diss;

    let createdProduct = await productModel.create({
      name: name,
      thumbnail: thumbnail,
      categoryId: categoryId,
      brand: brand,
      taxId: taxId,
      rate: rate,
      productImages: images,
      productBanner: banner,
      description: description,
      metaImage: metaImage,
      metaDescription: metaDescription,
      metaTitle: metaTitle,
      metaTags: metaTags,
      size: size,
      goldPurity: goldPurity,
      gender: gender,
      productType: productType,
      occasion: occasion,
      materialColour: materialColour,
      jewellaryType: jewellaryType,
      metel: metel,
      weigth: weigth,
      price: price,
      discount: diss,
      stoneDetail: stoneDetail,
      stock: stock,
      offPrice: offPrice,
      makingCharge: makingCharge,
      // priceVariant: priceVariant,
    });

    return res.status(200).send({
      success: true,
      message: "Product Created",
      data: createdProduct,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

exports.getByProductId = async (req, res) => {
  try {
    const ratingCounts = [0, 0, 0, 0, 0];

    const reviews = await reviewModel
      .find({ productId: req.getProductById._id, disable: false })
      .populate("userId productId");

    reviews.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) {
        ratingCounts[review.rating - 1]++;
      }
    });

    const ratingDistribution = {
      oneRating: ratingCounts[0],
      twoRating: ratingCounts[1],
      threeRating: ratingCounts[2],
      fourRating: ratingCounts[3],
      fiveRating: ratingCounts[4],
    };

    return res.status(200).json({
      success: true,
      message: "Product Fatch Successfully...",
      data: {
        product: req.getProductById,
        reviews,
        ratingDistribution,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllProduct = async (req, res) => {
  try {
    let { page, disable } = req.query;
    const startIndex = page ? (page - 1) * 20 : 0;
    const endIndex = startIndex + 20;
    let obj = {};
    if (disable) {
      obj.disable = disable;
    }
    let length = await productModel.countDocuments(obj);
    let count = Math.ceil(length / 20);
    let data = await productModel
      .find()
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(endIndex)
      .populate("categoryId brandId");
    if (!data.length) {
      return res.status(200).send({
        success: true,
        message: "No Product Found",
      });
    }
    return res.status(200).send({
      success: true,
      message: "All Data Fecthed",
      data: data,
      page: count,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    let {
      name,
      size,
      goldPurity,
      gender,
      productType,
      occasion,
      materialColour,
      jewellaryType,
      metel,
      categoryId,
      brand,
      taxId,
      description,
      metaDescription,
      metaTitle,
      metaTags,
      //
      weigth,
      // price,
      discount,
      stoneDetail,
      stock,
      makingChargeInPersent,
      rate,
    } = req.body;

    let thumbnail;
    let metaImage;
    if (req.files) {
      if (req.files.images && req.getProductById.productImages.length) {
        req.files.images?.map((o) => {
          req.getProductById.productImages.push(o.path);
        });
      }
      if (req.files.banner && req.getProductById.productBanner.length) {
        req.files.banner?.map((o) => {
          req.getProductById.productBanner.push(o.path);
        });
      }
      thumbnail = req.files.thumbnail
        ? req.files.thumbnail[0].path
        : req.getProductById.thumbnail;
      metaImage = req.files.metaImage
        ? req.files.metaImage[0].path
        : req.getProductById.metaImage;
    }

    if (thumbnail && req.getProductById.thumbnail != null) {
      await fs.unlink(req.getProductById.thumbnail, (err) => {
        if (err) {
          console.log(err.message);
        }
      });
    }

    if (metaImage && req.getProductById.metaImage != null) {
      await fs.unlink(req.getProductById.metaImage, (err) => {
        if (err) {
          console.log(err.message);
        }
      });
    }
    //  calculation
    let obj = {};
    let obj1 = {};
    if (rate) {
      obj._id = rate;
    } else {
      obj._id = req.getProductById.rate;
    }
    if (taxId) {
      obj1._id = taxId;
    } else {
      obj1._id = req.getProductById?.taxId;
    }
    let taxData = await taxModel.findById(obj1);
    let rateOfGold = await reatOfGoldModel.findById(obj);
    let weigth1 = weigth ? weigth : req.getProductById.weigth;
    let price1 = (weigth1 * rateOfGold?.rate) / 10;
    let makingCharge1 = makingChargeInPersent
      ? makingChargeInPersent
      : req.getProductById.makingChargeInPersent;
    let makingCharge = (price1 * makingCharge1) / 100;
    let price =
      price1 +
      makingCharge +
      (stoneDetail
        ? stoneDetail
        : req.getProductById?.stoneDetail
        ? req.getProductById?.stoneDetail
        : 0);
    let diss1 = discount ? discount : req.getProductById?.discount;
    let diss = (price * diss1) / 100;
    let tax = (taxData?.taxPercent * price) / 100;
    let offPrice = price + tax - diss;
    let update = await productModel.findOneAndUpdate(
      { _id: req.getProductById._id },
      {
        $set: {
          name: name,
          thumbnail: thumbnail,
          categoryId: categoryId,
          brand: brand,
          taxId: taxId,
          productImages: req.getProductById.productImages,
          productBanner: req.getProductById.productBanner,
          description: description,
          metaImage: metaImage,
          metaDescription: metaDescription,
          metaTitle: metaTitle,
          metaTags: metaTags,
          size: size,
          rate: rate,
          goldPurity: goldPurity,
          gender: gender,
          productType: productType,
          occasion: occasion,
          materialColour: materialColour,
          jewellaryType: jewellaryType,
          metel: metel,
          weigth: weigth,
          price: price,
          discount: diss,
          stoneDetail: stoneDetail,
          stock: stock,
          offPrice: offPrice,
          makingCharge: makingCharge,
          // priceVariant: priceVariant,
        },
      },
      {
        new: true,
      }
    );
    return res.status(200).send({
      success: true,
      message: "Updated Successfully",
      updatedData: update,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

exports.unlinkImage = async (req, res) => {
  try {
    let { productImage, productBanner } = req.query;
    if (productImage == 0 || productImage) {
      for (let i = 0; i < req.getProductById.productImages.length; i++) {
        if (i == productImage) {
          req.getProductById.productImages.splice(i, 1);
          await req.getProductById.save();
        }
      }
    }
    if (productBanner == 0 || productBanner) {
      for (let i = 0; i < req.getProductById.productBanner.length; i++) {
        if (i == productBanner) {
          req.getProductById.productBanner.splice(i, 1);
          await req.getProductById.save();
        }
      }
    }
    return res.status(200).send({
      success: true,
      message: "Image Is Unlink Successfully",
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

exports.disableProduct = async (req, res) => {
  try {
    let updateProduct = await productModel.findByIdAndUpdate(
      { _id: req.getProductById._id },
      {
        $set: {
          disable: !req.getProductById.disable,
        },
      },
      { new: true }
    );
    if (updateProduct.disable == true) {
      return res.status(200).json({
        success: true,
        message: "Product Successfully Disable...",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Product Successfully Enable...",
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.productFilter = async (req, res) => {
  let {
    categoryId,
    name,
    price,
    productId,
    brandId,
    discount,
    stock,
    sold,
    rating,
  } = req.query;
  let obj = {};
  let obj2 = {};

  if (req.filterQuery) {
    obj.createdAt = req.filterQuery;
  }

  if (categoryId) {
    obj.categoryId = categoryId;
  }
  if (productId) {
    obj._id = productId;
  }
  if (brandId) {
    obj.brandId = brandId;
  }
  if (discount) {
    if (discount !== "LOWTOHIGH" && discount !== "HIGHTOLOW") {
      return res.status(400).send({
        success: false,
        message: "LOWTOHIGH and HIGHTOLOW are valid!",
      });
    } else {
      if (discount === "LOWTOHIGH") {
        obj2.priceDiscount = 1;
      } else {
        obj2.priceDiscount = -1;
      }
    }
  }
  if (stock) {
    if (stock !== "LOWTOHIGH" && stock !== "HIGHTOLOW") {
      return res.status(400).send({
        success: false,
        message: "LOWTOHIGH and HIGHTOLOW are valid!",
      });
    } else {
      if (stock === "LOWTOHIGH") {
        obj2.stock = 1;
      } else {
        obj2.stock = -1;
      }
    }
  }
  if (sold) {
    if (sold !== "LOWTOHIGH" && sold !== "HIGHTOLOW") {
      return res.status(400).send({
        success: false,
        message: "LOWTOHIGH and HIGHTOLOW are valid!",
      });
    } else {
      if (sold === "LOWTOHIGH") {
        obj2.sold = 1;
      } else {
        obj2.sold = -1;
      }
    }
  }

  if (rating) {
    if (rating !== "LOWTOHIGH" && rating !== "HIGHTOLOW") {
      return res.status(400).send({
        success: false,
        message: "LOWTOHIGH and HIGHTOLOW are valid!",
      });
    } else {
      if (rating === "LOWTOHIGH") {
        obj2.averageRating = 1;
      } else {
        obj2.averageRating = -1;
      }
    }
  }

  if (name) {
    obj.name = RegExp(name, "i");
  }

  if (price) {
    if (price !== "LOWTOHIGH" && price !== "HIGHTOLOW") {
      return res.status(400).send({
        success: false,
        message: "LOWTOHIGH and HIGHTOLOW are valid!",
      });
    } else {
      if (price === "LOWTOHIGH") {
        obj2.afterTaxValue = 1;
      } else {
        obj2.afterTaxValue = -1;
      }
    }
  }
  obj2.createdAt = -1;
  let filterData = await productModel
    .find(obj)
    .sort(obj2)
    .populate("categoryId brandId");
  let page = req.query.page;
  const startIndex = page ? (page - 1) * 20 : 0;
  const endIndex = startIndex + 20;
  let length = filterData.length;
  let count = Math.ceil(length / 20);
  let data = filterData.slice(startIndex, endIndex);
  return res.status(200).send({
    success: true,
    message: "Filter Apply Succesfully",
    data: data,
    page: count,
  });
};

exports.relatedProduct = async (req, res) => {
  try {
    let data = await productModel
      .find({ brandId: req.params.brandId })
      .sort({ createdAt: -1 })
      .populate("categoryId brandId");
    return res.status(200).send({
      success: true,
      message: "All Data Fecthed",
      data: data,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

exports.alternativeMedicine = async (req, res) => {
  try {
    let data = await productModel
      .find({ categoryId: req.params.categoryId })
      .sort({ createdAt: -1 })
      .populate("categoryId brandId");
    return res.status(200).send({
      success: true,
      message: "All Data Fecthed",
      data: data,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

exports.showInHome = async (req, res) => {
  try {
    let updateData = await productModel.findByIdAndUpdate(
      { _id: req.params.productId },
      { $set: { showInHome: !req.getProductById.showInHome } },
      { new: true }
    );
    if (updateData.showInHome == true) {
      return res
        .status(200)
        .send({ success: true, message: "showInHome Is True" });
    } else {
      return res
        .status(200)
        .send({ success: true, message: "showInHome Is False" });
    }
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

exports.fiftyPersentDiscount = async (req, res) => {
  try {
    let data = await productModel
      .find({ priceDiscount: { $gte: 50 } })
      .sort({ createdAt: -1 })
      .populate("categoryId brandId");
    return res.status(200).send({
      success: true,
      message: "fifty Persent Discount Product Fecthed Successfully",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.newArrival = async (req, res) => {
  try {
    let productData = await productModel
      .find({ disable: false })
      .sort({ createdAt: -1 })
      .limit(10);
    return res.status(200).send({
      success: true,
      message: "New Arrival Fetched",
      newArrival: productData,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};
