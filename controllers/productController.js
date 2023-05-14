const Product = require("../models/Product");
const asyncHandle = require("../middlewares/asyncHandle");
const sendResponse = require("../helpers/SendResponse");

const cloudinary = require("../config/cloudinary");

module.exports = {
  index: asyncHandle(async (req, res) => {
    // let deleted = req.query.deleted;
    let conditions = {
      // deleted: deleted,
    };

    if (req.query.category_id) {
      conditions.category = req.query.category_id;
    }

    if (req.query.product_name) {
      if (req.query.product_name.length > 2)
        conditions.product_name = new RegExp(req.query.product_name, "ig");
    }

    if (req.query.min_price) {
      if (!conditions.price) {
        conditions.price = {};
      }

      conditions.price.$gte = req.query.min_price;
    }

    if (req.query.max_price) {
      if (!conditions.price) {
        conditions.price = {};
      }

      conditions.price.$lte = req.query.max_price;
    }

    console.log(conditions);
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;
    const startIndex = (page - 1) * limit;
    const total = await Product.countDocuments(conditions);
    const totalPage = Math.ceil(total / limit);
    const pagination = {
      page,
      limit,
      total,
      totalPage,
    };

    const products = await Product.find(conditions)
      .populate("category")
      .sort("-updatedAt")
      .skip(startIndex)
      .limit(limit);
    // let pro= products.filter(v=> v.deleted!==1)

    return sendResponse(res, "Get list successfully.", products, pagination);
  }),

  getById: asyncHandle(async (req, res) => {
    const product = await Product.findById(req.params.id).populate("category");

    return sendResponse(res, "Show successfully.", product);
  }),

  create: asyncHandle(async (req, res) => {
    let { ...body } = req.body;

    let promImage = req.files["images"].map((v) => {
      return cloudinary.uploader.upload(v.path);
    });

    let listImage = await Promise.all(promImage);
		body.images = listImage.map((v) => v.secure_url);
		
		const product = await Product.create(body);
		product.save();

    return sendResponse(res, "Create successfully.", product);
  }),

	update: asyncHandle(async (req, res) => {
		let { ...body } = req.body;

    if (req.file){
			let promImage = req.files["images"].map((v) => {
				return cloudinary.uploader.upload(v.path);
			});
	
			let listImage = await Promise.all(promImage);
			body.images = listImage.map((v) => v.secure_url);
		}

    const product = await Product.findByIdAndUpdate(req.params.id, body, {
      new: true,
    });

    return sendResponse(res, "Update successfully.", product);
  }),

  stopWorking: asyncHandle(async (req, res) => {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { deleted: 1 },
      { new: true }
    );

    return sendResponse(res, "Product stop working.", product);
  }),

  activeWorking: asyncHandle(async (req, res) => {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { deleted: 0 },
      { new: true }
    );

    return sendResponse(res, "Product active working.", product);
  }),


  getProductByCategory: asyncHandle(async (req, res) => {
    console.log(categoryId);
    const product = await Product.find({ category: { $in: [categoryId] } })
    .populate("category")
    .sort("-updatedAt")

    return sendResponse(res, "Get list product by category successfully", product);
  }),
};
