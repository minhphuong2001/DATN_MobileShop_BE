const express = require("express");
const { verifyAccessToken } = require("../middlewares/verifyToken");
const colorController = require("../controllers/colorController");
const permission = require("../middlewares/permission");

const router = express.Router({ mergeParams: true });

router
	.route("/")
	.get(colorController.index)
  .post(colorController.create);

module.exports = router;