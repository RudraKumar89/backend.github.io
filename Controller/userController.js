const userModel = require("../Model/userModel");
const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");
const http = require("http");
const bcrypt = require("bcrypt");
const { userType } = require("../helper/userType");
const cartModel = require("../Model/cartModel");
const wishListModel = require("../Model/wishlistModel");
const orderModel = require("../Model/orderModel");

// =========================== Send Otp Function ============================== ||

const sendMailOTP = (email, val) => {
  let transporter = nodemailer.createTransport({
    host: "smtpout.secureserver.net",
    secure: true,
    secureConnection: false,
    tls: {
      ciphers: "SSLv3",
    },
    requireTLS: true,
    port: 465,
    debug: true,
    auth: {
      user: "support@hirrent.com",
      pass: "hiRRent@2023",
    },
  });
  let info = transporter.sendMail({
    from: '"FrameKart.com" <info@hirrent.com>', // sender address
    to: email, // list of receivers
    subject: "E-mail Verification", // Subject line
    text: "FrameCart E-commerce  ?", // plain text body
    html: `<html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta http-equiv="X-UA-Compatible" content="IE=edge">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <!-- CSS only -->
              <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
              <title>Document</title>
          </head>
          <body>
              <div class="container text-center">
                  <img class="img-thumbnail w-25 my-5" style="clip-path: circle(30%);" src="https://server.habooda.com/api/photos/1654168617218--WhatsApp%20Image%202022-04-22%20at%202.26.51%20PM.jpeg" alt="">
                  <p><mark>Verify</mark>Habooda is a ecoomerce clothes rent on rent service. <b>Habooda E-commerce</b></p>
                  <span>Your Verfication Code is : </span><button class="btn btn-dark">${val}</button>           
              </div>
          </body>
          </html>`,
  });
};
// ===================== Otp Generator ====================== ||

const otp = () => {
  let o = Number(
    otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    })
  );
  return o;
};

// ========================= Send Otp =========================== ||

exports.sendOtp = async (req, res) => {
  try {
    const { email, check } = req.body;
    let Otp = otp();
    if (check == true) {
      let getData = await userModel.findOne({ phoneNumber: phoneNumber });
      if (!getData) {
        return res.status(404).send({
          success: false,
          message: "User Not Found",
        });
      } else {
        sendMailOTP(email, Otp);
      }
    } else {
      sendMailOTP(email, Otp);
    }
    return res.status(200).json({
      success: true,
      message: "Otp Send Successfully...",
      otp: Otp,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// =================== Register ====================== ||

exports.register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const check = await userModel.findOne({ email: email });
    if (check) {
      return res
        .status(400)
        .json({ success: false, message: "email Is Already Exsist.." });
    }

    let hash = bcrypt.hashSync(password, 10, (err) => {
      if (err) {
        return res.status(400).send({ success: true, message: err.message });
      }
    });
    let userdata = await userModel.create({
      password: hash,
      fullName: fullName,
      email: email,
    });
    const generate = await jwt.sign({ User: userdata._id }, "SECRETEKEY", {
      expiresIn: "7d",
    });
    userdata._doc.token = generate;
    return res.status(201).send({
      success: true,
      message: "Register Successfully",
      data: userdata,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

// ====================== log In ========================= ||

exports.login = async (req, res) => {
  try {
    let User = await userModel.findOne({ email: req.body.email });
    if (!User) {
      return res.status(400).json({
        success: false,
        message: "user not found",
      });
    }
    if (User.disable == true) {
      return res.status(400).json({
        success: false,
        message: "User Is Ban",
      });
    }
   

    if (!comparePassword) {
      return res
        .status(400)
        .send({ success: false, message: "Provide Valid Password" });
    }
    const generate = await jwt.sign({ User: User._id }, "SECRETEKEY", {
      expiresIn: "7d",
    });
    if (req.body.fcmToken) {
      await userModel.findByIdAndUpdate(
        { _id: User._id },
        { $set: { userFcmToken: req.body.fcmToken } }
      );
    }
    User._doc.token = generate;
    return res.status(200).send({
      success: true,
      message: "User Successfully Login...",
      data: User,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

// ================== Get By Id ======================== ||

exports.getUserById = async (req, res) => {
  try {
    return res.status(200).send({
      success: true,
      message: "User Is Fetched Successfully...",
      data: req.getUserById,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

// ======================== Get All User ======================== ||

exports.getAllUser = async (req, res) => {
  try {
    const { search, disable, page, gender } = req.query;
    let a = null;
    if (search && search.length == 10 && !isNaN(Number(search))) {
      a = Number(search);
    }
    let query = {
      phoneNumber: { $nin: [null, undefined] },
    };
    if (a !== null && a !== undefined) {
      query.phoneNumber = a;
    }
    if (gender) {
      query.gender = gender;
    }
    if (disable) {
      query.disable = disable;
    }
    if (req.filterQuery) {
      query.createdAt = req.filterQuery;
    }
    query.userType = { $nin: ["ADMIN"] };
    let getData = await userModel.find(query).sort({ createdAt: -1 });
    if (search && a == null && a == undefined) {
      const regexSearch = new RegExp(search, "i");
      getData = getData.filter((e) => {
        return regexSearch.test(e?.fullName);
      });
    }

    const startIndex = page ? (page - 1) * 20 : 0;
    const endIndex = startIndex + 20;
    let length = getData.length;
    let count = Math.ceil(length / 20);
    let data = getData.slice(startIndex, endIndex);
    return res.status(200).send({
      success: true,
      message: "All User Fetch Successfully...",
      data: data,
      page: count,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

// =================== Log Out ===================== ||

exports.logOut = async (req, res) => {
  try {
    res.clearCookie("authorization");
    res
      .status(200)
      .json({ success: true, message: "Successfully Logout Your Account" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ============================= Update User ========================== ||

exports.updateUser = async (req, res) => {
  try {
    const { fullName, dob, gender, phoneNumber } = req.body;
    const UpdateUser = await userModel.findByIdAndUpdate(
      { _id: req.getUserById._id },
      {
        $set: {
          dob: dob ? dob : req.getUserById.dob,
          gender: gender ? gender : req.getUserById.gender,
          fullName: fullName ? fullName : req.getUserById.fullName,
          image: req.file ? req.file.path : req.getUserById.image,
          phoneNumber: phoneNumber,
        },
      },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "User Is Update Successfully...",
      data: UpdateUser,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ========================= Disable User ===================== ||

exports.disableUser = async (req, res) => {
  try {
    let updateUser = await userModel.findByIdAndUpdate(
      { _id: req.getUserById._id },
      {
        $set: {
          disable: !req.getUserById.disable,
        },
      },
      { new: true }
    );
    if (updateUser.disable == true) {
      return res.status(200).json({
        success: true,
        message: "User Successfully Disable...",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "User Successfully Enable...",
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.adminLogin = async function (req, res) {
  try {
    const { email, password, fcmToken } = req.body;
    const getprofile = await userModel.findOne({ email: email });
    if (!getprofile) {
      return (
        res.status(400),
        send({ success: false, message: "Admin or SubAdmin Does Not Exist" })
      );
    }

    if (getprofile.disable === true) {
      return res.status(400).send({
        success: false,
        message:
          "Sorry!, You can't login beacuse you have been blocked by admin",
      });
    }

    const comparePassword = bcrypt.compareSync(password, getprofile.password);

    if (!comparePassword) {
      return res
        .status(400)
        .send({ success: false, message: "Provide Valid Password" });
    }
    const jwtToken = jwt.sign(
      { userId: getprofile._id },
      process.env.SECRET_KEY
    );
    let updateFields = {};
    if (getprofile.userType.includes(userType.admin)) {
      updateFields.adminFcmToken = fcmToken;
    } else if (getprofile.userType.includes(userType.subAdmin)) {
      updateFields.subAdminFcmToken = fcmToken;
    }
    let data = await userModel.findByIdAndUpdate(
      {
        _id: getprofile._id,
      },
      {
        $set: updateFields,
      },
      { new: true }
    );

    data._doc.token = jwtToken;
    return res.status(200).json({
      success: true,
      message: "You Are Successfully Logged In",
      data: data,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

exports.createSubadmin = async (req, res) => {
  try {
    let { fullName, email, password, usertype, gender } = req.body;
    if (!email) {
      return res
        .status(400)
        .send({ success: false, message: "email is required" });
    }
    if (!password) {
      return res
        .status(400)
        .send({ sucess: false, message: "password is required" });
    }
    let check = await userModel.findOne({ email: email });
    if (check) {
      return res.status(400).json({
        success: false,
        message: "please provide unquie email Id",
      });
    }
    let hash = bcrypt.hashSync(password, 10, (err) => {
      if (err) {
        return res.status(400).send({ success: true, message: err.message });
      }
    });

    let createSubadmin = await userModel.create({
      fullName: fullName,
      email: email,
      password: hash,
      userType: userType.subAdmin,
      gender: gender,
    });
    return res.status(200).send({
      success: true,
      message: "Subadmin Created Successfully",
      data: createSubadmin,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

exports.updateSubAdmin = async function (req, res) {
  try {
    const { fullName, userType, gender, password } = req.body;
    const getUserById = req.getUserById;
    let hash;
    if (password) {
      hash = bcrypt.hashSync(password, 10, (err) => {
        if (err) {
          return res.status(400).send({ success: true, message: err.message });
        }
      });
    }
    let updateSubadmin = await userModel.findByIdAndUpdate(
      getUserById._id,
      {
        $set: {
          fullName: fullName,
          userType: userType,
          gender: gender,
          password: hash ? hash : getUserById.password,
        },
      },
      { new: true }
    );

    return res.status(200).send({
      success: true,
      message: "Sub Admin Updated Successfully",
      data: updateSubadmin,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

exports.getAllSubadmin = async (req, res) => {
  try {
    let userType = { $in: ["SUBADMIN"] };
    let allSubadmin = await userModel.find({ userType: "SUBADMIN" });
    // if (!allSubadmin.length) {
    //   return res
    //     .status(400)
    //     .send({ success: false, message: "There is not subadmin" });
    // }
    return res.status(200).send({
      success: true,
      message: "Fetched All Subadmin",
      data: allSubadmin,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

exports.userDashBoard = async (req, res) => {
  try {
    let cartData = await cartModel.find({ userId: req.params.userId });
    let orderData = await orderModel.find({ userId: req.params.userId });
    let wishListData = await wishListModel.find({ userId: req.params.userId });
    let cartCount = cartData.length;
    let orderCount = orderData.length;
    let wishlistCount = wishListData.length;
    return res.status(200).send({
      success: true,
      message: "count of order and cart from user id",
      cartCount: cartCount,
      orderCount: orderCount,
      wishlistCount: wishlistCount,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

exports.checkLogin = async (req, res) => {
  try {
    const id = req.params.id;
    const userData = await userModel.findById(id);

    const token = req.headers["authorization"];

    if (!userData) {
      return res
        .status(400)
        .send({ success: false, message: "User Not Found" });
    }
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Token Not Provided" });
    }

    const decoded = jwt.verify(token, "SECRETEKEY");
    if (decoded) {
      return res.status(200).send({ success: true, message: "You Are Login" });
    }
  } catch (error) {
    return res
      .status(400)
      .send({ success: false, message: "Your Token Is Expire !!!" });
  }
};
