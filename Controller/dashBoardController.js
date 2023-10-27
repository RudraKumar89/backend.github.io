const orderModel = require("../Model/orderModel");
const userModel = require("../Model/userModel");
const productModel = require("../Model/productModel");

exports.dashBoard = async function (req, res) {
    try {
      const sevenMonthsAgo = new Date();
      sevenMonthsAgo.setMonth(sevenMonthsAgo.getMonth() - 7);
      const currentDate = new Date();
  
      let currentMonth = currentDate.getMonth();
      let currentYear = currentDate.getFullYear();
  
      const orderForLastSevenMonth = await orderModel.find({
        createdAt: { $gte: sevenMonthsAgo, $lte: currentDate },
      });
  
      const orderCountsByMonth = {};
      for (let i = 0; i < 7; i++) {
        const monthYear = `${currentMonth + 1}-${currentYear}`;
        orderCountsByMonth[monthYear] = 0;
        if (currentMonth === 0) {
          currentMonth = 11;
          currentYear--;
        } else {
          currentMonth--;
        }
      }
  
      orderForLastSevenMonth.forEach((order) => {
        const monthYear = `${
          order.createdAt.getMonth() + 1
        }-${order.createdAt.getFullYear()}`;
  
        if (!orderCountsByMonth[monthYear]) {
          orderCountsByMonth[monthYear] = 0;
        }
        orderCountsByMonth[monthYear]++;
      });
  
      let orderCount = {};
      for (const monthYear in orderCountsByMonth) {
        const month = parseInt(monthYear.split("-")[0]);
        const year = parseInt(monthYear.split("-")[1]);
  
        const monthName = new Date(year, month - 1).toLocaleString("en-US", {
          month: "long",
        });
        if (!orderCount[monthName]) {
          orderCount[monthName] = 0;
        }
        orderCount[monthName] += orderCountsByMonth[monthYear];
      }
  
      let sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(currentDate.getDate() + 1 - 7);
  
      const daysOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
  
      const orderCounts = [];
  
      for (let i = 0; i < 7; i++) {
        const currentDay = new Date(sevenDaysAgo);
        currentDay.setDate(sevenDaysAgo.getDate() + i);
  
        const count = await orderModel.countDocuments({
          createdAt: {
            $gte: new Date(
              currentDay.getFullYear(),
              currentDay.getMonth(),
              currentDay.getDate()
            ),
            $lt: new Date(
              currentDay.getFullYear(),
              currentDay.getMonth(),
              currentDay.getDate() + 1
            ),
          },
        });
  
        orderCounts.push({
          dayOfWeek: daysOfWeek[currentDay.getDay()],
          count: count || 0,
        });
      }
  
      const result = orderCounts.reduce((acc, { dayOfWeek, count }) => {
        acc[dayOfWeek.toLowerCase()] = count;
        return acc;
      }, {});
      let getAllProduct = await productModel.countDocuments();
      let latestProduct = await productModel
        .find()
        .sort({ createdAt: -1 })
        .limit(5);
      const getAllOrder = await orderModel.countDocuments();
      const latestOrders = await orderModel.find().sort({ createdAt: -1 }).limit(5);
  
      let getAllUser = await userModel.find();
  
      let totalUser = getAllUser.length;
      let todayUser = 0;
  
      const firstDay = new Date().setHours(1);
      const lastDay = new Date().setHours(24);
  
      getAllUser.map((x) => {
        if (x.createdAt >= firstDay && x.createdAt <= lastDay) {
          todayUser++;
        }
      });
      let obj = {
        lastSevenMonth: orderCount,
        lastSevendays: result,
        totalProduct: getAllProduct,
        totalOrders: getAllOrder,
        totalUser: totalUser,
        todayUser: todayUser,
      };
      return res.status(200).send({
        success: true,
        message: "fetched data successfully",
        data: obj,
        latestProduct,
        latestOrders,
      });
    } catch (error) {
      return res.status(500).send({ success: false, message: error.message });
    }
  };