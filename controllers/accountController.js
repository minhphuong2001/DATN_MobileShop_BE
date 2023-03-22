const ErrorResponse = require("../helpers/ErrorResponse");
const asyncHandle = require("../middlewares/asyncHandle");
const User = require("../models/User");
const sendResponse = require("../helpers/SendResponse");

module.exports = {
  getAll: asyncHandle(async (req, res, next) => {
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 30;
    const startIndex = (page - 1) * limit;
    const total = await User.countDocuments({ deleted: 0, role: "user" });
    const totalPage = Math.ceil(total / limit);
    const pagination = {
      page,
      limit,
      total,
      totalPage,
    };
    const users = await User.find({ deleted: 0, role: "user" })
      .skip(startIndex)
      .sort("-createdAt")
      .limit(limit);
    // let us = users.filter((v) => v.deleted != 1);
    return sendResponse(res, "Get list user successfully.", users, pagination);
	}),
	
  getById: asyncHandle(async (req, res, next) => {
    let id = req.params.id;
    let acc = await User.findById(id);
    return res.status(200).json(acc);
	}),
	
  delete: asyncHandle(async (req, res, next) => {
    let id = req.params.id;
    let acc = await User.findByIdAndUpdate(id, { deleted: 1 }, { new: true });
    return res.status(200).json(acc);
  }),
};
