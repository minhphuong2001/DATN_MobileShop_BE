const Storage = require("../models/Storage");
const asyncHandle = require("../middlewares/asyncHandle");
const sendResponse = require("../helpers/SendResponse");

module.exports = {
  // @route [POST] /api/storage
  // @desc CREATE NEW STORAGE
  // @role admin
  create: asyncHandle(async (req, res, next) => {
    const newStorage = Storage(req.body);
		await newStorage.save();
		
    return sendResponse(res, "Create sucessfully", newStorage);
	}),

	// @route [POST] /api/storage
  // @desc GET LIST STORAGE
	index: asyncHandle(async (req, res) => {
    const storage = await Storage.find();

    return sendResponse(res, "Get list of storage successfully", storage);
  }),
};
