const reviewModel = require("../Model/reviewModel");
const productModel = require("../Model/productModel");
// ==================  create Review ===================== ||

exports.createReview = async (req, res) => {
  try {
    let { userId, productId, message, rating } = req.body;
    let review = await reviewModel.create({
      userId: userId,
      productId: productId,
      message: message,
      rating: rating,
    });
    let total = 0;
    let reviews = await reviewModel.find({ productId: productId });
    for (let i = 0; i < reviews.length; i++) {
      total += reviews[i].rating;
    }
    let ratings = total / reviews.length;
    await productModel.findByIdAndUpdate(
      { _id: productId },
      {
        $set: {
          averageRating: ratings.toFixed(1),
          reviewCount: reviews.length,
        },
      },
      { new: true }
    );
    return res.status(201).json({
      success: true,
      message: "Review Is Created Successfully...",
      data: review,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================== Get Review By Id ======================= ||

exports.getReviewById = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Review Is Fatch Successfully..",
      data: req.review,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =================== Get All Review ================== ||

exports.getAllReview = async (req, res) => {
  try {
    let {disable} = req.query
    if(disable){
      obj.disable = disable
    }
    let review = await reviewModel.find().populate("userId productId");
    if (!review.length) {
      return res.status(404).json({
        success: false,
        message: "Review Not Found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Review Is Fatch Successfully...",
      data: review,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================== update Review ======================== ||

exports.updateReview = async (req, res) => {
  try {
    let { message, rating } = req.body;
    let reviewUpdate = await reviewModel.findByIdAndUpdate(
      { _id: req.review._id },
      {
        $set: {
          message: message,
          rating: rating,
        },
      },
      { new: true }
    );
    let total = 0;
    let reviews = await reviewModel.find({ productId: reviewUpdate.productId });
    for (let i = 0; i < reviews.length; i++) {
      total += reviews[i].rating;
    }
    let ratings = total / reviews.length;
    await productModel.findByIdAndUpdate(
      { _id: reviewUpdate.productId },
      {
        $set: {
          averageRating: ratings.toFixed(1),
          reviewCount: reviews.length,
        },
      },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Review Is Update Successfully...",
      data: reviewUpdate,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================== disable Review ===================== ||

exports.disableReview = async (req, res) => {
  try {
    let reviewdisable = await reviewModel.findByIdAndUpdate(
      { _id: req.review._id },
      { $set: { disable: !req.review.disable } },
      { new: true }
    );
    if (reviewdisable.disable == true) {
      return res.status(200).json({
        success: true,
        message: "Review Is disable Successfully...",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Review Is Enable Successfully...",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =================== Get All Review By ProductId ================== ||

exports.getAllReviewByProductId = async (req, res) => {
  try {
    const ratingCounts = [0, 0, 0, 0, 0];

    const reviews = await reviewModel
      .find({ productId: req.params.productId, disable: false })
      .populate("userId productId");

    // Calculate the distribution of ratings
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
      message: "Reviews Fetched Successfully...",
      data: {
        reviews,
        ratingDistribution,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
