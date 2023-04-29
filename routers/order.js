const express = require("express");
const { verifyAccessToken } = require("../middlewares/verifyToken");
const orderController = require("../controllers/orderController");
const permission = require("../middlewares/permission");

const router = express.Router({ mergeParams: true });

router
	.route("/")
	.post(verifyAccessToken, permission("user"), orderController.addOrder)
router
	.route("/user-order")
	.get(verifyAccessToken, permission("user"), orderController.getOrderUser)
router
	.route("/user-order/:id")
	.get(verifyAccessToken, orderController.getOrder)
router
	.route("/admin")
	.get(verifyAccessToken, permission("admin"), orderController.getAllOrders)
router
	.route("/admin/:id")
	.patch(verifyAccessToken, permission('admin'), orderController.updateStatus)
	.delete(verifyAccessToken, permission('admin'), orderController.deleteOrder)


module.exports = router;