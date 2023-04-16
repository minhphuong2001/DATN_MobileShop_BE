const express = require("express");
const { verifyAccessToken } = require("../middlewares/verifyToken");
const cartController = require("../controllers/cartController");
const permission = require("../middlewares/permission");

const router = express.Router({ mergeParams: true });

router
	.route("/")
	.get(verifyAccessToken, permission("user"), cartController.getAll)
	.post(verifyAccessToken, permission("user"), cartController.add)
	.put(verifyAccessToken, permission("user"), cartController.updateMany)
router
	.route("/:id")
	.delete(verifyAccessToken, permission("user"), cartController.delete)
	.put(verifyAccessToken, permission("user"), cartController.update)
router
	.route("/count")
	.get(verifyAccessToken, permission('user'), cartController.getCount)

module.exports = router;