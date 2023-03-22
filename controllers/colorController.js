const Color = require("../models/Color");
const asyncHandle = require("../middlewares/asyncHandle");
const sendResponse = require("../helpers/SendResponse");

module.exports = {
  // @route [POST] /api/color
  // @desc CREATE NEW COLOR
  // @role admin
  create: asyncHandle(async (req, res, next) => {
    const color = Color(req.body);
		await color.save();
		
    return sendResponse(res, "Create sucessfully", color);
	}),

	// @route [POST] /api/color
  // @desc GET LIST COLOR
	index: asyncHandle(async (req, res) => {
    const color = await Color.find();

    return sendResponse(res, "Get list color successfully", color);
  }),
};
