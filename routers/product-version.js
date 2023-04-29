const express = require("express");
const { verifyAccessToken } = require("../middlewares/verifyToken");
const productVersionController = require("../controllers/productVersionController");
const permission = require("../middlewares/permission");

const router = express.Router({ mergeParams: true });

router
	.route("/")
	.get(productVersionController.index)
	.post(verifyAccessToken, permission("admin"), productVersionController.create)
router
	.route("/product/:id")
	.get(productVersionController.getProductVersionByProduct)
router
	.route("/:id")
	.put(verifyAccessToken, permission("admin"), productVersionController.update)

module.exports = router;
