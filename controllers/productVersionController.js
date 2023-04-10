const ProductVersion = require("../models/ProductVersion");
const Product = require("../models/Product");
const asyncHandle = require("../middlewares/asyncHandle");
const sendResponse = require("../helpers/SendResponse");

module.exports = {
  index: asyncHandle(async (req, res) => {
    console.log(req.query);
    let conditions = {};

    if (req.query.product_id) {
      conditions.product = req.query.product_id;
    }
    if (req.query.storage_id) {
      conditions.storage = req.query.storage_id;
    }
    if (req.query.color_id) {
      conditions.color = req.query.color_id;
    }

    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;
    const startIndex = (page - 1) * limit;
    const total = await ProductVersion.countDocuments(conditions);
    const totalPage = Math.ceil(total / limit);
    const pagination = {
      page,
      limit,
      total,
      totalPage,
    };

    const products = await ProductVersion.find(conditions)
      .populate("product")
      .populate("color")
      .populate("storage")
      .skip(startIndex)
      .limit(limit);

    return sendResponse(
      res,
      "Get product version successfully",
      products,
      pagination
    );
  }),

  // @route [POST] /api/product/version
  // @desc CREATE NEW PRODUCT VERSION
  create: asyncHandle(async (req, res) => {
    const product = ProductVersion(req.body);
    await product.save();

    return sendResponse(res, "Create sucessfully", product);
  }),

	getProductVersionByProduct: asyncHandle(async (req, res) => {
		const product_id = req.params.id;
    const product = await ProductVersion.find({ product: { $in: [product_id] } })
    .populate("product")
    .populate("color")
    .populate("storage");
		
		return sendResponse(res, "Get product version by same product id successfully", product);
		
  }),
};
