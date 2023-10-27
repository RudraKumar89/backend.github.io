const reviewModel = require("../Model/reviewModel");

exports.getById = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const review = await reviewModel.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review Not Found",
      });
    }
    req.review = review;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
