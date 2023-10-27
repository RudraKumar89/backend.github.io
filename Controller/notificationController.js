const notificationModel = require("../Model/notificationModel");
const { userType } = require("../helper/userType");
const {
  sendPushNotification,
} = require("../Middleware/notificationMiddleware");
const orderModel = require("../Model/orderModel");
const userModel = require("../Model/userModel");

// ====================  Get by notificationId  ======================= //

exports.getNotificationById = async (req, res) => {
  try {
    let getNotification = await notificationModel.findById({
      _id: req.params.notificationId,
    });
    if (!getNotification) {
      return res
        .status(404)
        .json({ success: false, message: "Notification Not Found" });
    }
    return res.status(200).json({
      success: true,
      message: "Notification Fatch Successfully...",
      data: getNotification,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ====================  Get by userId  ======================= //

exports.getNotificationByUserId = async (req, res) => {
  try {
    let obj = {};
    if (!req.query.userType) {
      return res.status(400).json({
        success: false,
        message: "userType Is Required",
      });
    }
    obj.userType = req.query.userType;
    obj.userId = req.params.userId;
    await notificationModel.updateMany(
      obj,
      { $set: { seen: true } },
      { new: true }
    );
    let getNotification = await notificationModel
      .find(obj)
      .sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      message: "Notification Fetch Successfully...",
      data: getNotification,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.sendNotificationToAllUser = async (req, res) => {
  try {
    if (!req.body.title) {
      return res.status(400).json({
        success: false,
        message: "title is required",
      });
    }
    if (!req.body.message) {
      return res.status(400).json({
        success: false,
        message: "message is required",
      });
    }
    const adminSubAdminFilter = {
      userType: {
        $ne: [userType.admin, userType.subAdmin],
      },
    };

    const adminSubAdminFields = ["userFcmToken"];
    const data = await userModel.find(adminSubAdminFilter).select("userType");

    const getAdminAndSubAdmin = await userModel
      .find(adminSubAdminFilter)
      .select(adminSubAdminFields.join(" "));
    const fcmToken = getAdminAndSubAdmin
      .map((user) => adminSubAdminFields.map((field) => user[field]))
      .flat()
      .filter((token) => token !== undefined && token !== null);

    const notifications = data.map((user) => {
      return {
        title: req.body.title,
        message: req.body.message,
        seen: false,
        date: new Date(),
        userId: user._id,
        // orderId: order._id,
        userType: userType.user,
      };
    });

    const message1 = {
      notification: {
        title: req.body.title,
        body: req.body.message,
      },
      tokens: fcmToken,
    };
    if (fcmToken.length > 0) {
      sendPushNotification(message1);
    }

    let data1 = await notificationModel.insertMany(notifications);
    return res.status(200).send({
      success: true,
      message: "Notification Send Successfully..",
      data: data1,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.sendNotificationToSingleUser = async (req, res) => {
  try {
    let fcmToken = [];
    if (!req.body.title) {
      return res.status(400).json({
        success: false,
        message: "title is required",
      });
    }
    if (!req.body.message) {
      return res.status(400).json({
        success: false,
        message: "message is required",
      });
    }
    let getAdminAndSubAdmin = await userModel.findOne({ _id: req.body.userId });
    let data;
    if (getAdminAndSubAdmin) {
      if (getAdminAndSubAdmin.customerFcmToken !== undefined) {
        fcmToken.push(getAdminAndSubAdmin.customerFcmToken);
      }
      data = await notificationModel.create({
        title: req.body.title,
        message: req.body.message,
        // icon: String,
        seen: false,
        date: new Date(),
        userId: getAdminAndSubAdmin._id,
        userType: "USER",
      });
    }
    let message = {
      notification: {
        title: req.body.title,
        body: req.body.message,
      },
      tokens: fcmToken,
    };
    if (fcmToken.length > 0) {
      sendPushNotification(message);
    }
    return res.status(200).send({
      success: true,
      message: "Notification Send Successfully..",
      data,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.seenCount = async (req, res) => {
  try {
    let obj = {};
    if (!req.query.userType) {
      return res.status(400).json({
        success: false,
        message: "userType Is required",
      });
    }
    obj.userId = req.params.userId;
    obj.userType = req.query.userType;
    obj.seen = false;
    let check = await notificationModel.find(obj);
    return res.status(200).json({
      success: true,
      message: "Notification Fatch Successfully...",
      count: check.length,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.sendNotificationByCancled = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;

    const order = await orderModel.findById(orderId).populate("userId");

    // Find admins and sub-admins with FCM tokens
    const adminSubAdminFilter = {
      userType: {
        $in: [userType.admin, userType.subAdmin],
      },
    };

    const adminSubAdminFields = ["adminFcmToken", "subAdminFcmToken"];
    const data = await userModel.find(adminSubAdminFilter).select("userType");
    const getAdminAndSubAdmin = await userModel
      .find(adminSubAdminFilter)
      .select(adminSubAdminFields.join(" "));
    console.log(data);
    const fcmToken = getAdminAndSubAdmin
      .map((user) => adminSubAdminFields.map((field) => user[field]))
      .flat()
      .filter((token) => token !== undefined && token !== null);

    const notifications = data.map((user) => {
      const title = "well marts";
      const message = `This user ${order.userId?.fullName} cancled order`;
      return {
        title,
        message,
        seen: false,
        date: new Date(),
        userId: user._id,
        orderId: order._id,
        // userType:
        //   user.userType == userType.admin ? userType.admin : userType.subAdmin,
      };
    });
    // Log FCM tokens and send push notifications
    // console.log("fcmToken", fcmToken);
    const message1 = {
      notification: {
        title: "Well Marts",
        body: `This user ${order.userId?.fullName} cancled order`,
      },
      data: {
        orderId: `${order._id}`,
      },
      tokens: fcmToken,
    };
    if (fcmToken.length > 0) {
      sendPushNotification(message1);
    }
    console.log(notifications);

    // Insert notifications into the database (assuming a bulk insert method)
    await notificationModel.insertMany(notifications);

    next();
  } catch (error) {
    // console.error("Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.sendNotificationByReturnRequest = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;

    const order = await orderModel.findById(orderId).populate("userId");

    // Find admins and sub-admins with FCM tokens
    const adminSubAdminFilter = {
      userType: {
        $in: [userType.admin, userType.subAdmin],
      },
    };

    const adminSubAdminFields = ["adminFcmToken", "subAdminFcmToken"];
    const data = await userModel.find(adminSubAdminFilter).select("userType");
    const getAdminAndSubAdmin = await userModel
      .find(adminSubAdminFilter)
      .select(adminSubAdminFields.join(" "));

    const fcmToken = getAdminAndSubAdmin
      .map((user) => adminSubAdminFields.map((field) => user[field]))
      .flat()
      .filter((token) => token !== undefined && token !== null);

    const notifications = data.map((user) => {
      const title = "well marts";
      const message = `This user ${order.userId?.fullName} ReturnRequest for this order`;
      return {
        title,
        message,
        seen: false,
        date: new Date(),
        userId: user._id,
        orderId: order._id,
        userType:
          user.userType == userType.admin ? userType.admin : userType.subAdmin,
      };
    });

    // Log FCM tokens and send push notifications
    // console.log("fcmToken", fcmToken);
    const message1 = {
      notification: {
        title: "Well Marts",
        body: `This user ${order.userId?.fullName} ReturnRequest for this order`,
      },
      data: {
        orderId: `${order._id}`,
      },
      tokens: fcmToken,
    };
    if (fcmToken.length > 0) {
      sendPushNotification(message1);
    }

    await notificationModel.insertMany(notifications);

    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.sendNotificationByAdminUpdateStatus = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;

    const order = await orderModel.findById(orderId).populate("userId");

    let fcmToken = [];
    if (
      order.userId?.userFcmToken !== null &&
      order.userId?.userFcmToken !== undefined
    ) {
      fcmToken.push(order.userId.userFcmToken);
    }

    const title = "well marts";
    const message = `somthing change in your order status`;
    await notificationModel.create({
      title,
      message,
      seen: false,
      date: new Date(),
      userId: order?.userId._id,
      orderId: order._id,
      userType: userType.user,
    });

    const message1 = {
      notification: {
        title: "Well Marts",
        body: `somthing change in your order status`,
      },
      data: {
        orderId: `${order._id}`,
      },
      tokens: fcmToken,
    };
    if (fcmToken.length > 0) {
      sendPushNotification(message1);
    }
    next();
  } catch (error) {
    // console.error("Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.sendNotificationCreateOrder = async (orders) => {
  const orderId = orders;

  const order = await orderModel.findById(orderId).populate("userId");

  // Find admins and sub-admins with FCM tokens
  const adminSubAdminFilter = {
    userType: {
      $in: [userType.admin, userType.subAdmin],
    },
  };

  const adminSubAdminFields = ["adminFcmToken", "subAdminFcmToken"];
  const data = await userModel.find(adminSubAdminFilter).select("userType");
  const getAdminAndSubAdmin = await userModel
    .find(adminSubAdminFilter)
    .select(adminSubAdminFields.join(" "));

  const fcmToken = getAdminAndSubAdmin
    .map((user) => adminSubAdminFields.map((field) => user[field]))
    .flat()
    .filter((token) => token !== undefined && token !== null);

  const notifications = data.map((user) => {
    const title = "well marts";
    const message = `this user is ${order?.userId?.fullName} successfully Create order`;
    return {
      title,
      message,
      seen: false,
      date: new Date(),
      userId: user._id,
      orderId: order._id,
      userType:
        user.userType == userType.admin ? userType.admin : userType.subAdmin,
    };
  });

  // Log FCM tokens and send push notifications
  // console.log("fcmToken", fcmToken);
  const message1 = {
    notification: {
      title: "Well Marts",
      body: `this user is ${order?.userId?.fullName} successfully Create order`,
    },
    data: {
      orderId: `${order._id}`,
    },
    tokens: fcmToken,
  };
  if (fcmToken.length > 0) {
    sendPushNotification(message1);
  }

  // Insert notifications into the database (assuming a bulk insert method)
  await notificationModel.insertMany(notifications);
};
