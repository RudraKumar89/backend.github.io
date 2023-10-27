const cartModel = require("../Model/cartModel");
const couponModel = require("../Model/couponModel");
const addressModel = require("../Model/addressModel");
const orderModel = require("../Model/orderModel");
const shippingModel = require("../Model/shippingCharges");
const { local } = require("../helper/shipping");

function isDateInRange(startDate, endDate) {
  let parsedStartDate = new Date(startDate);
  let parsedEndDate = new Date(endDate);
  let currentDate = new Date();
  if (
    parsedStartDate <= currentDate &&
    parsedEndDate >= currentDate &&
    parsedStartDate.getFullYear() === currentDate.getFullYear()
  ) {
    return true;
  } else {
    return false;
  }
}

exports.bill = async (req, res, next) => {
  let { addressId } = req.query;
  let totalCartPrice = 0;
  let totalPrice = 0;
  let price = 0;
  let discount = 0;
  let productDiscount = 0;
  let applyTax = 0;
  let shippingCharge = 0;
  let shippingChargesId;
  let addressData;
  let order;
  let check = false;
  let arr = [];

  // Cart Find
  let newData = await cartModel
    .find({ userId: req.params.userId })
    .populate("productId");

  // if (!newData.length) {
  //   return res
  //     .status(404)
  //     .send({ success: true, message: "Your Cart Is Empty" });
  // }

  // Coupon Find
  let couponData = await couponModel.findOne({
    couponCode: req.query.couponCode,
  });
  // let membershipId;
  // cart product price is update
  for (let i = 0; i < newData.length; i++) {
    let a = {};
    if (newData[i]?.priceVariantId) {
      newData[i]?.productId?.priceVariant?.find(async (e) => {
        a = {
          $set: {
            price: e?.afterTaxValue * newData[i]?.quantity,
            actualPrice: e?.afterTaxValue,
          },
        };
      });
    }
    updatedData = await cartModel
      .findOneAndUpdate({ _id: newData[i]._id }, a, { new: true })
      .populate("productId")
      .select("-userId");
    arr.push(updatedData);
    // membershipId = newData[i]?.membershipId;
  }

  // coupon is valied are not by Date
  const isInRange = isDateInRange(couponData?.startDate, couponData?.endDate);

  // Coupon Check oneTimeUse are not
  if (couponData?.oneTimeUse) {
    order = await orderModel.findOne({
      userId: req.params.userId,
      couponId: couponData?._id,
    });
  }

  // address find
  if (addressId) {
    addressData = await addressModel
      .findOne({ _id: addressId })
      .select("-createdAt -updatedAt -disable -__v");

    if (!addressData) {
      return res
        .status(400)
        .send({ success: true, message: "address not found" });
    }

    //  shipping Charge Calculate
    if (addressData) {
      let checkCity = local.localCity.some(
        (city) => city.toLowerCase() === addressData?.cityName.toLowerCase()
      );
      let checkState = local.localState.some(
        (state) => state.toLowerCase() === addressData?.stateName.toLowerCase()
      );
      if (checkCity) {
        let shipping = await shippingModel.findOne({ name: "LOCAL" });
        shippingCharge = shipping.charge;
        shippingChargesId = shipping._id;
      } else if (checkState) {
        let shipping = await shippingModel.findOne({ name: "ZONAL" });
        shippingCharge = shipping.charge;
        shippingChargesId = shipping._id;
      } else {
        let shipping = await shippingModel.findOne({ name: "NATIONAL" });
        shippingCharge = shipping.charge;
        shippingChargesId = shipping._id;
      }
    }
  }

  //
  for (let i = 0; i < arr.length; i++) {
    totalPrice += arr[i].price;
    productDiscount +=
      ((arr[i].productId?.mrp * arr[i].productId?.priceDiscount) / 100) *
      arr[i].quantity;

    applyTax +=
      (arr[i].productId?.afterTaxValue - arr[i].productId?.beforeTaxValue) *
      arr[i].quantity;

    arr[i]._doc.discount = parseInt(totalCartPrice);
    let discountCalculate = arr[i].price * (couponData?.discount / 100);
    let percent = couponData?.maximumDiscount * (100 / discount);
    let additionalDiscount = discountCalculate * (percent / 100);
    if (
      req.query.couponCode &&
      couponData &&
      couponData?.categoryId.includes(arr[i].productId?.categoryId)
    ) {
      check = true;
      arr[i]._doc.discount =
        couponData.maximumDiscount < discount
          ? Number(additionalDiscount.toFixed(2))
          : parseInt(arr[i].price * (couponData.discount / 100));
      price += arr[i].price; //
      discount = parseInt(price * (couponData.discount / 100));
    }
  }

  req.address = addressData;
  req.shippingChargesId = shippingChargesId;
  req.cart = arr;
  req.totalPayable = totalPrice + shippingCharge - 0;
  req.shippingCharge = shippingCharge;
  req.totalPrice = totalPrice;
  req.discount = 0;
  req.productDiscount = productDiscount;
  req.couponData = couponData;
  req.tax = applyTax;
  // req.membershipId = membershipId;

  if (order) {
    req.message = `You Are Already Use This Coupon`;
    next();
    return;
  }

  //  coupon is not come by query
  if (!req.query.couponCode) {
    next();
    return;
  }

  // minimumOrder Value
  if (
    req.query.couponCode &&
    couponData &&
    couponData?.minimumOrderValue > totalPrice
  ) {
    req.message = `minimumOrder Value is ${couponData?.minimumOrderValue}`;
    next();
    return;
  }

  // CouponCode Not Found
  if (!couponData) {
    req.message = "CouponCode Not Found";
    next();
    return;
  }

  if (couponData && couponData?.disable == true) {
    req.message = "Coupon Is Disable...";
    next();
    return;
  }

  if (!isInRange) {
    req.message = "Coupon Is Expired";
    next();
    return;
  }

  if (couponData && couponData.couponQuantity == 0) {
    req.message = `coupon Quantity is ${couponData.couponQuantity}`;
    next();
    return;
  }

  if (!check) {
    req.message = "Coupon Is Not Valied For This Product";
    next();
    return;
  }

  //  Coupon Apply
  if (
    (couponData && couponData.maximumDiscount < discount) ||
    couponData.maximumDiscount >= discount
  ) {
    req.totalPayable =
      totalPrice +
      shippingCharge -
      (couponData.maximumDiscount < discount
        ? couponData.maximumDiscount
        : discount);
    req.discount =
      couponData.maximumDiscount < discount
        ? couponData.maximumDiscount
        : discount;
    req.couponId = couponData;
    req.message = `coupon Apply`;
    next();
    return;
  }
};
