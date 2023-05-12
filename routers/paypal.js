const express = require("express");
const paypalController = require("../controllers/paypalController");
const { verifyAccessToken } = require("../middlewares/verifyToken");
const permission = require("../middlewares/permission");

const router = express.Router({ mergeParams: true });

router
	.route("/pay").post(verifyAccessToken, permission("user"), paypalController.pay)
router
	.route("/success").get(verifyAccessToken, permission("user"), paypalController.orderSuccess)
router
	.route("/cancel").get(verifyAccessToken, permission("user"), paypalController.orderCancel)

module.exports = router;
