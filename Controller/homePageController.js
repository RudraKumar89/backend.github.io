const categoryModel = require("../Model/categoryModel");
const bannerModel = require("../Model/bannerModel");
const singleBannerModel = require("../Model/singleBannerModel");
const homeCategoryModel = require("../Model/homeCategoryModel");
// =================== Home Page ==================== ||

exports.homePage = async (req, res) => {
  try {
    let home = [];
    let home1 = [];
    let home2 = [];
    let singlehome = [];
    let singlehome2 = [];
    let category = await categoryModel.find({ pCategory: null });
    let showInHomeCategory = await categoryModel.find({ showInhome: true });
    let homeCategory = await homeCategoryModel.find().populate("product");
    let banner = await bannerModel.findOne();
    let singleBanner = await singleBannerModel.find();
    singlehome.push(singleBanner[0])
    singlehome2.push(singleBanner[1])
    home.push(homeCategory[0]);
    home.push(homeCategory[1]);
    home1.push(homeCategory[2]);
    home1.push(homeCategory[3]);
    home.push(homeCategory[4]);
    home2.push(homeCategory[5]);
    return res.status(200).json({
      success: true,
      message: "Home Page Is Fatch Successfully....",
      data: {
        banner: banner,
        category: category,
        home: home,
        home1: home1,
        home2: home2,
        showInHomeCategory: showInHomeCategory,
        singlehome: singlehome,
        singlehome2: singlehome2,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
