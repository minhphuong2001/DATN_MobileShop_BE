const express = require("express");
const { verifyAccessToken } = require("../middlewares/verifyToken");
const productVersionController = require("../controllers/productVersionController");
const permission = require("../middlewares/permission");

const router = express.Router({ mergeParams: true });

router
	.route("/")
	.get(productVersionController.index)
	.post(verifyAccessToken, permission("admin"), productVersionController.createMany)
router
	.route("/updateMany")
	.put(verifyAccessToken, permission("admin"), productVersionController.updateMany)
router
	.route("/product/:id")
	.get(productVersionController.getProductVersionByProduct)
router
	.route("/:id")
	.put(verifyAccessToken, permission("admin"), productVersionController.update)

module.exports = router;
