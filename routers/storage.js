const express = require("express");
const { verifyAccessToken } = require("../middlewares/verifyToken");
const storageController = require("../controllers/storageController");
const permission = require("../middlewares/permission");

const router = express.Router({ mergeParams: true });

router
	.route("/")
	.get(storageController.index)
  .post(storageController.create);

module.exports = router;