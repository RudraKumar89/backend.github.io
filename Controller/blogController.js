const blogModel = require("../Model/blogModel");
const fs = require("fs");
const singleBannerModel = require("../Model/singleBannerModel");

/////////////////////////////////  Create blog  //////////////////////////////////

exports.createBlog = async (req, res) => {
  try {
    let { title, discription, subtitle } = req.body;
    let blog = await blogModel.create({
      title: title,
      discription: discription,
      subtitle: subtitle,
      image: req.file.path,
    });
    return res
      .status(201)
      .json({ success: true, message: "Create Blog Successfully", data: blog });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

////////////////////////////////  Get all blog  //////////////////////////////////

exports.getAllBlog = async (req, res) => {
  try {
    // let { page } = req.query;
    let singleBanner = await singleBannerModel.findOne();

    // const startIndex = page ? (page - 1) * 20 : 0;
    // const endIndex = startIndex + 20;
    // let obj = {};
    // if (disable) {
    //   obj.disable = disable;
    // }
    // if (req.filterQuery) {
    //   obj.createdAt = req.filterQuery;
    // }
    // let length = await blogModel.countDocuments(obj);
    // let count = Math.ceil(length / 20);
    let blog = await blogModel.find().sort({ createdAt: -1 });
    // .skip(startIndex)
    // .limit(endIndex);
    // if (!blog.length) {
    //   return res
    //     .status(404)
    //     .json({ success: false, message: "Blog Not Found" });
    // }
    return res.status(200).json({
      success: true,
      message: "Get All Blog",
      singleBanner: singleBanner,
      data: blog,
      // page: count,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

//////////////////////////////  Get by blogId  ///////////////////////////////

exports.getByBlogId = async (req, res) => {
  try {
    let blog = req.blogId;
    return res
      .status(200)
      .json({ success: true, message: "Get by BlogId", data: blog });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

////////////////////////////  Update blog  //////////////////////////////////

exports.updateBlog = async (req, res) => {
  try {
    let blogId = req.blogId;
    let { title, discription, subtitle } = req.body;
    let image = req.file ? req.file.path : null;

    if (image && blogId?.image != null) {
      await fs.unlink(blogId?.image, (err) => {
        if (err) {
          console.log(err.message);
        }
      });
    }
    let blog = await blogModel.findByIdAndUpdate(
      { _id: blogId._id },
      {
        $set: {
          title: title,
          discription: discription,
          subtitle: subtitle,
          image: image ? image : blogId?.image,
        },
      },
      { new: true }
    );
    return res
      .status(200)
      .json({ success: true, message: "Blog Update Successfully", data: blog });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

////////////////////////////  blog disable  ////////////////////////////////////

exports.disableBlog = async (req, res) => {
  try {
    let blogId = req.blogId;
    let blog = await blogModel.findByIdAndUpdate(
      { _id: blogId._id },
      {
        $set: {
          disable: !blogId.disable,
        },
      },
      { new: true }
    );
    if (blog.disable) {
      return res
        .status(200)
        .json({ success: true, message: "Blog Is Disable" });
    } else {
      return res.status(200).json({ success: true, message: "Blog Is Enable" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
