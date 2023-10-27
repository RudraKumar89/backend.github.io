const express = require("express");
const http = require("http");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
let shipingModel = require("./Model/shippingCharges");
let taxModel = require("./Model/taxModel");
let Company = require("./Model/companyModel");
let user = require("./Model/userModel");
let categoryModel = require("./Model/categoryModel");
let bannerModel = require("./Model/bannerModel");
let homeCategoryModel = require("./Model/homeCategoryModel");
let singleBannerModel = require("./Model/singleBannerModel");
let reatModel = require("./Model/reatOfGoldModel");

const bcrypt = require("bcrypt");

const app = express();
require("dotenv").config();
const server = http.createServer(app);

app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
});
app.use(express.json());
mongoose.set("strictQuery", true);

// Set up the database connection
mongoose
  .connect("mongodb+srv://rudra:1234@cluster0.ynyguud.mongodb.net/Navdeep", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to database");
    getCount();
  })
  .catch((err) => {
    console.error(err);
  });

app.use("/uploads", express.static("uploads"));
app.use("/", express.static(__dirname + "/components"));

// Set up the route for the documents API

app.use("/api", require("./Routes/categoryRoute"));
// app.use("/api", require("./Routes/cartRoute"));
app.use("/api", require("./Routes/userRoute"));
app.use("/api", require("./Routes/productRoute"));
app.use("/api", require("./Routes/reviewRoute"));
app.use("/api", require("./Routes/wishlistRoute"));
app.use("/api", require("./Routes/shippingRoute"));
app.use("/api", require("./Routes/taxRoute"));
app.use("/api", require("./Routes/pincodeRoute"));
app.use("/api", require("./Routes/blogRoute"));
app.use("/api", require("./Routes/addressRoute"));
app.use("/api", require("./Routes/couponRoute"));
app.use("/api", require("./Routes/orderRoute"));
app.use("/api", require("./Routes/priceRangeRoute"));
app.use("/api", require("./Routes/filterRoute"));
app.use("/api", require("./Routes/contactUsRoute"));
app.use("/api", require("./Routes/companyRoute"));
app.use("/api", require("./Routes/notificationRoute"));
app.use("/api", require("./Routes/dashBoardRoute"));
app.use("/api", require("./Routes/bannerRoute"));
app.use("/api", require("./Routes/homeCategoryRoute"));
app.use("/api", require("./Routes/homePageRoute"));
app.use("/api", require("./Routes/faqRoute"));

app.use("/", (res, req) => req.json("Path Is Not Found..."));

// Start the server

server.listen(1111, () => {
  console.log(`Server running on port ${1111}`);
});

async function getCount() {
  try {
    // const count = await shipingModel.estimatedDocumentCount();
    const count2 = await taxModel.estimatedDocumentCount();
    const count3 = await Company.estimatedDocumentCount();
    const count4 = await user.estimatedDocumentCount();
    const count5 = await categoryModel.estimatedDocumentCount();
    const count6 = await bannerModel.estimatedDocumentCount();
    const count7 = await homeCategoryModel.estimatedDocumentCount();
    const count8 = await singleBannerModel.estimatedDocumentCount();
    const count9 = await reatModel.estimatedDocumentCount();
    if (count9 === 0) {
      console.log("create")
      reatModel.create({ reat: 56000 });
    }
    if (count3 === 0) {
      Company.create({ site_name: "company name" });
    }
    if (count5 === 0) {
      await categoryModel.create({
        icon: "uploads\\1697656678035-silver.png",
        name: "Silver",
      });
      await categoryModel.create({
        icon: "uploads\\1697656651365-gold.png",
        name: "Gold",
      });
    }
    if (count4 === 0) {
      let hash = bcrypt.hashSync("@navdeep", 10, (err) => {
        if (err) {
          return res.status(400).send({ success: true, message: err.message });
        }
      });
      await user.create({
        email: "navdeep@gmail.com",
        password: hash,
        userType: "ADMIN",
      });
    }
    // if (count === 0) {
    //   await shipingModel.create({ name: "NATIONAL", charge: 89 });
    //   await shipingModel.create({ name: "ZONAL", charge: 9 });
    //   await shipingModel.create({ name: "LOCAL", charge: 0 });
    // }
    if (count2 === 0) {
      await taxModel.create({ taxPercent: 18 });
      await taxModel.create({ taxPercent: 0 });
    }
    if (count6 === 0) {
      await bannerModel.create({
        banner: [
          "uploads\\1697651453145-woman-choosing-jewelry-jewelry-shop.jpg",
          "uploads\\1697651453267-shiny-gold-jewelry-symbol-wealth-generated-by-ai.jpg",
        ],
      });
    }
    if (count7 === 0) {
      await homeCategoryModel.create({
        title: "Jewellery Guides",
        product: [],
      });
      await homeCategoryModel.create({
        title: "Diamond Top Picks",
        product: [],
      });
      await homeCategoryModel.create({
        title: "Similar Search Items",
        product: [],
      });
      await homeCategoryModel.create({
        title: "Customer Favorites",
        product: [],
      });
      await homeCategoryModel.create({
        title: "Top Sellers",
        product: [],
      });
      await homeCategoryModel.create({
        title: "New For You!",
        product: [],
      });
    }
    if (count8 === 0) {
      await singleBannerModel.create({
        banner:
          "uploads\\1697651453267-shiny-gold-jewelry-symbol-wealth-generated-by-ai.jpg",
      });
      await singleBannerModel.create({
        banner:
          "uploads\\1697651453145-woman-choosing-jewelry-jewelry-shop.jpg",
      });
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
