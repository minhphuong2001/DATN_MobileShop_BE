const ProductVersion = require("../models/ProductVersion");
const Product = require("../models/Product");
const asyncHandle = require("../middlewares/asyncHandle");
const sendResponse = require("../helpers/SendResponse");

module.exports = {
  index: asyncHandle(async (req, res) => {
    // console.log(req.query);
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
    const product = ProductVersion.create(req.body);
    await product.save();

    return sendResponse(res, "Create sucessfully", product);
  }),

  createMany: asyncHandle(async (req, res) => {
    const product = await ProductVersion.insertMany(req.body);

    return sendResponse(res, "Create product version sucessfully", product);
  }),

  update: asyncHandle(async (req, res) => {
    let { ...body } = req.body;
    const product = await ProductVersion.findByIdAndUpdate(req.params.id, body, {
      new: true,
    });

    return sendResponse(res, "Update successfully.", product);
  }),

	getProductVersionByProduct: asyncHandle(async (req, res) => {
		const product_id = req.params.id;
    const product = await ProductVersion.find({ product: { $in: [product_id] } })
    .populate("product")
    .populate("color")
    .populate("storage");
		
		return sendResponse(res, "Get product version by same product id successfully", product);
		
  }),
  
  updateMany: asyncHandle(async (req, res) => {
    const products = await Promise.all(
      req.body.map(async (item) => {
        if (item._id === "") {
          const newProduct = await ProductVersion.create({
            price: item.price,
            sale_price: item.sale_price,
            quantity: item.quantity,
            color: item.color,
            storage: item.storage
          })
          await newProduct.save();
        } else {
          const newProduct = await ProductVersion.findByIdAndUpdate(item._id, {
            price: item.price,
            sale_price: item.sale_price,
            quantity: item.quantity,
            color: item.color,
            storage: item.storage
          }, { new: true });
          return newProduct;
        }
        // else {
        //   await ProductVersion.findByIdAndDelete(item._id);
        //   return null;
        // }
      })
    );

    return sendResponse(res, "Update product version sucessfully", products);
  }),
};
