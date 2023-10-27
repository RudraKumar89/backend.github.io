const bannerModel = require("../Model/bannerModel");
const fs = require("fs");

exports.updateBanner = async (req, res) => {
  try {
    let banner = [];
    if (req.files) {
      req.files?.banner.map((o) => banner.push(o.path));
    }
    let getBanners = await bannerModel.findOne();
    if (req.files?.banner && getBanners.banner.length > 0) {
      for (let i = 0; i < getBanners.banner.length; i++) {
        await fs.unlink(getBanners.banner[i], (err) => {
          if (err) {
            console.log(err.message);
          }
        });
      }
    }
    let updateBanners = await bannerModel.findByIdAndUpdate(
      { _id: req.params.bannerId },
      { $set: { banner: banner } },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Banner update Succcessfully...",
      data: updateBanners,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getBanner = async (req, res) => {
  try {
    let getBanners = await bannerModel.findOne();
    return res.status(200).json({
      success: true,
      message: "Banner Fatch Succcessfully...",
      data: getBanners,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
