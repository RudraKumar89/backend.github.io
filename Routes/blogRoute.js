const blogController = require("../Controller/blogController");
const { adminRoute } = require("../Middleware/auth");
const { getByBlogId } = require("../Middleware/blogMidd");
const { upload } = require("../Middleware/multerMiddleware");
const { createBlogValidator ,updateBlogValidator} = require("../Joi/blogJoi");
const { date } = require("../Middleware/dateFilterMid");
const express = require("express");
const router = express.Router();

router.get("/getAllBlog", date ,blogController.getAllBlog);
router.get("/getByBlogId/:blogId", getByBlogId, blogController.getByBlogId);

// Admin
router.post(
  "/createBlog/:adminId",
  adminRoute,
  upload.single("image"),
  createBlogValidator,
  blogController.createBlog
);
router.get(
  "/getByBlogId/:blogId/:adminId",
  adminRoute,
  getByBlogId,
  blogController.getByBlogId
);
router.put(
  "/updateBlog/:blogId/:adminId",
  adminRoute,
  getByBlogId,
  upload.single("image"),
  updateBlogValidator,
  blogController.updateBlog
);
router.put(
  "/disableBlog/:blogId/:adminId",
  adminRoute,
  getByBlogId,
  blogController.disableBlog
);

module.exports = router;
