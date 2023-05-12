const express = require("express");
const { verifyAccessToken } = require("../middlewares/verifyToken");
const statisticalController = require("../controllers/statisticalController");
const permission = require("../middlewares/permission");

const router = express.Router({ mergeParams: true });

router
	.route("/total")
	.get(verifyAccessToken, permission("admin"), statisticalController.index)


module.exports = router;