const categoryModel = require('../Model/categoryModel')
const { discount } = require('../helper/discount')
const priceRangeModel = require('../Model/priceRangeModel')
const productModel = require('../Model/productModel')

exports.range = async (req, res) => {
  try {
  let priceRange = await priceRangeModel.find({ disable: false })
  let getAllCategorys = await categoryModel.find({ pCategory: null })
  for (let i = 0; i < getAllCategorys.length; i++) {
    const find = await categoryModel.find({
      pCategory: getAllCategorys[i]._id,
    });
    getAllCategorys[i]._doc.subCategory = find;
  }

  return res.status(200).send({
    success: true,
    message: "All Ranges Of Product",
    data:{
    price: priceRange,
    category: getAllCategorys,
    discount: discount
	}
  })
  } catch (error) {
    return res.status(500).send({success:false,message:error.message})
  }
}

exports.productFilter = async (req, res) => { 
  try {
   
    let { categoryId, brandId, priceRangeMin,priceRangeMax, discountMin, discountMax,name } = req.query
 
  let obj = {}
  let obj1
  let obj2 = {}
  let obj3
  let obj4 = {}
  let arr = []
  let page = req.query.page;
  const startIndex = page ? (page - 1) * 20 : 0

  if (categoryId) {
    obj.categoryId = categoryId
  }
  obj.disable=false
  if (name) {
    const nameOrDescriptionRegex = new RegExp(name, 'i');
    obj.$or = [{ name: nameOrDescriptionRegex }, { description: nameOrDescriptionRegex }];
  }
  if (brandId) {
    obj.brandId = brandId
  }
  if (priceRangeMin && priceRangeMax) {

    let minimum =typeof(priceRangeMin)==="object" ?  priceRangeMin.sort((b,a)=>b-a) : 0
    let maximum = typeof(priceRangeMax)==="object" ?  priceRangeMax.sort((a,b)=>a-b) : 0


    obj3 = {
      afterTaxValue: {
        $gte:typeof(priceRangeMin)==="object" ? minimum[0] : priceRangeMin ,
        $lte:  typeof(priceRangeMax)==="object" ? maximum[maximum.length - 1] : priceRangeMax
      },
    }
    arr.push(obj3)
  }



  if (discountMin && discountMax) {
    let discountMinimum =typeof(discountMin)==="object" ?  discountMin.sort((b,a)=>b-a) : 0
    let discountMaximum = typeof(discountMax)==="object" ? discountMax.sort((a,b)=>a-b) : 0
 

    obj1 = {
      priceDiscount: {
        $gte: discountMinimum ? discountMinimum[0] : discountMin ,
        $lte: discountMaximum ? discountMaximum[discountMaximum.length-1] : discountMax
      }
    }
    arr.push(obj1)
  }
  if (Object.keys(obj).length > 0) {
    arr.push(obj);
  }

  if (arr.length > 0) {
    obj4 = { $and: arr }
  }



  obj2.createdAt = -1
  let filterData = await productModel.find(obj4)
    .sort(obj2).skip(startIndex).limit(20)
    .populate("categoryId brandId")

  let length = await productModel.countDocuments(obj4)
  let count = Math.ceil(length / 20);
  console.log(length)
  return res.status(200).send({
    success: true,
    message: "Filter Apply Succesfully...",
    data: filterData,
    totalCount:length,
    page: count
  })
  } catch (error) {
    return res.status(500).send({success:false,message:error.message})
  }
};
