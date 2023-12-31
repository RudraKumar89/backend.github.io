const Company = require("../Model/companyModel")
const {
  deleteFileFromObjectStorage,
} = require("../Middleware/multerMiddleware");


// =================== Company Update ====================== ||

exports.updateCompany = async function (req, res) {
    try {
      
      const { banner, header_logo, footer_logo, fav_icon, loader } = req.files;
      const {
        site_name,
        footer_description,
        footer_about,
        email,
        phone,
        facebook,
        instagram,
        linkedin,
        twitter,
        youtube,
        whastapp,
        map,
        address,
        description,
        seo_keyword,
        seo_description,
        term_condition,
        about_us,
        privacy_policy,
        return_policy,
        theme_color,
        font_Style,
        header_link,
        footer_link,
		  support_policy,
        gst
      } = req.body;
  
      const mainCompany = await Company.findOne();
      if (loader) {
           await deleteFileFromObjectStorage(mainCompany.loader)
      }
      if (fav_icon && mainCompany.fav_icon) {
          await deleteFileFromObjectStorage(mainCompany.fav_icon);
      }
      if (banner && mainCompany.banner) {
         await deleteFileFromObjectStorage(mainCompany.banner)
      }
      if (header_logo && mainCompany.header_logo) {
         await deleteFileFromObjectStorage(mainCompany.header_logo);
      }
      if (footer_logo && mainCompany.footer_logo) {
          await deleteFileFromObjectStorage(mainCompany.footer_logo);
      }
      if (mainCompany) {
        Company.findOneAndUpdate(
          { _id: mainCompany._id },
          {
            $set: {
              banner: banner ? banner[0].key : mainCompany.banner,
              header_logo: header_logo
                ? header_logo[0].key
                : mainCompany.header_logo,
              footer_logo: footer_logo
                ? footer_logo[0].key
                : mainCompany.footer_logo,
              fav_icon: fav_icon ? fav_icon[0].key : mainCompany.fav_icon,
              loader: loader ? loader[0].key : mainCompany.loader,
              site_name,
              footer_description,
              footer_about,
              email,
              phone,
              facebook,
              instagram,
              linkedin,
              twitter,
              youtube,
              whastapp,
              map,
              address,
              description,
              term_condition,
              privacy_policy,
              return_policy,
              about_us,
              support_policy,
              gst
            },
          },
          { new: true }
        )
          .then((data) => {
            return res.status(200).send({
              success: true,
              message: "Company Updated Successfully",
              data: data,
            });
          })
          .catch((err) => {
            return res.status(400).send({
              success: false,
              message: err.message,
            });
          });
      } else {
        DataBase.create({ site_name: "Company Name" });
      }
    } catch (error) {
      return res.status(500).send({ success: false, message: error.message });
    }
  };
  
// =================== Company get ====================== ||

exports.getCompany = async(req,res)=>{
  const mainCompany = await Company.findOne();
  if(!mainCompany){
    return res.status(400).json({
      success:false,
      message:"Company Not Found"
    })
  }
  return res.status(200).json({
    success:true,
    meassage:"Company Is Fatch Successfully...",
    data: mainCompany
  })
}

// =================== Company get ====================== ||

exports.getCompanyByAdmin = async(req,res)=>{
  const mainCompany = await Company.findOne();
  if(!mainCompany){
    return res.status(400).json({
      success:false,
      message:"Company Not Found"
    })
  }
  return res.status(200).json({
    success:true,
    meassage:"Company Is Fatch Successfully...",
    data: mainCompany
  })
}
