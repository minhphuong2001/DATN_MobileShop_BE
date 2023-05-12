const Category = require("../models/Category");
const asyncHandle = require("../middlewares/asyncHandle");
const sendResponse = require("../helpers/SendResponse");
const cloundinary = require("../config/cloudinary");

module.exports = {
  // @route [POST] /api/category
  // @desc CREATE NEW CATEGORY
  // @role admin
  create: asyncHandle(async (req, res, next) => {
    let { ...body } = req.body;

    if (req.file) {
      let image = await cloundinary.uploader.upload(req.file.path);
      body.logo = image.secure_url;
    }

    const category = await Category.create(body);
    await category.save();

    return sendResponse(res, "Create sucessfully", category);
  }),

  // @route [POST] /api/category
  // @desc GET LIST CATEGORY
  index: asyncHandle(async (req, res) => {
    let conditions = {};

    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;
    const startIndex = (page - 1) * limit;
    const total = await Category.countDocuments(conditions);
    const totalPage = Math.ceil(total / limit);
    const pagination = {
      page,
      limit,
      total,
      totalPage,
    };

    const categories = await Category.find(conditions)
      .skip(startIndex)
      .limit(limit);

    return sendResponse(
      res,
      "Get list category successfully",
      categories,
      pagination
    );
  }),

  getById: asyncHandle(async (req, res) => { 
    const product = await Category.findById(req.params.id);

    return sendResponse(res, "Show successfully.", product);
  }),

  update: asyncHandle(async (req, res) => {
    let { ...body } = req.body;

    if (req.file) {
      let image = await cloundinary.uploader.upload(req.file.path);
      body.logo = image.secure_url;
    }

    const category = await Category.findByIdAndUpdate(req.params.id, body);
    await category.save();

    return sendResponse(res, "Update category successfully");
  }),

  delete: asyncHandle(async (req, res) => {
    const category = await Category.findByIdAndDelete(req.params.id);

    return sendResponse(res, "Delete category successfully");
  }),
};
