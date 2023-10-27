const cartModel = require("../Model/cartModel");

function isDateInRange(startDate, endDate) {
  const currentDate = new Date();
  startDate = new Date(startDate);
  endDate = new Date(endDate);
  return startDate <= currentDate && endDate >= currentDate && startDate.getFullYear() === currentDate.getFullYear();
}

exports.bill = async (req, res, next) => {
  const { addressId, type } = req.query;
  if (!type || (type !== "ADDTOCART" && type !== "BUYNOW")) {
    return res.status(400).send({ success: false, message: "Invalid type" });
  }

  let newData = await cartModel.find({ userId: req.params.userId, type: type }).populate("productId membershipId");
  
  if (!newData.length) {
    return res.status(404).send({ success: true, message: "Your Cart Is Empty" });
  }

  // Update newData using forEach
  newData.forEach(async (elm) => {
    // Update cartModel data
  });

  // Rest of your code...
};
