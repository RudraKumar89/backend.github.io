const mongoose = require("mongoose");
const { orderStatus } = require("../helper/orderStatus");
const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userModel",
    },
    product: [
      {
        membershipId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "memberShipModel",
        },
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "productModel",
        },
        affiliateUserId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "affiliatemodel",
        },
        actualPrice: Number,
        price: Number,
        quantity: Number,
        tax: Number,
        productDiscount: Number,
        status: {
          type: String,
          enum: Object.values(orderStatus),
          default: orderStatus.pending,
        },
        discount: Number,
        priceVariantId: String,
      },
    ],
    address: {},
    totalPrice: Number,
    discount: Number,
    payableAmount: Number,
    shippingCharges: Number,
    couponId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "couponModel",
    },
    couponCode: String,
    shippingChargesId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "shipingModel",
    },
    paymentStatus: ["COD", "ONLINE"],
    // status:{ type:String, enum:Object.values(orderStatus),default:orderStatus.pending},
    transactionId: {
      type: String,
      // ref :"transactionModel"
    },
    awb: String,
    courierService: {
      type: String,
      enum: ["SHIPROCKET", "DELIVERY", "OTHER"],
      default: "SHIPROCKET",
    },
    courierTrackingId: String,
    shipment_track_activities: [
      {
        date: String,
        status: String,
        activity: String,
        location: String,
        sr_status: String,
        sr_status_label: String,
      },
    ],
    serialNumber: Number,
    invoice: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("orderModel", orderSchema);
