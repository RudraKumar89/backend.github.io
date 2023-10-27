const userModel = require("../Model/userModel");
const { userType } = require("../helper/userType");
const jwt = require("jsonwebtoken");

exports.adminRoute = async (req, res, next) => {
  try {
    let { adminId } = req.params;
    let User = await userModel.findById(adminId);
    let token = req.headers["authorization"];
    if (!User) {
      return res
        .status(404)
        .send({ success: false, message: "User Not Found" });
    }
    if (!token) {
      return res
        .status(400)
        .send({ success: false, message: "JWT Token Must Be Require" });
    }
    let decodeToken = jwt.verify(token, process.env.SECRET_KEY);
    if (!decodeToken) {
      return res
        .status(400)
        .send({ success: false, messsage: "Token Is Not Valid" });
    }
    if (
      User._id.toString() === decodeToken.userId &&
      User.userType.includes(userType.admin)
    ) {
      (req.admin = User), next();
    } else {
      return res.status(400).json({
        success: false,
        message: "You Are Not Admin...",
      });
    }
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};
