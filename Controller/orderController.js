const orderModel = require("../Model/orderModel");
const { orderStatus } = require("../helper/orderStatus");
const productModel = require("../Model/productModel");
const cartModel = require("../Model/cartModel");
const addressModel = require("../Model/addressModel");
const userModel = require("../Model/userModel");
const { invoice } = require("../Middleware/invoice");
const pincodeModel = require("../Model/pincodeModel");
const jwt = require("jsonwebtoken");
const {
  sendNotificationCreateOrder,
} = require("../Controller/notificationController");

// =============== Create ================= ||

exports.createOrder = async function (req, res) {
  try {
    const getUserById = req.getUserById;
    const {
      paymentStatus,
      name,
      mobile,
      phoneNumber,
      houseNumber,
      pincode,
      landmark,
      area,
      hashkey,
    } = req.body;
    const couponId = req.couponId;
    let check = await userModel.findOne({ _id: req.params.userId });

    if (check && !req.query.addressId) {
      return res
        .status(400)
        .send({ success: false, message: "AddressId Is Required" });
    }
    let addressData;
    let user;
    let userData;
    if (!req.query.addressId) {
      if (!name) {
        return res
          .status(400)
          .send({ success: false, message: "name is required" });
      }
      if (!mobile) {
        return res
          .status(400)
          .send({ success: false, message: "Mobile is required" });
      }
      if (!hashkey) {
        return res
          .status(400)
          .send({ success: false, message: "hashkey is required" });
      }
      if (process.env.hash_Key.toString() !== hashkey) {
        return res
          .status(400)
          .send({ success: false, message: "hashKey is not valid" });
      }
      if (!houseNumber) {
        return res
          .status(400)
          .send({ success: false, message: "houseNumber is required" });
      }
      if (!pincode) {
        return res
          .status(400)
          .send({ success: false, message: "pincode is required" });
      }
      if (!landmark) {
        return res
          .status(400)
          .send({ success: false, message: "landmark is required" });
      }
      if (!area) {
        return res
          .status(400)
          .send({ success: false, message: "area is required" });
      }
      let pinCode = await pincodeModel.findOne({ pincode: pincode });
      if (!pinCode) {
        return res
          .status(400)
          .send({ success: false, message: "Provide Valid Pincode" });
      }
      userData = await userModel.findOne({ phoneNumber: phoneNumber });
      // console.log(userData);
      if (!userData) {
        user = await userModel.create({
          fullName: name,
          phoneNumber: phoneNumber,
        });
      }
      addressData = await addressModel.create({
        name: name,
        mobile: mobile,
        houseNumber: houseNumber,
        userId: userData ? userData._id : user._id,
        pincodeId: pinCode._id,
        cityName: pinCode.cityName,
        stateName: pinCode.stateName,
        pincode: pincode,
        landmark: landmark,
        area: area,
      });
    }

    if (!paymentStatus) {
      return res
        .status(400)
        .send({ success: false, message: "paymentStatus required" });
    }
    if (paymentStatus != "COD" && paymentStatus != "ONLINE") {
      return res.status(400).send({
        success: false,
        message: "payment status must be COD and ONLINE",
      });
    }
    let productId;
    for (let i = 0; i < req.cart.length; i++) {
      let variantId = 0;
      if (req.query.type == "BUYNOW") {
        productId = req.cart[i].productId;
      }
      if (req.cart[i].priceVariantId) {
        variantId = req.cart[i].priceVariantId;

        let a = req.cart[i].productId;
        let b = a.priceVariant.find((el) => el._id.toString() === variantId);
        if (req.cart[i]?.quantity > b?.stock) {
          return res
            .status(404)
            .send({
              success: false,
              message:
                "Out of Stock Please Deacrease Cart Quantity Or Remove From Cart",
              data: req.cart[i],
            });
        }
        await productModel.findOneAndUpdate(
          { "priceVariant._id": variantId },
          {
            $set: {
              "priceVariant.$.stock": b.stock - req.cart[i]?.quantity,
              "priceVariant.$.sold": b.sold + req.cart[i]?.quantity,
            },
          }
        );
      } else {
        await productModel.findByIdAndUpdate(
          {
            _id: req.cart[i].productId?._id,
          },
          {
            $set: {
              stock: req.cart[i].productId?.stock - req.cart[i]?.quantity,
              sold: req.cart[i].productId?.sold + req.cart[i]?.quantity,
            },
          }
        );
      }
      if (paymentStatus == "COD") {
        req.cart[i]._doc.status = orderStatus.ordered;
      } else {
        req.cart[i]._doc.status = orderStatus.pending;
      }
    }

    // console.log(req.address,"ffiuritr");
    let countSerial = await orderModel.countDocuments();
    const createOrder = await orderModel.create({
      userId: check ? check._id : addressData.userId,
      product: req.cart,
      address: req.query.addressId ? req.address : addressData,
      totalPrice: req.totalPrice,
      discount: req.discount,
      couponId: couponId?._id,
      couponCode: couponId?.couponCode,
      shippingCharges: req.shippingCharge,
      shippingChargesId: req.shippingChargesId,
      payableAmount: req.totalPayable,
      paymentStatus: paymentStatus,
      serialNumber: countSerial + 1,
    });
    sendNotificationCreateOrder(createOrder?._id);
    if (req.query.type == "BUYNOW" && productId) {
      await cartModel.deleteOne({
        userId: check ? check._id : req.params.userId,
        productId: productId,
        type: "ADDTOCART",
      });
    }
    await cartModel.deleteMany({
      userId: check ? check._id : req.params.userId,
      type: req.query.type,
    });
    let userdata;
    if (userData || user) {
      const generate = await jwt.sign(
        { User: userData ? userData?._id : user?._id },
        "SECRETEKEY",
        {
          expiresIn: "7d",
        }
      );
      userdata = userData ? userData : user;
      userdata._doc.token = generate;
    }
    return res.status(200).send({
      success: true,
      message: "order placed successfully",
      data: createOrder,
      userData: userdata,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

// =============== Get_Order_By_OrderId ================= ||

exports.getOrderByOrderId = async function (req, res) {
  try {
    const getOrderByOrderId = req.getOrderByOrderId;
    return res.status(200).send({
      success: true,
      messsage: "Successfully Fetchhed Order",
      data: req.orderUpdate ? req.orderUpdate : getOrderByOrderId,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

// =============== Get_All_Order_By_UserId ================= ||

exports.getAllOrderByUserId = async function (req, res) {
  try {
    const getAllOrderByUserId = await orderModel
      .find({
        userId: req.getUserById._id,
      })
      .populate({ path: "product", populate: { path: "productId" } })
      .populate("userId")
      .sort({ createdAt: -1 });
    if (!getAllOrderByUserId.length) {
      return res.status(404).send({
        success: false,
        message: "You Don't Have Any Order",
        data: [],
      });
    }
    return res.status(200).send({
      success: true,
      message: "Successfully Fetched All Orders ",
      data: getAllOrderByUserId,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

// =============== Update_TransactionId ================= ||

exports.updateTransactionId = async function (req, res) {
  try {
    const { transactionId } = req.body;
    if (!transactionId) {
      return res
        .status(400)
        .send({ success: false, message: "TransactionId Is Required" });
    }
    let data = await orderModel.findByIdAndUpdate(
      {
        _id: req.getOrderByOrderId._id,
      },
      {
        $set: {
          "product.$[].status": orderStatus.ordered,
          transactionId: transactionId,
        },
      },
      {
        new: true,
      }
    );
    return res.status(200).send({
      success: true,
      message: "TransationId And Status Update Successfully",
      data: data,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

// =============== Cancel_Status_Update ================= ||

exports.cancelledStatus = async function (req, res) {
  try {
    let check = false;
    req.getOrderByOrderId?.product?.map((o) => {
      if (
        o.status === orderStatus.accepted ||
        o.status === orderStatus.ordered ||
        o.status === orderStatus.pending
      ) {
        check = true;
      }
    });
    if (!check) {
      return res.status(400).json({
        success: false,
        message: "You Are Not Cancle This Order..",
      });
    }
    let data = await orderModel.findByIdAndUpdate(
      {
        _id: req.getOrderByOrderId._id,
      },
      {
        $set: {
          "product.$[].status": orderStatus.cancelled,
        },
      },
      {
        new: true,
      }
    );
    return res.status(200).send({
      success: true,
      message: "Status Update Successfully",
      data: data,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

// =============== Return_Request_Status_Update ================= ||

exports.returnRequestStatus = async function (req, res) {
  try {
    let check = await orderModel.findOne({
      _id: req.getOrderByOrderId._id,
      "product.productId": req.params.productId,
      "product.status": orderStatus.delivered,
    });
    if (!check) {
      return res.status(400).json({
        success: false,
        message: "This Product Is Not Returned On This Time",
      });
    }
    let data = await orderModel.findOneAndUpdate(
      {
        _id: req.getOrderByOrderId._id,
        "product.productId": req.params.productId,
      },
      {
        $set: {
          "product.$.status": orderStatus.returnRequest,
        },
      },
      {
        new: true,
      }
    );
    return res.status(200).send({
      success: true,
      message: "Status Update Successfully",
      data: data,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

// =============== All_Product_Status_Update ================= ||

exports.AllProductStatusUpdate = async function (req, res) {
  try {
    if (!req.body.status) {
      return res.status(400).json({
        success: false,
        message: "Status Is Required...",
      });
    }
    if (
      req.body.status !== orderStatus.accepted &&
      req.body.status !== orderStatus.cancelled &&
      req.body.status !== orderStatus.delivered &&
      req.body.status !== orderStatus.outOfDelivery &&
      req.body.status !== orderStatus.returned &&
      req.body.status !== orderStatus.shipped
    ) {
      return res.status(400).json({
        success: false,
        message: "Status Is Not Valid...",
      });
    }
    if (req.body.status === orderStatus.shipped && !req.body.awb) {
      return res.status(400).json({
        success: false,
        message: "awb is requred..",
      });
    }
    let data = await orderModel.findByIdAndUpdate(
      {
        _id: req.getOrderByOrderId._id,
      },
      {
        $set: {
          "product.$[].status": req.body.status,
          awb: req.body.awb,
        },
      },
      {
        new: true,
      }
    );
    if (req.body.status == orderStatus.delivered) {
      let data = await orderModel
        .findById(req.params.orderId)
        .populate("shippingChargesId")
        .populate({
          path: "product",
          populate: { path: "productId", populate: { path: "taxId" } },
        });
      let code = await invoice(data);
    }
    return res.status(200).send({
      success: true,
      message: "Status Update Successfully",
      data: data,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

// =============== Single_Product_Status_Update ================= ||

exports.singleStatus = async function (req, res) {
  try {
    if (!req.body.status) {
      return res.status(400).json({
        success: false,
        message: "Status Is Required...",
      });
    }
    if (
      req.body.status !== orderStatus.accepted &&
      req.body.status !== orderStatus.cancelled &&
      req.body.status !== orderStatus.delivered &&
      req.body.status !== orderStatus.outOfDelivery &&
      req.body.status !== orderStatus.returned &&
      req.body.status !== orderStatus.shipped
    ) {
      return res.status(400).json({
        success: false,
        message: "Status Is Not Valid...",
      });
    }
    if (req.body.status === orderStatus.shipped && !req.body.awb) {
      return res.status(400).json({
        success: false,
        message: "awb is requred..",
      });
    }
    let data = await orderModel
      .findOneAndUpdate(
        {
          _id: req.getOrderByOrderId._id,
          "product.productId": req.params.productId,
        },
        {
          $set: {
            "product.$.status": req.body.status,
            awb: req.body.awb,
          },
        },
        {
          new: true,
        }
      )
      .populate([{ path: "product.productId" }]);
    if (req.body.status == orderStatus.returned) {
      for (let i = 0; i < data.product.length; i++) {
        await productModel.findByIdAndUpdate(
          {
            _id: data.product[i].productId._id,
          },
          {
            $set: {
              stock: data.product[i].productId.stock + data.product[i].quantity,
              sold: data.product[i].productId.sold - data.product[i].quantity,
            },
          }
        );
      }
    }
    return res.status(200).send({
      success: true,
      message: "Status Update Successfully",
      data: data,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

exports.orderFilter = async (req, res) => {
  let {
    orderId,
    userId,
    shippingChargeId,
    paymentStatus,
    fullName,
    cityName,
    stateName,
    pincode,
    status,
  } = req.query;
  let obj = {};
  let obj2 = {};
  let obj3 = {};
  let obj4 = {};
  let arr = [];

  if (req.filterQuery) {
    obj.createdAt = req.filterQuery;
  }
  if (orderId) {
    obj._id = orderId;
  }
  if (userId) {
    obj.userId = userId;
  }
  if (shippingChargeId) {
    obj.shippingChargesId = shippingChargeId;
  }
  if (paymentStatus) {
    if (paymentStatus !== "COD" && paymentStatus !== "ONLINE") {
      return res.status(400).send({
        success: false,
        message: "COD and ONLINE are the valid payment status",
      });
    } else {
      obj.paymentStatus = paymentStatus;
    }
  }

  if (status) {
    if (
      status !== "PENDING" &&
      status !== "ORDERED" &&
      status !== "ACCEPTED" &&
      status !== "SHIPPED" &&
      status !== "OUTOFDELIVERY" &&
      status !== "DELIVERED" &&
      status !== "RETURNED" &&
      status !== "RETURNREQUEST" &&
      status !== "CANCELLED"
    ) {
      return res
        .status(400)
        .send({ success: false, message: "please provide valid status" });
    } else {
      obj = { product: { $elemMatch: { status: status } } };
    }
  }

  if (cityName) {
    obj3 = { "address.cityName": new RegExp(`^${cityName}`, "i") };
  }

  let obj5 = {};

  if (stateName) {
    obj5 = { "address.stateName": new RegExp(`^${stateName}`, "i") };
  }

  let obj6 = {};

  if (pincode) {
    pincode = parseInt(pincode);
    obj6 = { "address.pincode": pincode };
  }

  if (Object.keys(obj).length > 0) {
    arr.push(obj);
  }

  if (Object.keys(obj3).length > 0) {
    arr.push(obj3);
  }
  if (Object.keys(obj5).length > 0) {
    arr.push(obj5);
  }
  if (Object.keys(obj6).length > 0) {
    arr.push(obj6);
  }

  if (arr.length > 0) {
    obj4 = { $and: arr };
  }

  obj2.createdAt = -1;
  let filterData = await orderModel
    .find(obj4)
    .sort(obj2)
    .populate({
      path: "userId",
      match: { fullName: { $in: fullName } },
    })
    .exec();

  return res.status(200).send({
    success: true,
    message: "Filter Apply Successfully",
    filterData: filterData,
  });
};

exports.generateInvoice = async (req, res) => {
  let data = await orderModel
    .findById(req.params.orderId)
    .populate("shippingChargesId")
    .populate({
      path: "product",
      populate: { path: "productId", populate: { path: "taxId" } },
    });
  let code = await invoice(data);
};
